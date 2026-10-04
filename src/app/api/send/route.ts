import { NextResponse } from "next/server";
import { sendNotification, setVapidDetails, WebPushError, type PushSubscription } from "web-push";
import { listSubscriptions, removeSubscription } from "@/lib/subscriptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function ensureVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:suchna@example.com";
  if (!publicKey || !privateKey) {
    throw new Error("missing-vapid");
  }
  setVapidDetails(subject, publicKey, privateKey);
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const record = payload as { title?: unknown; body?: unknown; endpoint?: unknown };
  const title = clean(record.title, 80);
  const body = clean(record.body, 180);
  const endpoint = typeof record.endpoint === "string" ? record.endpoint : "";

  if (!title || !body) {
    return NextResponse.json({ error: "Title aur message dono likho." }, { status: 400 });
  }

  try {
    ensureVapid();
  } catch {
    return NextResponse.json({ error: "Server keys missing." }, { status: 500 });
  }

  const subscriptions = await listSubscriptions();
  const message = JSON.stringify({
    title,
    body,
    tag: `suchna-${Date.now()}`,
  });

  let delivered = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      if (endpoint && subscription.endpoint === endpoint) return;
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
  return NextResponse.json({ delivered, failed, count });
}
