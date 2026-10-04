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
};

const GAP_MS = 1100;
const ECHO_MS = 5000;

function playChime(ctx: AudioContext) {
  if (ctx.state === "suspended") void ctx.resume();
  const now = ctx.currentTime;
  [784, 1046].forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + index * 0.11;
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.09, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.34);
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

    function onPointerDown() {
      if (!("Notification" in window) || Notification.permission !== "default") return;
      void Notification.requestPermission().then((result) => {
        if (result === "granted") {
          void subscribeForBackgroundAlerts().catch(() => undefined);
          replayTriple();
        }
      });
    }

    void registerAlertWorker().catch(() => undefined);
    if ("Notification" in window && Notification.permission === "granted") {
      void subscribeForBackgroundAlerts().catch(() => undefined);
    }

    const channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(ALERT_CHANNEL);
    channel?.addEventListener("message", onChannel);
    window.addEventListener("pointerdown", onPointerDown);
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
      window.removeEventListener("pointerdown", onPointerDown);
      void audio?.close();
    };
  }, [isDesk]);

  if (isDesk || toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-4 right-3 z-50 flex w-[320px] max-w-[calc(100vw-1.5rem)] flex-col gap-1.5">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <AlertCard
            title={toast.title}
            body={toast.body}
            phone={toast.phone}
            image={toast.image}
            tone={toast.tone}
            onClose={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
          />
        </div>
      ))}
    </div>
  );
}
