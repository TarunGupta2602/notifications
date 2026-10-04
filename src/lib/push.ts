import { sendNotification, setVapidDetails, WebPushError, type PushSubscription } from "web-push";
import { listSubscriptions, removeSubscription } from "@/lib/subscriptions";

function ensureVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:suchna@example.com";
  if (!publicKey || !privateKey) {
    throw new Error("missing-vapid");
  }
  setVapidDetails(subject, publicKey, privateKey);
}

export async function deliverPush(input: { title: string; body: string; tag?: string }) {
  try {
    ensureVapid();
  } catch {
    return { delivered: 0, failed: 0, count: 0, ready: false };
  }

  const subscriptions = await listSubscriptions();
  const message = JSON.stringify({
    title: input.title,
    body: input.body,
    tag: input.tag ?? `lark-${Date.now()}`,
  });

  let delivered = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await sendNotification(subscription as PushSubscription, message, {
          TTL: 60 * 60 * 24,
          urgency: "high",
        });
        delivered += 1;
      } catch (error) {
        failed += 1;
        if (error instanceof WebPushError && (error.statusCode === 404 || error.statusCode === 410)) {
          await removeSubscription(subscription.endpoint);
        } else {
          console.error("Push send failed", error);
        }
      }
    }),
  );

  const count = (await listSubscriptions()).length;
  return { delivered, failed, count, ready: true };
}
