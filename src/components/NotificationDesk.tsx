"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { AlertCard } from "@/components/AlertCard";
import { publishAlert, rememberAlert, showBrowserNotification } from "@/lib/alert-channel";
import { subscribeForBackgroundAlerts } from "@/lib/browser-push";

const HISTORY_KEY = "suchna-history";

const PRESETS = [
  {
    label: "Windows Virus",
    title: "Windows - VIRUS DETECTED",
    body: "Your Computer is Infected By Viruses. Click Here To Renew Antivirus.",
    action: "Call",
    tone: "down",
  },
  {
    label: "Chrome Virus",
    title: "Google Chrome - VIRUS DETECTED",
    body: "Viruses detected. Turn on protection and delete viruses. protoqr.xyz",
    action: "Call",
    tone: "load",
  },
  {
    label: "McAfee Trojan",
    title: "McAfee - ZEUS 2020 TROJAN DETECTED",
    body: "Click here to delete the virus. protoqr.xyz",
    action: "Call",
    tone: "down",
  },
  {
    label: "WebAdvisor Alert",
    title: "WebAdvisor - VIRUS FOUND (5)",
    body: "Your Computer is Infected By Viruses. Click Here To Renew Antivirus.",
    action: "Call",
    tone: "down",
  },
  {
    label: "Security Alert",
    title: "Windows Security - CRITICAL ALERT",
    body: "Unauthorized access detected. Your personal data is at risk. Call now for immediate support.",
    action: "Call",
    tone: "load",
  },
] as const;

type ToastTone = (typeof PRESETS)[number]["tone"] | "custom";

type SideToast = {
  id: string;
  title: string;
  body: string;
  action: string;
  tone: ToastTone;
  phone?: string;
  image?: string;
  at: string;
};

function telHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

function shrinkImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Choose a photo."));
      return;
    }
    if (file.size > 4_000_000) {
      reject(new Error("Image is too large."));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 280;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not read that image."));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL("image/jpeg", 0.72);
      URL.revokeObjectURL(url);
      if (data.length > 150_000) {
        reject(new Error("Image is too large. Try a smaller photo."));
        return;
      }
      resolve(data);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    img.src = url;
  });
}

const DELAYS = [
  { value: 0, label: "Abhi" },
  { value: 5, label: "5 sec" },
  { value: 15, label: "15 sec" },
];

type HistoryItem = {
  title: string;
  body: string;
  at: string;
};

type PermissionView = NotificationPermission | "unsupported" | "loading";
type DeliveryMode = "push" | "local" | "none";

function showLocal(title: string, body: string) {
  const notification = new Notification(title, {
    body,
    icon: `${window.location.origin}/badge`,
    tag: `suchna-${Date.now()}`,
    lang: "hi",
  });
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

function readHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is HistoryItem =>
          Boolean(item) &&
          typeof item === "object" &&
          typeof (item as HistoryItem).title === "string" &&
          typeof (item as HistoryItem).body === "string" &&
          typeof (item as HistoryItem).at === "string",
      )
      .slice(0, 8);
  } catch {
    return [];
  }
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

