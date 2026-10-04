self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function showNotification(data) {
  const title = typeof data.title === "string" && data.title ? data.title : "Lark";
  const body = typeof data.body === "string" ? data.body : "";
  const tag = typeof data.tag === "string" && data.tag ? data.tag : `suchna-${Date.now()}`;

  return self.registration.showNotification(title, {
    body,
    icon: "/badge",
    badge: "/badge",
    tag,
    data: { url: "/" },
  });
}

self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { body: event.data.text() };
    }
  }
  event.waitUntil(showNotification(data));
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    event.waitUntil(showNotification(event.data));
  }
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
