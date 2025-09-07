import React, { useState } from "react";
import {
  Activity,
  Copy,
  MessageCircle,
  Gamepad2,
  Image,
  Server,
  Shield,
  Check,
} from "lucide-react";

/* ========= QUICK CONFIG ========= */
const SITE = {
  name: "The Cowboy Hat Crew",
  tagline: "Hardcore survival. Fair play. Tight-knit community.",
  ip: "104.243.35.140",
  queryPort: "2312",
  gamePort: "2302",
  map: "Chernarus",
  discordInvite: "https://discord.gg/pBFhVFm2bd",
  bannerUrl: "/1.png", // put an image at public/1.png
  logoUrl: "/1.png",
  donateUrl: "#",
  features: [
    { title: "Custom bunker cases", desc: "Top-tier loot curated for end-game runs." },
    { title: "Smarter infected AI", desc: "Louder, faster, and deadlier horde behavior." },
    { title: "SNAFU Weapons", desc: "Fully integrated, balanced spawn tables." },
  ],
  rules: [
    "No cheating, duping, or exploiting.",
    "Respect all players and admins.",
    "No stream sniping or harassment.",
    "Base raiding: Weekdays 18:00–23:00; Weekends 12:00–23:59 (UK).",
    "English in side/global chat.",
  ],
  gallery: [
    { src: "/gallery/shot1.jpg", alt: "Night convoy on the highway" },
    { src: "/gallery/shot2.jpg", alt: "Forest extraction near the river" },
    { src: "/gallery/shot3.jpg", alt: "Bunker entrance at dusk" },
  ],
};

/* ========= LAYOUT HELPERS ========= */
const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</div>
);

const Section = ({ id, eyebrow, title, icon: Icon, children }) => (
  <section id={id} className="scroll-mt-24 py-16 md:py-20">
    <Container>
      <div className="mb-8 flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-amber-500" aria-hidden />}
        <p className="text-xs uppercase tracking-[0.16em] text-amber-400/80">{eyebrow}</p>
      </div>
      <h2 className="mb-6 text-2xl font-semibold text-amber-300 md:text-3xl">{title}</h2>
      {children}
    </Container>
  </section>
);

/* ========= STATUS ========= */
function useDayZStatus() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const ctrl = new AbortController();

    const tick = async () => {
      try {
        const u = `/.netlify/functions/dayz-status?ip=${SITE.ip}&port=${SITE.queryPort}`;
        const r = await fetch(u, { signal: ctrl.signal });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        setData(j);
        setError(null);
      } catch (e) {
        setError(String(e));
      }
    };

    tick();
    const id = setInterval(tick, 60000); // poll every 60s
    return () => {
      ctrl.abort();
      clearInterval(id);
    };
  }, []);

  return { data, error };
}

/* ========= NAV ========= */
function Nav() {
  return (
    <header className="relative z-20">
      <Container className="flex items-center justify-between py-4">
        <a href="#" className="group inline-flex items-center gap-3">
          <img
            src={SITE.logoUrl}
            alt="Server logo"
            className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/10"
          />
          <span className="text-lg font-semibold text-amber-300 group-hover:text-amber-200">
            {SITE.name}
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-zinc-200/90 md:flex">
          <a className="hover:text-amber-300" href="#about">About</a>
          <a className="hover:text-amber-300" href="#connect">Connect</a>
          <a className="hover:text-amber-300" href="#rules">Rules</a>
          <a className="hover:text-amber-300" href="#gallery">Gallery</a>
          <a
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 hover:border-amber-400/60"
            href={SITE.discordInvite}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="h-4 w-4" /> Discord
          </a>
        </nav>
      </Container>
    </header>
  );
}

/* ========= HERO ========= */
function Hero() {
  const steamConnect = `steam://connect/${SITE.ip}:${SITE.gamePort}`;
  const copy = () => navigator.clipboard?.writeText(`${SITE.ip}:${SITE.gamePort}`);
  return (
    <div className="relative isolate">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${SITE.bannerUrl})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black"
      />
      <Nav />
      <Container className="relative z-10 pb-24 pt-16 md:pb-40 md:pt-28">
        <div className="max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-600/90 px-3 py-1.5 text-sm text-white">
            <Server className="h-4 w-4" /> {SITE.map} • Survival Events
          </span>
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-amber-300 drop-shadow md:text-6xl">
            {SITE.name}
          </h1>
          <p className="mt-4 text-lg text-zinc-100/90 md:text-xl">{SITE.tagline}</p>
          <StatusBar />
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={steamConnect}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-white hover:bg-amber-700"
            >
              <Gamepad2 className="h-4 w-4" /> Connect via Steam
            </a>
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-zinc-100 hover:bg-white/10"
            >
              <Copy className="h-4 w-4" /> Copy IP: {SITE.ip}:{SITE.gamePort}
            </button>
            <a
              href={SITE.discordInvite}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-zinc-100 hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" /> Join Discord
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}

