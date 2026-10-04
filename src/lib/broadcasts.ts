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

export async function addBroadcast(input: Omit<Broadcast, "id" | "at"> & { id?: string }) {
  const id = input.id && /^[A-Za-z0-9-]{8,80}$/.test(input.id) ? input.id : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const item: Broadcast = {
    ...input,
    id,
    at: new Date().toISOString(),
  };
  const all = await readAll();
  all.push(item);
  await writeAll(all.slice(-40));
  return item;
}

export async function latestBroadcast() {
  const all = await readAll();
  return all.at(-1) ?? null;
}

export async function listBroadcastsAfter(after: string) {
  const all = await readAll();
  const cutoff = Date.parse(after);
  if (Number.isNaN(cutoff)) return all.slice(-10);
  return all.filter((item) => Date.parse(item.at) > cutoff);
}
