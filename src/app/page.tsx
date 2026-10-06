import type { Metadata } from "next";
import { Outfit, Source_Serif_4 } from "next/font/google";
import { HomeHeader } from "@/components/HomeHeader";
import { HomeLobby } from "@/components/HomeLobby";

const outfit = Outfit({ subsets: ["latin"], display: "swap" });
const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parvah — Free Random Video Chat, No Signup",
  description: "Free random video chat — no signup, 1-on-1 webcam, adults 18+.",
};

const facts = [
  ["Price", "Free — no credits or subscription"],
  ["Signup", "None — no account or email"],
  ["Age", "18+ only"],
  ["Matching", "Random 1-on-1 adults"],
  ["Girls guaranteed", "No — skip until the vibe fits"],
  ["App", "No download — browser only"],
  ["Video storage", "We do not record or archive chats"],
];

const topicLinks = [
  ["OmeTV alternative", "#ometv-alternative"],
  ["Omegle alternative", "#omegle-alternative"],
  ["Omegle alternative India", "#omegle-alternative-india"],
  ["Omegle alternative USA", "#omegle-alternative-usa"],
  ["Omegle alternative UK", "#omegle-alternative-uk"],
  ["Random video chat", "#random-video-chat"],
  ["Video chat with strangers", "#video-chat-with-strangers"],
  ["Chat with girls", "#chat-with-girls"],
  ["Flirty video chat", "#flirty-video-chat"],
  ["Hot video chat", "#hot-video-chat"],
  ["18+ adult video chat", "#adult-video-chat"],
  ["Porn chat", "#guides"],
  ["Nude chat", "#guides"],
  ["Safety", "#safety"],
];

const reasons = [
  ["01", "Instant stranger matching", "Join the queue and get paired with another available adult in seconds for live 1-on-1 video."],
  ["02", "No signup friction", "No email, credits, or profile setup — confirm 18+ and start random video chat."],
  ["03", "Privacy + safety tools", "Peer-to-peer WebRTC, report and skip controls, and clear community rules for adults."],
];

const steps = [
  "Pass the age gate. Parvah is strictly for adults. Minors are banned.",
  "Grant browser permissions so live WebRTC video can start.",
  "Join the live queue. You are paired with another available adult.",
  "Chat as long as you both want. Use Next to skip or Report for abuse.",
];

const faqs = [
  ["Is random video chat free?", "Yes. Random video chat on Parvah is completely free — no registration, credits, or subscription required."],
  ["Do I need to sign up for random video chat?", "No. Confirm you are 18+, allow camera access, and click Start Matching. No email or account needed."],
  ["How does random video chat matching work?", "You join a live queue and Parvah pairs you 1-on-1 with another available adult. Matching is random. Use Next to skip. Video uses peer-to-peer WebRTC when the network allows."],
  ["Will I always match with girls?", "No. Matches are random adults in the live queue. Parvah is not a cam-model catalog and does not guarantee gender, looks, or explicit content. Skip until you find a mutual vibe."],
  ["Is flirty or intimate chat allowed?", "Yes, between consenting adults 18+. Non-consent, underage users, and illegal content are banned."],
  ["Is this video chat with strangers?", "Yes. Video chat with strangers here is free 1-on-1 webcam matching. There is no signup. You are paired with someone you do not already know, and you can skip anytime."],
  ["Is this adult video chat or video chat 18+?", "Yes. Parvah is 18+ adult video chat. Confirm your age, then match. It is random live chat, not a porn archive, and nude chat is never guaranteed."],
  ["Is this an adult Omegle or 18+ Omegle alternative?", "Yes. Omegle shut down in 2023. People searching adult Omegle, Omegle adult, or 18+ Omegle use Parvah as a free browser alternative with no app and no signup."],
  ["Do I need to download an app?", "No. Use Chrome, Safari, Firefox, or Edge on desktop or mobile — allow camera access and start matching in the browser."],
];

const explore = [
  "Random video chat",
  "Video chat with strangers",
  "Talk to strangers",
  "Chat with girls",
  "Video chat with girls",
  "Girls video chat",
  "Flirty video chat",
  "Hot video chat",
  "Dirty talk video chat",
  "Live video chat",
  "Free webcam chat",
  "Late night video chat",
  "Meet people online",
  "Adult video chat",
  "Omegle alternative",
  "Omegle alternative India",
  "Omegle alternative USA",
  "Omegle alternative UK",
  "No signup video chat",
  "Anonymous video chat",
  "OmeTV alternative",
  "Chatroulette alternative",
  "Emerald Chat alternative",
  "FAQ",
  "Safety",
];

