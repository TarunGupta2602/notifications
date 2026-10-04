import { NextResponse } from "next/server";
import { addBroadcast, latestBroadcast, listBroadcastsAfter } from "@/lib/broadcasts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("latest") === "1") {
    const item = await latestBroadcast();
    return NextResponse.json({ item });
  }
  const after = url.searchParams.get("after") ?? "";
  const items = await listBroadcastsAfter(after);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const record = payload as { title?: unknown; body?: unknown; action?: unknown; tone?: unknown; phone?: unknown };
  const title = clean(record.title, 80);
  const body = clean(record.body, 180);
  const action = clean(record.action, 40) || "Open";
  const phone = clean(record.phone, 20).replace(/[^\d+]/g, "");
  const tone =
    record.tone === "down" ||
    record.tone === "load" ||
    record.tone === "custom" ||
    record.tone === "order" ||
    record.tone === "reminder" ||
    record.tone === "offer"
      ? record.tone
      : "custom";

  if (!title || !body) {
    return NextResponse.json({ error: "Add a title and a message." }, { status: 400 });
  }

  const item = await addBroadcast({ title, body, action, tone, phone: phone || undefined });
  return NextResponse.json({ item });
}
