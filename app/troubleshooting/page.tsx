import { ForgeonixNavMark } from "@/components/forgeonix-mark";
import { LandingBackgroundLayer } from "@/components/landing-background-layer";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Troubleshooting & Problem Solving | Forgeonix",
  description:
    "Real-world debugging across systems, infrastructure, and applications — diagnosis, root cause, resolution, and verification.",
};

const cardHover =
  "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:border-cyan-400/40";

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400/80">
      <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-cyan-400/60" />
      {children}
    </p>
  );
}

export default function TroubleshootingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <LandingBackgroundLayer />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-md">
          <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5">
            <a
              href="/"
              className="flex items-center gap-2.5 text-base font-semibold tracking-wide text-zinc-100"
            >
              <ForgeonixNavMark />
              <span>Forgeonix</span>
            </a>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm sm:gap-3">
              <a className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300" href="/">
                Home
              </a>
              <a
                className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300"
                href="/#projects"
              >
                Projects
              </a>
              <a
                className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300"
                href="/infrastructure"
              >
                Infrastructure
              </a>
              <span className="rounded-md px-3 py-1.5 font-medium text-cyan-300">
                Troubleshooting
              </span>
              <a className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300" href="/resume">
                Resume
              </a>
              <a
                href="/dashboard"
                className="rounded-md border border-cyan-400/40 bg-zinc-900/80 px-3 py-1.5 font-semibold text-cyan-300 transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Open Leaderboard
              </a>
            </div>
          </nav>
        </header>

        <section className="fn-cine-hero fn-cine-hero--compact">
          <div className="fn-cine-hero__bg" aria-hidden>
            <div className="fn-cine-hero__bg-base" />
            <div className="fn-cine-hero__bg-bloom" />
            <div className="fn-cine-hero__grid" />
            <div className="fn-cine-hero__dots" />
            <div className="fn-cine-hero__scan" />
            <div className="fn-cine-hero__light" />
            <div className="fn-cine-hero__vignette" />
          </div>

          <div className="relative z-[1] mx-auto max-w-6xl px-6 pt-24 pb-16 text-left md:pt-28 md:pb-20">
            <p className="mb-4 inline-flex max-w-full flex-wrap gap-x-2 rounded-full border border-cyan-400/25 bg-black/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-cyan-300/90 backdrop-blur-sm sm:text-sm">
              Case studies · Debugging
            </p>
            <h1 className="fn-cine-title max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl">
              Troubleshooting &amp; Problem Solving
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
              Real-world issues I&apos;ve diagnosed and resolved across systems,
              infrastructure, and applications.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/"
                className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700/90 bg-zinc-950/35 px-6 py-3 font-semibold text-zinc-100 backdrop-blur-sm"
              >
                Back Home
              </a>
              <a
                href="/infrastructure"
                className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700/90 bg-zinc-950/35 px-6 py-3 font-semibold text-zinc-100 backdrop-blur-sm"
              >
                View Infrastructure
              </a>
              <a
                href="/dashboard"
                className="fn-cine-btn fn-cine-btn--primary rounded-2xl bg-gradient-to-b from-cyan-300 to-cyan-500 px-6 py-3 font-semibold text-zinc-950"
              >
                Open Leaderboard
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Case studies</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">
              Structured breakdowns: environment, symptoms, root cause, fix, and
              verified outcome.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <CaseCard
                title="Docker Service Unreachable in Portainer"
                environment="Docker (LXC / VM), Portainer"
                symptoms={[
                  '"Local environment unreachable"',
                  "Containers not responding",
                ]}
                rootCause="Docker daemon / networking misconfiguration inside container"
                resolution={[
                  "Adjusted container configuration",
                  "Restarted Docker service",
                  "Verified connectivity",
                ]}
                result="Services restored and accessible"
              />
              <CaseCard
                title="Supabase Profile Creation Failing"
                environment="Next.js, Supabase"
                symptoms={[
                  "New users unable to complete signup",
                  "Insert errors on profile creation",
                ]}
                rootCause="Row Level Security (RLS) blocking inserts"
                resolution={[
                  "Implemented ensureProfileRow logic",
                  "Adjusted policies to allow user-scoped insert",
                ]}
                result="Successful user onboarding and profile creation"
              />
              <CaseCard
                title="Tailwind Build Failure (Cannot Resolve Module)"
                environment="Next.js, TailwindCSS"
                symptoms={[`Build error: "Can't resolve tailwindcss"`]}
                rootCause="Incorrect project root resolution with Turbopack"
                resolution={[
                  "Fixed project root configuration",
                  "Verified dependencies and config files",
                ]}
                result="Successful production build"
              />
              <CaseCard
                title="Email Deliverability & Authentication Setup"
                environment="Custom domain email (Zoho), DNS"
                symptoms={[
                  "Emails flagged or untrusted",
                  "Missing authentication records",
                ]}
                rootCause="No DMARC policy + incomplete DNS setup"
                resolution={[
                  "Configured SPF, DKIM, and DMARC",
                  "Monitored reports and moved toward enforcement",
                ]}
                result="Improved deliverability and domain trust"
              />
              <CaseCard
                title="Host Validation / Access Issues in Local Services"
                environment="Docker, reverse proxy / local networking"
                symptoms={[
                  "Services accessible locally but failing via domain",
                ]}
                rootCause="Host validation / DNS routing mismatch"
                resolution={[
                  "Adjusted host configuration",
                  "Verified DNS and service routing",
                ]}
                result="Stable and consistent access"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">How I approach problems</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">
              Repeatable workflow—evidence first, then targeted change.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ApproachCard text="Reproduce the issue" />
              <ApproachCard text="Check logs and timestamps" />
              <ApproachCard text="Isolate variables" />
              <ApproachCard text="Identify root cause (not symptoms)" />
              <ApproachCard text="Apply targeted fix" />
              <ApproachCard text="Verify and document" />
            </div>
          </div>
        </section>

        <footer className="border-t border-zinc-800 px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 text-sm text-zinc-400 sm:flex-row">
            <p>Forgeonix © 2026</p>
            <a href="mailto:admin@forgeonix.dev" className="hover:text-cyan-300">
              admin@forgeonix.dev
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

function CaseCard({
  title,
  environment,
  symptoms,
  rootCause,
  resolution,
  result,
}: {
  title: string;
  environment: string;
  symptoms: string[];
  rootCause: string;
  resolution: string[];
  result: string;
}) {
  return (
    <article className={`rounded-3xl border border-zinc-800 bg-zinc-900 p-6 lg:p-7 ${cardHover}`}>
      <h3 className="text-xl font-semibold leading-snug">{title}</h3>
      <FieldLabel>Environment</FieldLabel>
      <p className="mt-2 text-sm text-zinc-300">{environment}</p>
      <FieldLabel>Symptoms</FieldLabel>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-400">
        {symptoms.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <FieldLabel>Root cause</FieldLabel>
      <p className="mt-2 text-sm text-zinc-300">{rootCause}</p>
      <FieldLabel>Resolution</FieldLabel>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-400">
        {resolution.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <FieldLabel>Result</FieldLabel>
      <p className="mt-2 text-sm font-medium text-zinc-200">{result}</p>
    </article>
  );
}

function ApproachCard({ text }: { text: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 ${cardHover}`}
    >
      <span
        className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/50"
        aria-hidden
      />
      <span>{text}</span>
    </div>
  );
}
