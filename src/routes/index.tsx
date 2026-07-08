import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import heroAsset from "@/assets/hakken-hero.png.asset.json";


export const Route = createFileRoute("/")({
  component: HakkenPage,
});

// ---------- Ransom-note headline ----------

const RANSOM_FONTS = [
  "'Anton', Impact, sans-serif",
  "'Archivo Black', sans-serif",
  "'Bungee', sans-serif",
  "'Rubik Mono One', sans-serif",
  "'Bebas Neue', sans-serif",
  "Georgia, serif",
  "'Courier New', monospace",
];

function hash(s: string, i: number) {
  let h = 0;
  for (let k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k) + i * 7) | 0;
  return Math.abs(h);
}

function RansomHeadline({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <h1
      className={`leading-none tracking-tight ${className}`}
      style={{ fontFamily: "'Anton', Impact, sans-serif" }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="ransom-word">
          {word.split("").map((ch, ci) => {
            const seed = hash(word + ch, ci + wi * 13);
            const font = RANSOM_FONTS[seed % RANSOM_FONTS.length];
            const rot = ((seed % 17) - 8) * 0.9;
            const size = 0.85 + ((seed >> 3) % 60) / 100;
            const invert = (seed >> 5) % 5 === 0;
            const highlight = !invert && (seed >> 7) % 6 === 0;
            const bg = invert
              ? "var(--ink)"
              : highlight
                ? "var(--blood)"
                : "var(--paper)";
            const color = invert || highlight ? "var(--paper)" : "var(--ink)";
            const pad = invert || highlight ? "0.02em 0.15em" : "0 0.05em";
            return (
              <span
                key={ci}
                style={{
                  fontFamily: font,
                  transform: `rotate(${rot}deg)`,
                  display: "inline-block",
                  fontSize: `${size}em`,
                  background: bg,
                  color,
                  padding: pad,
                  margin: "0 0.02em",
                  boxShadow: invert ? "2px 2px 0 rgba(0,0,0,0.2)" : undefined,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

// ---------- Owl wanted poster ----------

function OwlPoster() {
  return (
    <div className="relative mx-auto w-full max-w-sm select-none">
      <div className="relative border-4 border-[var(--ink)] bg-[var(--paper)] p-3 shadow-[8px_8px_0_var(--ink)]">
        <div
          className="text-center text-2xl md:text-3xl"
          style={{ fontFamily: "'Anton', Impact, sans-serif", letterSpacing: "0.15em" }}
        >
          WANTED
        </div>
        <div className="my-2 border-y-2 border-dashed border-[var(--ink)] py-1 text-center text-[10px] uppercase tracking-widest opacity-70">
          Dead — no reward
        </div>
        <div className="relative aspect-square bg-[oklch(0.92_0.02_85)]">
          {/* halftone bg */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0.55) 1px, transparent 1.4px)",
              backgroundSize: "5px 5px",
            }}
          />
          {/* Owl silhouette */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full"
            aria-label="Owl silhouette"
          >
            <path
              fill="var(--ink)"
              d="M100 20c-30 0-55 18-65 42-8 20-6 44 4 62-6 8-8 18-6 28 8-6 16-8 22-8-6 14-4 30 6 42 12 14 30 20 39 20s27-6 39-20c10-12 12-28 6-42 6 0 14 2 22 8 2-10 0-20-6-28 10-18 12-42 4-62-10-24-35-42-65-42Z"
            />
            <ellipse cx="72" cy="88" rx="22" ry="22" fill="var(--paper)" />
            <ellipse cx="128" cy="88" rx="22" ry="22" fill="var(--paper)" />
            <circle cx="72" cy="90" r="9" fill="var(--ink)" />
            <circle cx="128" cy="90" r="9" fill="var(--ink)" />
            <path d="M92 108 L100 122 L108 108 Z" fill="var(--blood)" />
          </svg>
          {/* DECEASED stamp */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ transform: "translate(-50%,-50%) rotate(-14deg)" }}
          >
            <div
              className="border-[6px] px-4 py-1 text-3xl md:text-4xl"
              style={{
                borderColor: "var(--blood)",
                color: "var(--blood)",
                fontFamily: "'Archivo Black', sans-serif",
                letterSpacing: "0.15em",
                background: "rgba(255,255,255,0.15)",
                opacity: 0.9,
                textShadow: "1px 1px 0 rgba(0,0,0,0.15)",
              }}
            >
              DECEASED
            </div>
          </div>
        </div>
        <div className="mt-2 text-center text-xs uppercase tracking-[0.25em]">
          Duo · est. 2011 · streak thief
        </div>
      </div>
      {/* tape */}
      <div className="tape absolute -top-4 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3" />
    </div>
  );
}

// ---------- Manifesto ----------

const MANIFESTO = [
  {
    n: "01",
    title: "An imperfect teacher is fine, if you question it.",
    body:
      "Real teachers make mistakes. So does an LLM. Catching the mistake IS the lesson.",
    tilt: "-1deg",
  },
  {
    n: "02",
    title: "Learn from the media you already love.",
    body:
      "Manga and anime. Not textbook dialogues about buying train tickets.",
    tilt: "1deg",
  },
  {
    n: "03",
    title: "Keep the streak. Kill what it's pointed at.",
    body:
      "The habit was never the problem. Point it at something real.",
    tilt: "-0.5deg",
  },
];

function Manifesto() {
  return (
    <section className="relative bg-[var(--paper)] px-4 py-16 md:py-24">
      <SectionHeader kicker="THE MANIFESTO" title="THREE RULES" />
      <div className="mx-auto mt-10 grid max-w-5xl gap-8 md:grid-cols-3">
        {MANIFESTO.map((m) => (
          <div
            key={m.n}
            className="relative bg-[var(--paper)] p-6 shadow-[6px_6px_0_var(--ink)]"
            style={{
              transform: `rotate(${m.tilt})`,
              borderTop: "8px solid var(--ink)",
            }}
          >
            <div
              className="mb-3 text-6xl leading-none"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
            >
              {m.n}
            </div>
            <h3
              className="mb-3 text-xl uppercase leading-tight"
              style={{ fontFamily: "'Anton', Impact, sans-serif", letterSpacing: "0.03em" }}
            >
              {m.title}
            </h3>
            <p className="text-base leading-relaxed">{m.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Try it ----------

const WORDS = [
  { jp: "お前", ro: "omae", gloss: "you" },
  { jp: "は", ro: "wa", gloss: "topic marker" },
  { jp: "もう", ro: "mō", gloss: "already" },
  { jp: "死んで", ro: "shinde", gloss: "die (te-form)" },
  { jp: "いる", ro: "iru", gloss: "resulting state" },
];

function TryIt() {
  return (
    <section className="relative bg-[var(--paper)] px-4 py-16 md:py-24">
      <SectionHeader kicker="TRY IT" title="A TEACHER YOU CAN ARGUE WITH" />
      <p className="mx-auto mt-4 max-w-2xl text-center text-lg">
        This is how it works. No gems. No hearts.
      </p>

      <div className="mx-auto mt-10 max-w-3xl border-4 border-[var(--ink)] bg-[var(--paper)] p-6 shadow-[8px_8px_0_var(--ink)] md:p-8">
        <div
          className="mb-6 text-center text-3xl md:text-5xl"
          style={{ fontFamily: "'Anton', Impact, sans-serif", letterSpacing: "0.05em" }}
          lang="ja"
        >
          お前はもう死んでいる
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-[var(--ink)] text-xs uppercase tracking-widest">
                <th className="py-2 pr-3">Word</th>
                <th className="py-2 pr-3">Reading</th>
                <th className="py-2">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {WORDS.map((w) => (
                <tr key={w.jp} className="border-b border-dashed border-[var(--ink)]/40">
                  <td className="py-2 pr-3 text-2xl" lang="ja">
                    {w.jp}
                  </td>
                  <td className="py-2 pr-3 italic">{w.ro}</td>
                  <td className="py-2">{w.gloss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <div className="text-xs uppercase tracking-widest opacity-60">
            Natural translation
          </div>
          <div
            className="mt-1 text-2xl md:text-3xl"
            style={{ fontFamily: "'Anton', Impact, sans-serif" }}
          >
            "You are already dead."
          </div>
        </div>

        <div
          className="relative mt-8 border-l-8 border-[var(--blood)] bg-[oklch(0.94_0.03_85)] p-4"
          style={{ transform: "rotate(-0.4deg)" }}
        >
          <div className="tape absolute -top-3 left-6 h-5 w-16 -rotate-6" />
          <div className="text-xs uppercase tracking-widest opacity-70">
            Insight
          </div>
          <p className="mt-1 text-base leading-relaxed">
            <span lang="ja">〜ている</span> here marks a{" "}
            <strong>resulting state</strong>, not an action in progress —{" "}
            <em>"is already dead,"</em> not <em>"is dying."</em>
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------- Defect form ----------

const LANGUAGES = [
  { value: "Japanese", label: "Japanese" },
  { value: "Spanish", label: "Spanish (coming soon)" },
  { value: "Korean", label: "Korean (coming soon)" },
  { value: "French", label: "French (coming soon)" },
  { value: "Mandarin", label: "Mandarin (coming soon)" },
  { value: "German", label: "German (coming soon)" },
];

const defectorSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(80),
  email: z.string().trim().email("Invalid email").max(200),
  streak: z.number().int().min(0).max(100000),
  language: z.enum([
    "Japanese",
    "Spanish",
    "Korean",
    "French",
    "Mandarin",
    "German",
  ]),
});

function DefectForm({ onJoined }: { onJoined: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [streak, setStreak] = useState<string>("0");
  const [language, setLanguage] = useState("Japanese");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = defectorSchema.safeParse({
      name,
      email,
      streak: Number(streak),
      language,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your entries.");
      return;
    }
    setStatus("loading");
    const { error: insertError } = await supabase
      .from("defectors")
      .insert(parsed.data);
    if (insertError) {
      setStatus("error");
      setError(insertError.message);
      return;
    }
    setStatus("ok");
    setName("");
    setEmail("");
    setStreak("0");
    setLanguage("Japanese");
    onJoined();
  }

  return (
    <section
      id="defect"
      className="relative bg-[var(--ink)] px-4 py-20 text-[var(--paper)] md:py-28"
    >
      <SectionHeader
        kicker="JOIN THE DEFECTORS"
        title="TURN YOURSELF IN"
        dark
      />
      <p className="mx-auto mt-4 max-w-xl text-center opacity-80">
        We'll email you when the beta opens. Your streak is safe with us.
      </p>

      <form
        onSubmit={onSubmit}
        className="mx-auto mt-10 max-w-xl space-y-5 border-4 border-[var(--paper)] bg-[var(--paper)] p-6 text-[var(--ink)] shadow-[10px_10px_0_var(--blood)] md:p-8"
      >
        <Field label="Name">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            className="w-full border-2 border-[var(--ink)] bg-transparent px-3 py-2 text-lg outline-none focus:bg-[oklch(0.94_0.03_85)]"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={200}
            className="w-full border-2 border-[var(--ink)] bg-transparent px-3 py-2 text-lg outline-none focus:bg-[oklch(0.94_0.03_85)]"
          />
        </Field>
        <Field label="Streak" helper="0 is a valid streak — day one counts.">
          <input
            type="number"
            min={0}
            max={100000}
            required
            value={streak}
            onChange={(e) => setStreak(e.target.value)}
            className="w-full border-2 border-[var(--ink)] bg-transparent px-3 py-2 text-lg outline-none focus:bg-[oklch(0.94_0.03_85)]"
          />
        </Field>
        <Field label="Language">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border-2 border-[var(--ink)] bg-transparent px-3 py-2 text-lg outline-none focus:bg-[oklch(0.94_0.03_85)]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>

        {error && (
          <div className="border-2 border-[var(--blood)] bg-[var(--blood)]/10 px-3 py-2 text-sm text-[var(--blood)]">
            {error}
          </div>
        )}

        {status === "ok" ? (
          <div
            className="border-4 border-[var(--blood)] p-4 text-center text-lg"
            style={{ fontFamily: "'Anton', Impact, sans-serif", letterSpacing: "0.05em" }}
          >
            STREAK RECEIVED. We'll email you when the beta opens.
          </div>
        ) : (
          <button
            type="submit"
            disabled={status === "loading"}
            className="stamp-btn stamp-btn-hover w-full disabled:opacity-60"
          >
            {status === "loading" ? "Defecting…" : "Defect →"}
          </button>
        )}
      </form>
    </section>
  );
}

function Field({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div
        className="mb-1 text-xs uppercase tracking-widest"
        style={{ fontFamily: "'Anton', Impact, sans-serif", letterSpacing: "0.2em" }}
      >
        {label}
      </div>
      {children}
      {helper && <div className="mt-1 text-xs opacity-60">{helper}</div>}
    </label>
  );
}

// ---------- Wall of defectors ----------

type Defector = {
  id: string;
  name: string;
  streak: number;
  language: string;
  created_at: string;
};

function useDefectors() {
  const [rows, setRows] = useState<Defector[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("defectors")
        .select("id,name,streak,language,created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (!cancelled && data) setRows(data as Defector[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { rows, refresh: () => setRefreshKey((k) => k + 1) };
}

function Wall({ rows }: { rows: Defector[] }) {
  const total = rows.reduce((s, r) => s + (r.streak || 0), 0);
  return (
    <section className="relative bg-[var(--paper)] px-4 py-16 md:py-24">
      <SectionHeader kicker="THE WALL" title="WALL OF DEFECTORS" />
      <div
        className="mx-auto mt-6 max-w-3xl text-center"
        style={{ fontFamily: "'Anton', Impact, sans-serif" }}
      >
        <div className="text-5xl md:text-7xl">
          <span
            style={{
              background: "var(--blood)",
              color: "var(--paper)",
              padding: "0.05em 0.2em",
              display: "inline-block",
              transform: "rotate(-1deg)",
            }}
          >
            {total.toLocaleString()}
          </span>
        </div>
        <div className="mt-3 text-lg uppercase tracking-widest">
          days rescued from the owl
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl border-4 border-[var(--ink)] bg-[var(--paper)] p-4 shadow-[6px_6px_0_var(--ink)] md:p-6">
        {rows.length === 0 ? (
          <div className="py-10 text-center opacity-60">
            No defectors yet. Be the first to turn yourself in.
          </div>
        ) : (
          <ul className="divide-y divide-dashed divide-[var(--ink)]/40">
            {rows.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-baseline justify-between gap-2 py-2 text-base md:text-lg"
              >
                <span className="truncate">{r.name}</span>
                <span className="opacity-70">
                  — {r.streak.toLocaleString()} days — {r.language}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ---------- Section header (torn divider + kicker) ----------

function SectionHeader({
  kicker,
  title,
  dark = false,
}: {
  kicker: string;
  title: string;
  dark?: boolean;
}) {
  const fg = dark ? "var(--paper)" : "var(--ink)";
  return (
    <div className="text-center">
      <div
        className="inline-block px-2 text-xs uppercase"
        style={{
          background: "var(--blood)",
          color: "var(--paper)",
          letterSpacing: "0.3em",
          transform: "rotate(-1deg)",
        }}
      >
        {kicker}
      </div>
      <h2
        className="mt-4 text-4xl md:text-6xl"
        style={{
          fontFamily: "'Anton', Impact, sans-serif",
          letterSpacing: "0.03em",
          color: fg,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function TornDivider({ color = "var(--paper)" }: { color?: string }) {
  return (
    <div className="relative -mt-1 h-4 w-full torn-top" style={{ background: color }} />
  );
}

// ---------- Hero ----------

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-6 md:pb-24 md:pt-8">
      <header className="flex items-center justify-between">
        <div
          className="text-2xl md:text-3xl"
          style={{
            fontFamily: "'Archivo Black', sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          Hakken<span style={{ color: "var(--blood)" }}>.</span>
        </div>
        <div className="hidden text-xs uppercase tracking-[0.3em] md:block">
          A self-taught rebellion
        </div>
      </header>

      <div className="mt-8 grid items-center gap-10 md:mt-14 md:grid-cols-5">
        <div className="md:col-span-3">
          <div
            className="mb-4 inline-block px-2 py-1 text-xs uppercase"
            style={{
              background: "var(--ink)",
              color: "var(--paper)",
              letterSpacing: "0.3em",
              transform: "rotate(-2deg)",
            }}
          >
            1999-day communiqué
          </div>
          <RansomHeadline
            text="GOD SAVE THE STREAK"
            className="text-[15vw] leading-[0.9] md:text-[7rem]"
          />
          <p className="mt-6 max-w-xl text-lg md:text-xl">
            Tonight I'm killing my <strong>1999-day Duolingo streak</strong>.
            The habit comes with me.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#defect" className="stamp-btn stamp-btn-hover no-underline">
              Defect →
            </a>
            <a
              href="#try"
              className="text-sm uppercase tracking-widest underline decoration-2 underline-offset-4"
            >
              See how it works
            </a>
          </div>
        </div>
        <div className="md:col-span-2">
          <OwlPoster />
        </div>
      </div>
    </section>
  );
}

// ---------- Footer ----------

function Footer() {
  return (
    <footer className="border-t-4 border-[var(--ink)] bg-[var(--paper)] px-4 py-10 text-center">
      <p className="text-sm uppercase tracking-widest">
        Built in one night at Punk Software Hack Night.
      </p>
      <div
        className="mt-3 text-2xl"
        style={{
          fontFamily: "'Archivo Black', sans-serif",
          letterSpacing: "0.05em",
        }}
      >
        Hakken<span style={{ color: "var(--blood)" }}>.</span>
      </div>
    </footer>
  );
}

// ---------- Page ----------

function HakkenPage() {
  const { rows, refresh } = useDefectors();

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <Hero />
      <TornDivider color="var(--ink)" />
      <div className="bg-[var(--ink)] pb-2 text-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-4 py-3 text-center text-xs uppercase tracking-[0.3em]">
          ★ Defect · Study · Question your teacher · Repeat ★
        </div>
      </div>
      <TornDivider color="var(--paper)" />

      <Manifesto />
      <TornDivider color="var(--ink)" />
      <div id="try" className="bg-[var(--ink)] py-1" />
      <TornDivider color="var(--paper)" />

      <TryIt />

      <DefectForm onJoined={refresh} />

      <Wall rows={rows} />

      <Footer />
    </main>
  );
}
