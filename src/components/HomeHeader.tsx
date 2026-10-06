"use client";

import { useState } from "react";

const desktop = [
  { label: "Chat", href: "/", active: true },
  { label: "Random Chat", href: "#random-video-chat" },
  { label: "Strangers", href: "#video-chat-with-strangers" },
  { label: "Chat Girls", href: "#chat-with-girls" },
  { label: "Flirty", href: "#flirty-video-chat" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const mobile = [
  { label: "Chat Now", href: "/", active: true },
  { label: "About Us", href: "#about" },
  { label: "Safety & Rules", href: "#safety" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "#guides" },
  { label: "Contact", href: "#contact" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
];

export function HomeHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav-standard sticky top-0 z-50 border-b border-[#0b4f4a]/8 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <a href="/" className="group flex min-w-0 items-center gap-2.5">
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-[family-name:var(--font-source-serif)] text-xl tracking-tight text-[#0b4f4a] sm:text-2xl">
                Parvah
              </span>
              <span className="-mt-0.5 hidden truncate text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase sm:block">
                Random Video Chat with Strangers
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {desktop.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  item.active
                    ? "bg-[#f0fdfa] text-[#005f5a]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#005f5a]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="touch-manipulation rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden"
              aria-label="Toggle Navigation Menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {open ? (
        <button type="button" className="nav-mobile-backdrop md:hidden" aria-label="Close menu" onClick={() => setOpen(false)} />
      ) : null}
      <div className={`nav-mobile-drawer md:hidden ${open ? "nav-mobile-drawer-open" : ""}`} aria-hidden={!open}>
        <div className="nav-mobile-drawer-header">
          <span className="text-sm font-bold text-slate-900">Menu</span>
          <button
            type="button"
            className="-mr-2 rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="nav-mobile-drawer-links">
          {mobile.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`nav-mobile-link ${item.active ? "nav-mobile-link-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
