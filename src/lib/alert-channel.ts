export const ALERT_CHANNEL = "lark-alerts";
const LAST_ALERT_KEY = "lark-last-alert";

export function publishAlert(toast: unknown) {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(ALERT_CHANNEL);
  channel.postMessage(toast);
  channel.close();
}

export function rememberAlert(toast: unknown) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(LAST_ALERT_KEY, JSON.stringify(toast));
  } catch {
    // A full browser store should not block the alert.
  }
}

export function rememberedAlert() {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_ALERT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function showBrowserNotification(input: { title: string; body: string; phone?: string; tag?: string }) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const body = input.phone ? `${input.body}\n${input.phone}` : input.body;
  try {
    new Notification(input.title, {
      body,
      tag: input.tag ?? `lark-${input.title}-${input.body}`.slice(0, 180),
      icon: `${window.location.origin}/badge`,
    });
  } catch {
    // A closed browser still receives the service-worker push.
  }
}
