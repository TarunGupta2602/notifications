export const ALERT_CHANNEL = "lark-alerts";

export function publishAlert(toast: unknown) {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(ALERT_CHANNEL);
  channel.postMessage(toast);
  channel.close();
}

export function showBrowserNotification(input: { title: string; body: string; phone?: string }) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const body = input.phone ? `${input.body}\n${input.phone}` : input.body;
  try {
    new Notification(input.title, {
      body,
      tag: `lark-${input.title}-${input.body}`.slice(0, 180),
      icon: `${window.location.origin}/badge`,
    });
  } catch {
    // A closed browser still receives the service-worker push.
  }
}
