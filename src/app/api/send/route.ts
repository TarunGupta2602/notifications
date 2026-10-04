import { NextResponse } from "next/server";
import { deliverPush } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const record = payload as { title?: unknown; body?: unknown };
  const title = clean(record.title, 80);
  const body = clean(record.body, 180);

  if (!title || !body) {
    return NextResponse.json({ error: "Title aur message dono likho." }, { status: 400 });
  }

  const result = await deliverPush({ title, body });
  return NextResponse.json(result);
}
