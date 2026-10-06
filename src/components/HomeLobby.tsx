"use client";

import { useEffect, useState } from "react";

const AGE_KEY = "parvah_age_confirmed";

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5V7.8a1.8 1.8 0 0 0-1.8-1.8H5.8A1.8 1.8 0 0 0 4 7.8v8.4A1.8 1.8 0 0 0 5.8 18h7.4a1.8 1.8 0 0 0 1.8-1.8v-2.7l4.2 2.4V8.1L15 10.5Z" />
    </svg>
  );
}

export function HomeLobby() {
  const [gate, setGate] = useState(false);
  const [copied, setCopied] = useState<"invite" | "link" | null>(null);

  useEffect(() => {
    setGate(window.localStorage.getItem(AGE_KEY) !== "true");
  }, []);

  async function copyLink(which: "invite" | "link") {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(which);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="-mt-14 sm:-mt-16">
        <section className="chat-lobby">
          <div className="chat-lobby-scene" aria-hidden>
            <div className="chat-lobby-aurora chat-lobby-aurora-a" />
            <div className="chat-lobby-aurora chat-lobby-aurora-b" />
            <div className="chat-lobby-noise" />
          </div>
          <div className="chat-lobby-center">
            <div className="chat-lobby-status" aria-live="polite">
              <span className="chat-lobby-status-dot is-live" />
              People online now
            </div>
            <h1 className="chat-lobby-title">
              Random video chat
              <span className="chat-lobby-title-glow"> no signup.</span>
            </h1>
            <nav className="chat-lobby-query-links" aria-label="Related chats">
              <a href="#video-chat-with-strangers">Video chat with strangers</a>
              <a href="#omegle-alternative">Omegle alternative</a>
            </nav>
            <p className="chat-lobby-sub chat-lobby-sub-desktop">
              Free 1-on-1 webcam chat — no signup. Meet someone new in seconds for talk, flirt, or real connection. Adults 18+ only.
            </p>
            <p className="chat-lobby-sub chat-lobby-sub-mobile">Free random video chat. Tap start — no signup, 18+ only.</p>
            <div className="chat-lobby-cta-wrap">
              <div className="chat-lobby-cta-ring" aria-hidden />
              <button type="button" className="chat-lobby-cta">
                <CameraIcon />
                <span>Start Matching</span>
              </button>
            </div>
            <div className="chat-invite">
              <p className="chat-invite-copy">Matches are faster with more people online</p>
              <div className="chat-invite-actions">
                <button type="button" className="chat-invite-btn" onClick={() => void copyLink("invite")}>
                  {copied === "invite" ? "Link copied" : "Invite a friend"}
                </button>
                <button type="button" className="chat-invite-btn chat-invite-btn-ghost" onClick={() => void copyLink("link")}>
                  {copied === "link" ? "Link copied" : "Copy link"}
                </button>
                <button type="button" className="chat-invite-btn chat-invite-btn-wa" onClick={shareWhatsApp}>
                  WhatsApp
                </button>
              </div>
            </div>
            <p className="chat-lobby-fine">18+ only · No signup · Skip anytime</p>
            <div className="chat-lobby-pills">
              <span>100% Free</span>
              <span>No Signup</span>
              <span>1-on-1 Video</span>
              <span>Worldwide</span>
            </div>
          </div>
        </section>
      </div>
      {gate ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/90 p-0 backdrop-blur-md sm:items-center sm:p-4" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="age-gate-title"
            aria-describedby="age-gate-desc"
            className="w-full max-w-md space-y-6 rounded-t-3xl border border-slate-200/80 bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center outline-none sm:rounded-3xl sm:p-8"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#005f5a] text-2xl font-black text-white">
              18+
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-widest text-[#00776e] uppercase">Parvah</p>
              <h2 id="age-gate-title" className="text-xl font-black text-slate-900">
                Adults Only — 18+
              </h2>
              <p id="age-gate-desc" className="text-sm leading-relaxed text-slate-600">
                This site is free random video chat for adults. Matches may include flirty or intimate conversation between consenting adults. By continuing, you confirm you are at least 18 and agree to our{" "}
                <a href="#terms" className="font-semibold text-[#00776e] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#safety" className="font-semibold text-[#00776e] hover:underline">
                  Community Guidelines
                </a>
                .
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="chat-cta-primary w-full rounded-xl py-3.5 text-sm font-black text-white"
                onClick={() => {
                  window.localStorage.setItem(AGE_KEY, "true");
                  setGate(false);
                }}
              >
                I am 18 or older — Continue
              </button>
              <a href="https://www.google.com" className="w-full rounded-xl py-3 text-sm font-semibold text-slate-600 transition hover:text-slate-900">
                I am under 18 — Leave
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
