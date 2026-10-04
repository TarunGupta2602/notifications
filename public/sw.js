self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    output[index] = raw.charCodeAt(index);
  }
  return output;
}

function showNotification(data) {
  const title = typeof data.title === "string" && data.title ? data.title : "Lark";
  const body = typeof data.body === "string" ? data.body : "";
  const tag = typeof data.tag === "string" && data.tag ? data.tag : `lark-${Date.now()}`;
  const payload = { body, tag, data: { url: "/" } };

  return self.registration
    .showNotification(title, { ...payload, icon: "/badge", badge: "/badge", renotify: true })
    .catch(() => self.registration.showNotification(title, payload));
}

async function refreshSubscription(event) {
  const response = await fetch("/api/subscribe");
  if (!response.ok) return;
  const config = await response.json();
  if (!config.publicKey) return;

  const subscription =
    event.newSubscription ||
    (await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.publicKey),
    }));

  await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  const oldEndpoint = event.oldSubscription && event.oldSubscription.endpoint;
  if (oldEndpoint && oldEndpoint !== subscription.endpoint) {
    await fetch("/api/subscribe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: oldEndpoint }),
    });
  }
}

self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      try {
        data = { body: event.data.text() };
      } catch {
        data = {};
      }
    }
  }
  event.waitUntil(showNotification(data));
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    event.waitUntil(showNotification(event.data));
  }
});

self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(refreshSubscription(event));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow("/");
    }),
  );
});