export function NotificationDesk() {
  const [permission, setPermission] = useState<PermissionView>("loading");
  const [mode, setMode] = useState<DeliveryMode>("none");
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState("Windows - VIRUS DETECTED");
  const [body, setBody] = useState("Your Computer is Infected By Viruses. Click Here To Renew Antivirus.");
  const [phone, setPhone] = useState("+1-503-877-9717");
  const [image, setImage] = useState("");
  const [toasts, setToasts] = useState<SideToast[]>([]);
  const [delay, setDelay] = useState(0);
  const [pendingIn, setPendingIn] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const timerRef = useRef<number | null>(null);
  const runRef = useRef(0);
  const askRef = useRef<HTMLButtonElement>(null);
  const connectRef = useRef<() => Promise<void>>(async () => {});

  const remember = useCallback((nextTitle: string, nextBody: string) => {
    setHistory((current) => {
      const next = [
        { title: nextTitle, body: nextBody, at: new Date().toISOString() },
        ...current,
      ].slice(0, 8);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const pushToast = useCallback(async (nextTitle: string, nextBody: string, nextPhone: string, nextImage: string) => {
    const preset = PRESETS.find((item) => item.title === nextTitle);
    const action = preset?.action ?? "Open";
    const toast: SideToast = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: nextTitle,
      body: nextBody,
      action,
      tone: preset?.tone ?? "custom",
      phone: action === "Call" ? nextPhone : undefined,
      image: nextImage || undefined,
      at: new Date().toISOString(),
    };
    setToasts((current) => [toast, ...current].slice(0, 4));
    publishAlert(toast);
    rememberAlert(toast);
    showBrowserNotification({ title: toast.title, body: toast.body, phone: toast.phone });
    try {
      const response = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: toast.title,
          body: toast.body,
          action: toast.action,
          tone: toast.tone,
          phone: toast.phone ?? "",
          image: toast.image ?? "",
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        push?: { delivered?: number; count?: number; ready?: boolean };
      } | null;
      if (!response.ok) {
        setError(data?.error || "The alert was not saved.");
        return;
      }
      if (typeof data?.push?.count === "number") setCount(data.push.count);
      const delivered = data?.push?.delivered ?? 0;
      if (delivered > 0) {
        setStatus(
          `Sent to ${delivered} browser${delivered === 1 ? "" : "s"}. It still arrives if the site is closed.`,
        );
        return;
      }
      if (data?.push?.ready === false) {
        setStatus("Saved for shop tabs that are open.");
        return;
      }
      setStatus("Saved for shop tabs that are open. After someone chooses Allow, the next alert reaches them with the site closed.");
    } catch {
      setError("The alert was not saved.");
    }
  }, []);

  const deliver = useCallback(
    async (nextTitle: string, nextBody: string) => {
      setSending(true);
      setError("");
      setStatus("");

      if ((PRESETS.find((item) => item.title === nextTitle)?.action ?? "Open") === "Call" && !telHref(phone)) {
        setError("Add a phone number for the Call button.");
        setSending(false);
        return;
      }

      await pushToast(nextTitle, nextBody, phone, image);
      remember(nextTitle, nextBody);
      setSending(false);
    },
    [image, phone, pushToast, remember],
  );

  const connect = useCallback(async () => {
    const result = await subscribeForBackgroundAlerts();
    if (!result.ok) {
      setMode("local");
      if (result.reason === "keys") throw new Error("keys missing");
      return;
    }
    setCount(result.count);
    setMode("push");
  }, []);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      setHistory(readHistory());

      if (!("Notification" in window) || !window.isSecureContext) {
        setPermission("unsupported");
        return;
      }

      const nextPermission = Notification.permission;
      setPermission(nextPermission);
      if (nextPermission === "granted") {
        void connect().catch(() => {
          if (!cancelled) {
            setError("Could not restore this browser. Refresh and try again.");
          }
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [connect]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  function stopTimer() {
    runRef.current += 1;
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPendingIn(null);
  }

  useEffect(() => {
    const button = askRef.current;
    if (!button || permission !== "default") return;

    const onClick = () => {
      const pending = Notification.requestPermission();
      setBusy(true);
      setError("");
      setStatus("");

      void pending
        .then(async (result) => {
          setPermission(result);
          if (result === "granted") {
            showLocal("Lark", "Notifications are on.");
            setStatus("Notifications are on.");
            await connectRef.current();
            return;
          }
          if (result === "denied") {
            setStatus("");
            setError("Notifications are blocked. Use the lock icon in the address bar, choose Allow, then refresh.");
            return;
          }
          setStatus("");
          setError("Choose Allow on the browser prompt.");
        })
        .catch(() => {
          setStatus("");
          setError("The browser prompt did not open. Try again.");
        })
        .finally(() => {
          setBusy(false);
        });
    };

    button.addEventListener("click", onClick);
    return () => button.removeEventListener("click", onClick);
  }, [permission]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    if (pendingIn !== null) {
      stopTimer();
      setStatus("Cancelled.");
      return;
    }

    const nextTitle = title.trim();
    const nextBody = body.trim();
    if (!nextTitle || !nextBody) {
      setError("Add a title and a message.");
      setStatus("");
      return;
    }

    setError("");
    const startSend = () => {
      if (delay === 0) {
        void deliver(nextTitle, nextBody);
        return;
      }

      const runId = runRef.current + 1;
      runRef.current = runId;
      let left = delay;
      setPendingIn(left);
      setStatus("");
      timerRef.current = window.setInterval(() => {
        if (runRef.current !== runId) return;
        left -= 1;
        if (left <= 0) {
          if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setPendingIn(null);
          void deliver(nextTitle, nextBody);
          return;
        }
        setPendingIn(left);
      }, 1000);
    };

    if ("Notification" in window && Notification.permission === "default") {
      const pending = Notification.requestPermission();
      void pending.then((result) => {
        if (result === "granted") {
          void connectRef.current().catch(() => undefined);
        }
        startSend();
      });
      return;
    }

    startSend();
  }

  const granted = permission === "granted";
  const locked = sending || pendingIn !== null;
  const previewTitle = title.trim() || "Notification";
  const previewBody = body.trim() || "Your message will show here.";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="pointer-events-none fixed top-4 right-3 z-50 flex w-[320px] max-w-[calc(100vw-1.5rem)] flex-col gap-1.5">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <AlertCard
              title={toast.title}
              body={toast.body}
              phone={toast.phone}
              image={toast.image}
              tone={toast.tone}
            />
          </div>
        ))}
      </div>
      <section className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h1 className="text-base font-semibold">New notification</h1>
            <p className="mt-0.5 text-sm text-muted">
              {permission === "denied"
                ? "Blocked. Use the lock icon in the address bar, choose Allow, then refresh."
                : granted
                  ? mode === "push"
                    ? `${count} browser${count === 1 ? "" : "s"} will get alerts with the site closed`
                    : "This browser shows alerts while the site is open"
                  : "Turn on notifications for this browser"}
            </p>
          </div>
          <StatusPill permission={permission} />
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 p-5">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setTitle(preset.title);
                  setBody(preset.body);
                }}
                className="rounded-md border border-line bg-white px-2.5 py-1 text-sm text-ink transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <label className="grid gap-1.5 text-sm font-medium">
            Title
            <input
              value={title}
              maxLength={80}
              disabled={locked}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11 rounded-lg border border-line bg-white px-3 text-base font-normal outline-none focus:border-ink disabled:bg-[#f8f8f8]"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium">
            Message
            <textarea
              value={body}
              maxLength={180}
              rows={4}
              disabled={locked}
              onChange={(event) => setBody(event.target.value)}
              className="resize-none rounded-lg border border-line bg-white px-3 py-2.5 text-base font-normal outline-none focus:border-ink disabled:bg-[#f8f8f8]"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium">
            Image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={locked}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                void shrinkImage(file)
                  .then((next) => {
                    setImage(next);
                    setError("");
                  })
                  .catch((reason: unknown) => {
                    setImage("");
                    setError(reason instanceof Error ? reason.message : "Could not read that image.");
                  });
              }}
              className="block w-full text-sm font-normal file:mr-3 file:h-9 file:rounded-md file:border-0 file:bg-[#f3f4f6] file:px-3 file:text-sm file:font-medium"
            />
            {image ? (
              <span className="flex items-center gap-3">
                <span
                  role="img"
                  aria-label="Chosen image"
                  className="h-12 w-12 rounded bg-cover bg-center"
                  style={{ backgroundImage: `url("${image}")` }}
                />
                <button type="button" onClick={() => setImage("")} className="text-sm font-normal text-muted underline">
                  Remove image
                </button>
              </span>
            ) : (
              <span className="text-xs font-normal text-muted">Shows on the left of the alert, like the sample cards.</span>
            )}
          </label>

          <label className="grid gap-1.5 text-sm font-medium">
            Phone for Call
            <input
              value={phone}
              type="tel"
              inputMode="tel"
              placeholder="+91 98765 43210"
              onChange={(event) => setPhone(event.target.value)}
              className="h-11 rounded-lg border border-line bg-white px-3 text-base font-normal outline-none focus:border-ink"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium">
            Send
            <select
              value={delay}
              disabled={locked}
              onChange={(event) => setDelay(Number(event.target.value))}
              className="h-11 rounded-lg border border-line bg-white px-3 text-base font-normal outline-none focus:border-ink disabled:bg-[#f8f8f8]"
            >
              {DELAYS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.value === 0 ? "Now" : `In ${item.label}`}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? "Sending…" : pendingIn !== null ? `Sending in ${pendingIn}s — cancel` : "Send"}
            </button>
            {permission === "default" ? (
              <button
                ref={askRef}
                type="button"
                disabled={busy}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Allow it at the top of the browser" : "Also allow browser alerts"}
              </button>
            ) : null}
            <p aria-live="polite" className="text-sm">
              {error ? <span className="text-[#9b2330]">{error}</span> : null}
              {!error && status ? <span className="text-[#1f6b45]">{status}</span> : null}
            </p>
          </div>
        </form>
      </section>

      <aside className="grid gap-4">
        <div className="overflow-hidden rounded-2xl border border-line bg-[#d7dde6] shadow-sm">
          <div className="flex h-8 items-center gap-1.5 border-b border-black/5 px-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="bg-[#0e141c] px-4 py-8">
            <AlertCard
              title={previewTitle}
              body={previewBody}
              phone={phone || "Your number"}
              image={image}
              tone={PRESETS.find((item) => item.title === title.trim())?.tone ?? "custom"}
            />
          </div>
        </div>

        <section className="rounded-2xl border border-line bg-card p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Sent</h2>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Nothing sent yet.</p>
          ) : (
            <ul className="mt-3 grid gap-3">
              {history.map((item, index) => (
                <li key={`${item.at}-${index}`} className="border-b border-line pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-medium">{item.title}</p>
                    <time className="shrink-0 text-xs text-muted" dateTime={item.at}>
                      {formatTime(item.at)}
                    </time>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
}

function StatusPill({ permission }: { permission: PermissionView }) {
  const label =
    permission === "granted"
      ? "On"
      : permission === "denied"
        ? "Blocked"
        : permission === "unsupported"
          ? "Unavailable"
          : permission === "loading"
            ? "Checking"
            : "Off";

  const tone =
    permission === "granted"
      ? "bg-[#e7f6ec] text-[#157a3a]"
      : permission === "denied" || permission === "unsupported"
        ? "bg-[#fdecee] text-[#9b2330]"
        : "bg-[#f3f4f6] text-[#5c6370]";

  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{label}</span>
  );
}