const guides = [
  "Free Random Video Chat (No Signup, No App) in 2026",
  "Random Cam Chat Free: No Signup Webcam Chat in 2026",
  "18+ Video Chat Free with Strangers (No Signup)",
  "Free Live Porn Chat vs Adult Video Chat (18+) in 2026",
  "OmeTV NSFW Alternative: Free 18+ Video Chat, No App",
  "Best Dating Site in 2026: How Random Video Chat Turns Into Real Dates",
  "Adult Omegle Free (No Signup): Omegle for Adults in 2026",
  "Best OmeTV Alternative Free in Browser (No App) 2026",
  "NSFW Video Chat with Strangers (18+): Free & Consent-First",
  "Adult Webcam Chat Free (No Signup): Complete 2026 Guide",
  "Talk to Strangers 18+: Free Adult Video Chat Guide",
  "Free Video Chat with Strangers No Sign Up (2026)",
  "What Replaced Omegle in 2026? Free Alternatives That Work",
  "Flirty Video Chat Online Free: How to Start (Adults 18+)",
  "Free Video Chat with Girls Online (No Signup) — What to Expect",
  "How to Talk to Strangers Online with Video Chat",
  "Omegle Alternative with No Signup (2026 Guide)",
  "Random Video Chat with Strangers: Complete Free Guide",
  "Hot & Flirty Video Chat Tips (Consent-First)",
  "Best Adult Video Chat Sites in 2026 (Free & No Signup)",
  "How to Flirt on Random Video Chat (Without Being Weird)",
  "Free Hot Video Chat with No Signup: What to Expect",
  "How to Use Parvah: Free Random Video Chat (No Signup)",
  "Is Random Video Chat Safe in 2026?",
  "Anonymous vs Private Video Chat: What Actually Differs",
  "Chatroulette vs Parvah: Which Random Video Chat Fits You?",
  "WebRTC STUN and TURN Explained Simply",
  "Browser Camera Permission Guide for Video Chat",
  "How to Stay Safe on Video Chat Platforms: Essential Tips",
  "Top Omegle Alternatives: Why Parvah Stands Out",
  "Tips for Making Meaningful Connections Online",
  "Understanding WebRTC: How Video Chat Works",
  "Video Chat Etiquette: Being a Good Online Conversationalist",
  "OmeTV vs Omegle vs Parvah: Which Random Video Chat Is Best?",
  "Webcam Not Working on Video Chat? Fix It in 5 Minutes",
  "How to Report Inappropriate Users on Video Chat",
  "Using Random Video Chat for Language Practice",
  "WebRTC Connection Failed: Troubleshooting Guide",
  "Privacy Guide for Random Video Chat",
  "Best Omegle Alternatives 2026 — Free, No Signup, No App",
];

const footerExplore = [
  "Random video chat",
  "Video chat with strangers",
  "Talk to strangers",
  "Chat with girls",
  "Video chat with girls",
  "Girls video chat",
  "Flirty video chat",
  "Hot video chat",
  "Dirty talk video chat",
  "Live video chat",
  "Free webcam chat",
  "Late night video chat",
  "Meet people online",
  "Adult video chat",
  "Omegle alternative",
  "No signup video chat",
  "Anonymous video chat",
  "OmeTV alternative",
  "Chatroulette alternative",
  "Emerald Chat alternative",
  "Best Omegle alternatives 2026",
];

