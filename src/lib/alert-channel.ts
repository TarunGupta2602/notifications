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
  const tag = input.tag ?? `lark-${Date.now()}`;
  const options = {
    body,
    tag,
    icon: "/notify-icon.png",
    requireInteraction: true,
    data: { url: "/" },
  };

  const fallback = () => {
    try {
      new Notification(input.title, { body, tag, icon: `${window.location.origin}/notify-icon.png` });
    } catch {
      // A closed browser still receives the service-worker push.
    }
  };

  if (!("serviceWorker" in navigator)) {
    fallback();
    return;
  }

  void navigator.serviceWorker
    .getRegistration()
    .then(async (registration) => {
      if (!registration) {
        fallback();
        return;
      }
      try {
        await registration.showNotification(input.title, options);
      } catch {
        fallback();
      }
    })
    .catch(fallback);
}