function StatusBar() {
  const { data, error } = useDayZStatus();
  const online = data?.online ?? false;
  const players = data?.players ?? 0;
  const max = data?.max ?? 60;
  return (
    <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200/90 backdrop-blur">
      <Activity className={`h-4 w-4 ${online ? "text-green-400" : "text-red-400"}`} />
      {error ? (
        <span>Status unavailable</span>
      ) : online ? (
        <span>Online • {players}/{max} players</span>
      ) : (
        <span>Server offline</span>
      )}
    </div>
  );
}

/* ========= ABOUT ========= */
function About() {
  return (
    <Section id="about" eyebrow="About" title="Why play here?" icon={Shield}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {SITE.features.map((f, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-2 flex items-center gap-2 text-amber-200 font-semibold">
              <Check className="h-5 w-5" /> {f.title}
            </div>
            <p className="text-zinc-200/90 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ========= CONNECT ========= */
function Connect() {
  const steamConnect = `steam://connect/${SITE.ip}:${SITE.gamePort}`;
  const copy = () => navigator.clipboard?.writeText(`${SITE.ip}:${SITE.gamePort}`);
  return (
    <Section id="connect" eyebrow="Connect" title="Jump in within seconds" icon={Server}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-amber-200 font-semibold mb-2">Direct connect</h3>
          <div className="flex items-center gap-2 text-sm">
            <input
              readOnly
              value={`${SITE.ip}:${SITE.gamePort}`}
              className="w-full rounded-lg bg-black/30 px-3 py-2"
            />
            <button
              onClick={copy}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
            >
              Copy
            </button>
          </div>
          <a
            href={steamConnect}
            className="mt-3 block rounded-xl bg-amber-600 px-4 py-2 text-center text-white hover:bg-amber-700"
          >
            <Gamepad2 className="inline h-4 w-4 -mt-1 mr-2" /> Open Steam
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-amber-200 font-semibold mb-2">Discord</h3>
          <p className="text-sm text-zinc-200/90">Find groups, events, and support.</p>
          <a
            href={SITE.discordInvite}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block rounded-xl border border-white/20 px-4 py-2 text-center hover:bg-white/10"
          >
            <MessageCircle className="inline h-4 w-4 -mt-1 mr-2" /> Join Discord
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-amber-200 font-semibold mb-2">Support the server</h3>
          <p className="text-sm text-zinc-200/90">Keep the lights on and unlock community goals.</p>
          <a
            href={SITE.donateUrl}
            className="mt-3 block rounded-xl border border-white/20 px-4 py-2 text-center hover:bg-white/10"
          >
            Donate
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ========= RULES ========= */
function Rules() {
  return (
    <Section id="rules" eyebrow="Rules" title="Play fair. Survive smarter." icon={Shield}>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <ul className="list-inside list-disc space-y-2 text-zinc-200/90">
          {SITE.rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ========= GALLERY ========= */
function Gallery() {
  return (
    <Section id="gallery" eyebrow="Gallery" title="From the field" icon={Image}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {SITE.gallery.map((g, i) => (
          <figure
            key={i}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <img
              src={g.src}
              alt={g.alt}
              className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <figcaption className="p-3 text-sm text-zinc-300/90">{g.alt}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ========= FOOTER ========= */
function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 py-10">
      <Container className="flex flex-col items-center justify-between gap-6 text-sm text-zinc-400 md:flex-row">
        <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a className="hover:text-amber-300" href="#about">About</a>
          <a className="hover:text-amber-300" href="#connect">Connect</a>
          <a className="hover:text-amber-300" href="#rules">Rules</a>
          <a className="hover:text-amber-300" href="#gallery">Gallery</a>
        </div>
      </Container>
    </footer>
  );
}

/* ========= PAGE ========= */
export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Hero />
      <main>
        <About />
        <Connect />
        <Rules />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