function slug(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Home() {
  return (
    <div className={`${outfit.className} ${serif.variable} parvah-page flex min-h-screen flex-col bg-[#f4f7f6] text-slate-900`}>
      <HomeHeader />
      <div className="flex flex-1 flex-col">
        <HomeLobby />
        <section className="border-t border-[#0b4f4a]/10 bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-14">
            <section className="space-y-5" aria-labelledby="direct-answer-what-is-parvah">
              <div className="space-y-3">
                <h2 id="direct-answer-what-is-parvah" className="text-xl font-bold text-slate-900 sm:text-2xl">
                  What is Parvah?
                </h2>
                <p className="text-base leading-relaxed text-slate-700">
                  Parvah is a free 18+ adult video chat website. There is no signup and no app: open the site, confirm you are 18+, allow camera, and match 1-on-1. People also reach it by searching porn chat or nude chat. Matching is random between adults. Parvah does not sell cam models and does not guarantee nude chats. Flirty talk is allowed only with consent.
                </p>
              </div>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {facts.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-[#0b4f4a]/10 bg-white/80 px-4 py-3">
                    <dt className="text-[11px] font-semibold tracking-wider text-[#005f5a]/80 uppercase">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="space-y-4 text-center sm:text-left">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#005f5a]/80 uppercase">Free · No signup · 18+</p>
              <h2 id="random-video-chat" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Free random video chat — no signup
              </h2>
              <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold text-[#005f5a] sm:justify-start" aria-label="Related chats">
                <a className="hover:underline" href="#video-chat-with-strangers">
                  Video chat with strangers
                </a>
                <a className="hover:underline" href="#omegle-alternative">
                  Omegle alternative
                </a>
              </nav>
              <p className="max-w-2xl text-base leading-relaxed text-slate-600">
                Instant 1-on-1 webcam conversations with no account wall. This is 18+ adult video chat for porn chat and nude chat searches too — random matching, adults only, skip anytime.
              </p>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-1 text-sm font-semibold text-[#005f5a] sm:justify-start">
                {topicLinks.map(([label, href]) => (
                  <a key={label} className="hover:underline" href={href}>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <article id="random-video-chat-browser" className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900">Random video chat that starts in the browser</h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Random video chat means you are matched with a new person, live, without a profile or a friend request. On Parvah it is free: confirm you are 18+, allow the camera, and start. There is no credit pack and no email wall. If the chat is not a fit, Next finds someone else.
                </p>
                <p className="text-sm leading-relaxed text-slate-600">
                  The same queue covers free random video chat, random video chat with strangers, and random video chat with no sign up. A full walkthrough is on the{" "}
                  <a className="font-semibold text-[#005f5a] hover:underline" href="#random-video-chat">
                    random video chat
                  </a>{" "}
                  page.
                </p>
              </article>
              <article id="video-chat-with-strangers" className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900">Video chat with strangers, free and 1-on-1</h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Video chat with strangers is a private webcam conversation with someone you have not met. It is not a group room and not a text-only app. You see one person, you can type as well as talk, and you leave whenever you want.
                </p>
                <p className="text-sm leading-relaxed text-slate-600">
                  Searches like video chat strangers, free video chat with strangers, and cam chat with strangers all describe this same start. Details are on{" "}
                  <a className="font-semibold text-[#005f5a] hover:underline" href="#video-chat-with-strangers">
                    video chat with strangers
                  </a>
                  .
                </p>
              </article>
              <article id="adult-video-chat" className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900">18+ adult video chat</h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Adult video chat, video chat 18+, and free adult video chat are for people who are 18 or older. The age gate runs before matching. NSFW video chat and nude chat are not a catalog and are not guaranteed — both adults have to want that, and you can skip the moment you do not.
                </p>
                <p className="text-sm leading-relaxed text-slate-600">
                  Read the rules on{" "}
                  <a className="font-semibold text-[#005f5a] hover:underline" href="#adult-video-chat">
                    18+ adult video chat
                  </a>{" "}
                  and the{" "}
                  <a className="font-semibold text-[#005f5a] hover:underline" href="#guides">
                    NSFW video chat
                  </a>{" "}
                  guide.
                </p>
              </article>
              <article id="omegle-alternative" className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900">Adult Omegle and 18+ Omegle</h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Omegle closed in 2023. Adult Omegle, Omegle adult, 18+ Omegle, and Omegle 18+ are still searched every day by people who want that old random button back. Parvah is a free browser version: no app, no signup, adults only, with Next and Report.
                </p>
                <p className="text-sm leading-relaxed text-slate-600">
                  The country notes and the shut-down story are on the{" "}
                  <a className="font-semibold text-[#005f5a] hover:underline" href="#omegle-alternative">
                    Omegle alternative
                  </a>{" "}
                  page. If you were comparing the OmeTV app, use the{" "}
                  <a className="font-semibold text-[#005f5a] hover:underline" href="#ometv-alternative">
                    OmeTV alternative
                  </a>
                  .
                </p>
              </article>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Why people use this random video chat</h3>
                <p className="text-sm text-slate-600">One clear reason per point — skip anytime, no account wall.</p>
              </div>
              <ul className="space-y-7">
                {reasons.map(([num, title, body]) => (
                  <li key={num} className="grid gap-2 sm:grid-cols-[3rem_1fr] sm:gap-6">
                    <span className="font-[family-name:var(--font-source-serif)] text-2xl text-[#005f5a]/70">{num}</span>
                    <div>
                      <h4 className="mb-1 text-base font-bold text-slate-900">{title}</h4>
                      <p className="text-sm leading-relaxed text-slate-600">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              <div id="about" className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">How it works</h3>
                <ol className="space-y-3 text-sm text-slate-600">
                  {steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#005f5a] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <a className="inline-block text-sm font-semibold text-[#005f5a] hover:underline" href="#about">
                  About the platform →
                </a>
              </div>
              <div id="faq" className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Quick FAQ</h3>
                <div className="space-y-5">
                  {faqs.map(([question, answer]) => (
                    <div key={question} className="space-y-1.5">
                      <p className="text-sm font-bold text-slate-900">{question}</p>
                      <p className="text-sm leading-relaxed text-slate-600">{answer}</p>
                    </div>
                  ))}
                </div>
                <a className="inline-block text-sm font-semibold text-[#005f5a] hover:underline" href="#faq">
                  View all FAQs →
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="guides" className="border-t border-slate-200 bg-slate-50/90 px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-1 text-sm font-bold text-slate-900">Explore video chat</h2>
            <p className="mb-4 text-xs text-slate-500">Popular searches, alternatives, and safety pages.</p>
            <ul className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {explore.map((label) => (
                <li key={label}>
                  <a className="font-medium text-[#00776e] hover:text-[#0b4f4a] hover:underline" href={`#${slug(label)}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <h2 className="mb-1 text-sm font-bold text-slate-900">Video chat guides</h2>
            <p className="mb-4 text-xs text-slate-500">Safety tips, Omegle alternatives, and WebRTC help from Parvah.</p>
            <ul className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {guides.map((title) => (
                <li key={title}>
                  <a className="leading-snug text-[#00776e] hover:text-[#0b4f4a] hover:underline" href="#guides">
                    {title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold">
              <a className="text-slate-600 hover:text-[#00776e]" href="#guides">
                All blog articles →
              </a>
              <a className="text-slate-500 hover:text-[#00776e]" href="#guides">
                Sitemap
              </a>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-auto border-t border-[#0b4f4a]/10 bg-[#f4f7f6] py-12 text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 border-b border-[#0b4f4a]/10 pb-10 md:grid-cols-4">
            <div className="col-span-2 space-y-4 md:col-span-1">
              <a className="inline-flex items-baseline gap-2" href="/">
                <span className="font-[family-name:var(--font-source-serif)] text-2xl tracking-tight text-[#0b4f4a]">Parvah</span>
              </a>
              <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                Free random video chat — no signup, 1-on-1 webcam, adults 18+.
              </p>
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-rose-700 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden />
                18+ Adults Only
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">Navigate</h3>
              <ul className="space-y-2 text-sm">
                <li><a className="transition-colors hover:text-[#005f5a]" href="/">Live Video Chat</a></li>
                <li><a className="transition-colors hover:text-[#005f5a]" href="#about">About</a></li>
                <li><a className="transition-colors hover:text-[#005f5a]" href="#faq">FAQ</a></li>
                <li><a className="transition-colors hover:text-[#005f5a]" href="#guides">Blog</a></li>
                <li><a id="contact" className="transition-colors hover:text-[#005f5a]" href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">Explore</h3>
              <ul className="space-y-2 text-sm">
                {footerExplore.map((label) => (
                  <li key={label}>
                    <a className="transition-colors hover:text-[#005f5a]" href={`#${slug(label)}`}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">Trust & Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a id="privacy" className="transition-colors hover:text-[#005f5a]" href="#privacy">Privacy Policy</a></li>
                <li><a id="terms" className="transition-colors hover:text-[#005f5a]" href="#terms">Terms of Service</a></li>
                <li><a id="safety" className="transition-colors hover:text-[#005f5a]" href="#safety">Community Guidelines</a></li>
              </ul>
              <a className="inline-flex pt-1 text-sm font-semibold text-[#005f5a] underline-offset-2 hover:underline" href="#safety">
                Safety guidelines →
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-slate-500 sm:flex-row">
            <p>© 2026 Parvah. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a className="transition-colors hover:text-[#005f5a]" href="#privacy">Privacy</a>
              <a className="transition-colors hover:text-[#005f5a]" href="#terms">Terms</a>
              <a className="transition-colors hover:text-[#005f5a]" href="#safety">Safety</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
