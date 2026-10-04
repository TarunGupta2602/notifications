function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    output[index] = raw.charCodeAt(index);
  }
  return output;
}

function sameKey(existing: ArrayBuffer | null | undefined, publicKey: string) {
  if (!existing) return true;
  const current = new Uint8Array(existing);
  const next = urlBase64ToUint8Array(publicKey);
  if (current.length !== next.length) return false;
  for (let index = 0; index < current.length; index += 1) {
    if (current[index] !== next[index]) return false;
  }
  return true;
}

export async function registerAlertWorker() {
  if (!("serviceWorker" in navigator)) return null;
  const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
  await registration.update().catch(() => undefined);
  if (registration.waiting) registration.waiting.postMessage({ type: "SKIP_WAITING" });
  return navigator.serviceWorker.ready;
}

export async function subscribeForBackgroundAlerts() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false as const, reason: "unsupported" as const };
  }
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    return { ok: false as const, reason: "denied" as const };
  }

  const registration = await registerAlertWorker();
  if (!registration?.pushManager) {
    return { ok: false as const, reason: "unsupported" as const };
  }

  const response = await fetch("/api/subscribe");
  const config = (await response.json().catch(() => null)) as { publicKey?: string; count?: number } | null;
  if (!response.ok || !config?.publicKey) {
    return { ok: false as const, reason: "keys" as const };
  }

  let subscription = await registration.pushManager.getSubscription();
  if (subscription && !sameKey(subscription.options?.applicationServerKey, config.publicKey)) {
    await subscription.unsubscribe();
    subscription = null;
  }
  if (!subscription) {
    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.publicKey),
      });
    } catch {
      return { ok: false as const, reason: "subscribe" as const };
    }
  }

  const save = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON()),
    keepalive: true,
  });
  const saved = (await save.json().catch(() => null)) as { count?: number } | null;
  if (!save.ok) return { ok: false as const, reason: "save" as const };
  return { ok: true as const, count: saved?.count ?? config.count ?? 0 };
}
