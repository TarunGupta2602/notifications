import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { kvConfigured, kvGet, kvSet, memoryGet, memorySet } from "@/lib/kv";

export type Broadcast = {
  id: string;
  title: string;
  body: string;
  action: string;
  tone: "down" | "load" | "custom" | "order" | "reminder" | "offer";
  phone?: string;
  image?: string;
  at: string;
};

const filePath = path.join(process.cwd(), "data", "broadcasts.json");
const storeKey = "lark:broadcasts";

function isBroadcast(value: unknown): value is Broadcast {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<Broadcast>;
  return (
    typeof record.id === "string" &&
    typeof record.title === "string" &&
    typeof record.body === "string" &&
    typeof record.action === "string" &&
    (record.phone === undefined || typeof record.phone === "string") &&
    (record.image === undefined || typeof record.image === "string") &&
    (record.tone === "down" ||
      record.tone === "load" ||
      record.tone === "custom" ||
      record.tone === "order" ||
      record.tone === "reminder" ||
      record.tone === "offer") &&
    typeof record.at === "string"
  );
}

async function readRaw() {
  if (kvConfigured()) return kvGet(storeKey);
  try {
    const raw = await readFile(filePath, "utf8");
    if (raw) {
      memorySet(storeKey, raw);
      return raw;
    }
  } catch {
    // Vercel does not keep this file between servers.
  }
  return memoryGet(storeKey);
}

async function readAll() {
  try {
    const raw = await readRaw();
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isBroadcast);
  } catch {
    return [];
  }
}

async function writeAll(items: Broadcast[]) {
  const raw = JSON.stringify(items, null, 2);
  memorySet(storeKey, raw);
  if (kvConfigured()) {
    await kvSet(storeKey, raw);
    return;
  }
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, raw);
  } catch {
    // The in-memory copy still serves this server.
  }
}

export async function addBroadcast(input: Omit<Broadcast, "id" | "at">) {
  const item: Broadcast = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    at: new Date().toISOString(),
  };
  const all = await readAll();
  // Filter out old broadcasts with "website is down" or old phone numbers
  const filtered = all.filter(b => 
    !b.title.toLowerCase().includes("website is down") &&
    !b.body.toLowerCase().includes("website is down") &&
    b.phone !== "7456096455"
  );
  filtered.push(item);
  await writeAll(filtered.slice(-40));
  return item;
}

export async function latestBroadcast() {
  const all = await readAll();
  return all.at(-1) ?? null;
}

export async function listBroadcastsAfter(after: string) {
  const all = await readAll();
  // Filter out bad broadcasts
  const cleaned = all.filter(b =>
    !b.title.toLowerCase().includes("website is down") &&
    !b.body.toLowerCase().includes("website is down") &&
    b.phone !== "7456096455"
  );
  // If we filtered anything, rewrite the file
  if (cleaned.length !== all.length) {
    await writeAll(cleaned.slice(-40));
  }
  const cutoff = Date.parse(after);
  if (Number.isNaN(cutoff)) return cleaned.slice(-10);
  return cleaned.filter((item) => Date.parse(item.at) > cutoff);
}
