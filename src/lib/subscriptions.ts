import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredSubscription = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

const filePath = path.join(process.cwd(), "data", "subscriptions.json");

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

async function readAll() {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredSubscription);
  } catch {
    return [];
  }
}

async function writeAll(subscriptions: StoredSubscription[]) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(subscriptions, null, 2));
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
