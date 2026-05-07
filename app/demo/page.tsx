import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Live Leaderboard Demo | Forgeonix",
  description: "Public demo of the Forgeonix workout leaderboard.",
};

const cardHover =
  "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:border-cyan-400/40";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-cyan-500/30 bg-zinc-900/80 p-6 sm:p-8">
          <p className="inline-flex rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            Demo Data
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Live Workout Leaderboard Demo</h1>
          <p className="mt-3 max-w-3xl text-sm text-zinc-300 sm:text-base">
            A live workout leaderboard for gyms, teams, and fitness challenges.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard" className={`rounded-xl border border-cyan-400/40 bg-zinc-950 px-4 py-2 text-sm font-semibold text-cyan-300 ${cardHover}`}>
              Open Member Dashboard
            </Link>
          </div>
        </header>
      </div>
    </main>
  );
}
