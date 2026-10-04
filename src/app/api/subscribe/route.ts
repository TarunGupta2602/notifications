import { NextResponse } from "next/server";
import { isStoredSubscription, listSubscriptions, removeSubscription, saveSubscription } from "@/lib/subscriptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return NextResponse.json({ error: "Server keys missing." }, { status: 500 });
  }

  const subscriptions = await listSubscriptions();
  return NextResponse.json({ publicKey, count: subscriptions.length });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!isStoredSubscription(payload)) {
    return NextResponse.json({ error: "Subscription invalid hai." }, { status: 400 });
  }

  const count = await saveSubscription(payload);
  return NextResponse.json({ ok: true, count });
}

export async function DELETE(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const endpoint =
    payload && typeof payload === "object" && "endpoint" in payload
      ? (payload as { endpoint?: unknown }).endpoint
      : "";
  if (typeof endpoint !== "string" || endpoint.length < 12 || endpoint.length > 2000) {
    return NextResponse.json({ error: "Subscription invalid hai." }, { status: 400 });
  }

  const count = await removeSubscription(endpoint);
  return NextResponse.json({ ok: true, count });
}
