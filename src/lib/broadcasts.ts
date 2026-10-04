import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type Broadcast = {
  id: string;
  title: string;
  body: string;
  action: string;
  tone: "down" | "load" | "custom" | "order" | "reminder" | "offer";
  phone?: string;
  at: string;
};

const filePath = path.join(process.cwd(), "data", "broadcasts.json");

function isBroadcast(value: unknown): value is Broadcast {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<Broadcast>;
  return (
    typeof record.id === "string" &&
    typeof record.title === "string" &&
    typeof record.body === "string" &&
    typeof record.action === "string" &&
    (record.phone === undefined || typeof record.phone === "string") &&
    (record.tone === "down" ||
      record.tone === "load" ||
      record.tone === "custom" ||
      record.tone === "order" ||
      record.tone === "reminder" ||
      record.tone === "offer") &&
    typeof record.at === "string"
  );
}

async function readAll() {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isBroadcast);
  } catch {
    return [];
  }
}

async function writeAll(items: Broadcast[]) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(items, null, 2));
}

export async function addBroadcast(input: Omit<Broadcast, "id" | "at">) {
  const item: Broadcast = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
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
