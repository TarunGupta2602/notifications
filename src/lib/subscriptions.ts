import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BlobNotFoundError, get, put } from "@vercel/blob";
import { kvConfigured, kvGet, kvSet, memoryGet, memorySet } from "@/lib/kv";

export type StoredSubscription = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

const filePath = path.join(process.cwd(), "data", "subscriptions.json");
const storeKey = "lark:subscriptions";
const blobPath = "lark-subscriptions.json";

function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readBlob() {
  try {
    const result = await get(blobPath, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    return await new Response(result.stream).text();
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

async function writeBlob(raw: string) {
  await put(blobPath, raw, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

let chain: Promise<unknown> = Promise.resolve();

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task, task);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function isStoredSubscription(value: unknown): value is StoredSubscription {
  if (!value || typeof value !== "object") return false;

  const record = value as Partial<StoredSubscription>;
  if (typeof record.endpoint !== "string" || record.endpoint.length > 2000) return false;

  try {
    const url = new URL(record.endpoint);
    if (url.protocol !== "https:") return false;
  } catch {
    return false;
  }

  const keys = record.keys;
  if (!keys || typeof keys.p256dh !== "string" || typeof keys.auth !== "string") return false;
  if (keys.p256dh.length < 20 || keys.p256dh.length > 200) return false;
  if (keys.auth.length < 10 || keys.auth.length > 200) return false;

  return true;
}

async function readRaw() {
  if (blobConfigured()) return readBlob();
  if (kvConfigured()) return kvGet(storeKey);
  const fromFile = await readFile(filePath, "utf8").catch(() => null);
  if (fromFile) {
    memorySet(storeKey, fromFile);
    return fromFile;
  }
  return memoryGet(storeKey);
}

async function readAll() {
  const raw = await readRaw();
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isStoredSubscription);
}

async function writeAll(subscriptions: StoredSubscription[]) {
  const raw = JSON.stringify(subscriptions, null, 2);
  memorySet(storeKey, raw);
  if (blobConfigured()) {
    await writeBlob(raw);
    return;
  }
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

export function listSubscriptions() {
  return withLock(readAll);
}

export function saveSubscription(subscription: StoredSubscription) {
  return withLock(async () => {
    const all = await readAll();
    const next = all.filter((item) => item.endpoint !== subscription.endpoint);
    next.push(subscription);
    const trimmed = next.slice(-500);
    await writeAll(trimmed);
    return trimmed.length;
  });
}

export function removeSubscription(endpoint: string) {
  return withLock(async () => {
    const all = await readAll();
    const next = all.filter((item) => item.endpoint !== endpoint);
    if (next.length !== all.length) await writeAll(next);
    return next.length;
  });
}
