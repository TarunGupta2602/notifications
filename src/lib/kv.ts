function restUrl() {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
}

function restToken() {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
}

export function kvConfigured() {
  return Boolean(restUrl() && restToken());
}

async function command(args: string[]) {
  const response = await fetch(restUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${restToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("kv");
  const data = (await response.json()) as { result?: unknown };
  return data.result ?? null;
}

export async function kvGet(key: string) {
  const result = await command(["GET", key]);
  return typeof result === "string" ? result : null;
}

export async function kvSet(key: string, value: string) {
  await command(["SET", key, value]);
}

const memory = globalThis as typeof globalThis & { __larkStore?: Map<string, string> };

function memoryBag() {
  if (!memory.__larkStore) memory.__larkStore = new Map();
  return memory.__larkStore;
}

export function memoryGet(key: string) {
  return memoryBag().get(key) ?? null;
}

export function memorySet(key: string, value: string) {
  memoryBag().set(key, value);
}
