"use client";

import { useEffect, useState } from "react";
import { AlertCard, type AlertTone } from "@/components/AlertCard";

type LiveToast = {
  id: string;
  title: string;
  body: string;
  action: string;
  tone: AlertTone;
  phone?: string;
  at: string;
};

const GAP_MS = 1100;

function playChime(ctx: AudioContext) {
  if (ctx.state === "suspended") void ctx.resume();
  const now = ctx.currentTime;
  [784, 1046].forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + index * 0.11;
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.09, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.34);
  });
}

export function LiveToasts() {
  const [toasts, setToasts] = useState<LiveToast[]>([]);

  useEffect(() => {
    let stopped = false;
    let since = new Date().toISOString();
    let busy = false;
    let wait = 0;
    const queue: LiveToast[] = [];
    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    const audio = AudioCtx ? new AudioCtx() : null;

    function pump() {
      if (stopped || busy) return;
      const next = queue.shift();
      if (!next) return;
      busy = true;
      setToasts((current) => [...current, next].slice(-6));
      if (audio) playChime(audio);
      wait = window.setTimeout(() => {
        busy = false;
        pump();
      }, GAP_MS);
    }

    function enqueue(items: LiveToast[]) {
      queue.push(...items);
      pump();
    }

    async function pullNew() {
      try {
        const response = await fetch(`/api/broadcast?after=${encodeURIComponent(since)}`);
        if (!response.ok) return;
        const data = (await response.json()) as { items?: LiveToast[] };
        const items = data.items ?? [];
        if (stopped || items.length === 0) return;
        since = items[items.length - 1]?.at ?? since;
        enqueue(items);
      } catch {
        // The shop page keeps working if a check fails.
      }
    }

    async function showLatestThreeTimes() {
      try {
        const response = await fetch("/api/broadcast?latest=1");
        if (!response.ok) return;
        const data = (await response.json()) as { item?: LiveToast | null };
        const item = data.item;
        if (stopped || !item) return;
        since = item.at;
        enqueue(
          [0, 1, 2].map((copy) => ({
            ...item,
            id: `${item.id}-load-${copy}`,
          })),
        );
      } catch {
        // A missed load alert can still arrive on the next send.
      }
    }

    void showLatestThreeTimes();
    const timer = window.setInterval(() => {
      void pullNew();
    }, 2000);

    return () => {
      stopped = true;
      window.clearTimeout(wait);
      window.clearInterval(timer);
      void audio?.close();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-16 right-3 z-50 flex w-[340px] max-w-[calc(100vw-1.5rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <AlertCard
            title={toast.title}
            body={toast.body}
            phone={toast.phone}
            tone={toast.tone}
            onClose={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
          />
        </div>
      ))}
    </div>
  );
}
