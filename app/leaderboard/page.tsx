import type { Metadata } from "next";
import Link from "next/link";
import { LandingBackgroundLayer } from "@/components/landing-background-layer";

export const metadata: Metadata = {
  title: "Workout Leaderboard | Forgeonix",
  description:
    "Live gym leaderboards that drive competition with member rankings, team challenges, and PR tracking.",
};

const subtleHover =
  "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:border-cyan-400/40";

const features = [
  {
    title: "Live leaderboard",
    text: "Auto-updated rankings based on workout volume and top lifts.",
  },
  {
    title: "Team competitions",
    text: "Run team-vs-team challenges with clear standings for coaches and members.",
  },
  {
    title: "Personal records tracking",
    text: "Highlight PR progress while keeping every workout entry structured and visible.",
  },
  {
    title: "Simple gym setup",
    text: "Set up members, teams, and gyms quickly without complicated onboarding.",
  },
];

const steps = [
  "Members log workouts",
  "System calculates volume & rankings",
  "Leaderboard updates instantly",
  "Gyms run challenges effortlessly",
];

const useCases = ["Gyms", "Personal trainers", "CrossFit-style competitions", "Small teams"];

const previewRows = [
  { rank: "#1", name: "A. Carter", volume: "52,340", bestLift: "315" },
  { rank: "#2", name: "M. Brooks", volume: "49,720", bestLift: "335" },
  { rank: "#3", name: "S. Nguyen", volume: "48,110", bestLift: "295" },
];

export default function LeaderboardLandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <LandingBackgroundLayer />

      <div className="relative z-10">
        <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
          <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
            <Link
              href="/"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-zinc-100"
            >
              Back to Forgeonix
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/dashboard"
                className={`rounded-lg border border-cyan-400/40 bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-cyan-300 ${subtleHover}`}
              >
                Try Demo
              </Link>
              <Link
                href="/login"
                className={`rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-zinc-100 ${subtleHover}`}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className={`rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-zinc-100 ${subtleHover}`}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </header>

        <section className="border-b border-zinc-800/80 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="inline-flex rounded-full border border-cyan-400/30 bg-zinc-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Workout Leaderboard
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
              Live Gym Leaderboards That Drive Competition
            </h1>
            <p className="mt-5 max-w-3xl text-lg text-zinc-300">
              Track workouts, rank members, and run challenges that keep people coming back.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className={`rounded-xl border border-cyan-400/40 bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 ${subtleHover}`}
              >
                Try Demo
              </Link>
              <Link
                href="/login"
                className={`rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-100 ${subtleHover}`}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className={`rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-100 ${subtleHover}`}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-800/80 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">What It Does</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className={`rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 ${subtleHover}`}
                >
                  <h3 className="text-lg font-semibold text-zinc-100">{feature.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-800/80 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 ${subtleHover}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 text-zinc-200">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-800/80 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
              Live Demo Preview
            </p>
            <h2 className="mt-2 text-3xl font-bold">Preview the Leaderboard Experience</h2>
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/85 p-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
                <div className="grid grid-cols-4 border-b border-zinc-800 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  <span>Rank</span>
                  <span>Athlete</span>
                  <span>Total Volume</span>
                  <span>Best Lift</span>
                </div>
                {previewRows.map((row) => (
                  <div
                    key={row.rank}
                    className="grid grid-cols-4 border-b border-zinc-900 px-2 py-2 text-sm text-zinc-200 last:border-0"
                  >
                    <span>{row.rank}</span>
                    <span>{row.name}</span>
                    <span>{row.volume}</span>
                    <span>{row.bestLift}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-800/80 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Use Cases</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {useCases.map((item) => (
                <div
                  key={item}
                  className={`rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-zinc-200 ${subtleHover}`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl rounded-3xl border border-cyan-400/20 bg-zinc-900 p-8">
            <h2 className="text-3xl font-bold">Ready to start a challenge?</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className={`rounded-xl border border-cyan-400/40 bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 ${subtleHover}`}
              >
                Try Demo
              </Link>
              <Link
                href="/signup"
                className={`rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-100 ${subtleHover}`}
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
