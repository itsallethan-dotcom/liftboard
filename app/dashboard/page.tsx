"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Avatar } from "@/components/avatar";
import { useAppData } from "@/hooks/use-app-data";

export default function DashboardPage() {
  const {
    loading,
    user,
    profile,
    profileDisplayName,
    globalLeaderboard,
    teamLeaderboard,
    gymLeaderboard,
  } = useAppData({
    requireAuth: false,
    includePrivateData: false,
  });
  const [tab, setTab] = useState<"individual" | "teams" | "gyms">("individual");

  if (loading) return <main className="min-h-screen bg-gray-950" />;

  return (
    <AppShell
      title="Leaderboard"
      user={user}
      profileDisplayName={profileDisplayName}
      avatarUrl={profile?.avatar_url ?? null}
    >
      {!user ? (
        <section className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-slate-100">Live Gym Leaderboard</h2>
          <p className="mt-2 text-sm text-slate-300">
            Track rankings live. Log in to record workouts, join teams, and compete in challenges.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/login"
              className="rounded-lg border border-cyan-400/40 bg-slate-950 px-3 py-1.5 text-sm font-semibold text-cyan-300"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm font-semibold text-slate-200"
            >
              Sign Up
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-300"
            >
              Join the Challenge
            </Link>
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <div className="flex gap-2">
          <button
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              tab === "individual"
                ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 bg-slate-950"
            }`}
            onClick={() => setTab("individual")}
          >
            Individual
          </button>
          <button
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              tab === "teams"
                ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 bg-slate-950"
            }`}
            onClick={() => setTab("teams")}
          >
            Teams
          </button>
          <button
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              tab === "gyms"
                ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 bg-slate-950"
            }`}
            onClick={() => setTab("gyms")}
          >
            Gyms
          </button>
        </div>
      </section>

      {tab === "individual" ? (
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h2 className="text-lg font-semibold">Individual Leaderboard</h2>
          <div className="mt-3 space-y-2 md:hidden">
            {globalLeaderboard.map((entry, index) => (
              <article key={entry.userId} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <p className="font-semibold">
                  #{index + 1} {entry.displayName}
                </p>
                <p className="text-sm text-slate-300">Volume: {entry.totalVolume.toLocaleString()}</p>
                <p className="text-sm text-slate-300">Best lift: {entry.bestLift.toLocaleString()}</p>
                <p className="text-sm text-slate-400">Gym: {entry.gymName}</p>
                <p className="text-sm text-slate-400">Team: {entry.teamName}</p>
              </article>
            ))}
          </div>
          <div className="mt-3 hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-2 py-2">Rank</th>
                  <th className="px-2 py-2">Athlete</th>
                  <th className="px-2 py-2">Total Volume</th>
                  <th className="px-2 py-2">Best Lift</th>
                  <th className="px-2 py-2">Gym</th>
                  <th className="px-2 py-2">Team</th>
                </tr>
              </thead>
              <tbody>
                {globalLeaderboard.map((entry, index) => (
                  <tr key={entry.userId} className="border-b border-slate-800">
                    <td className="px-2 py-2">#{index + 1}</td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <Avatar name={entry.displayName} avatarUrl={entry.avatarUrl} size="sm" />
                        <span>{entry.displayName}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2">{entry.totalVolume.toLocaleString()}</td>
                    <td className="px-2 py-2">{entry.bestLift.toLocaleString()}</td>
                    <td className="px-2 py-2">{entry.gymName || "No gym"}</td>
                    <td className="px-2 py-2">{entry.teamName || "No team"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : tab === "teams" ? (
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h2 className="text-lg font-semibold">Team Leaderboard</h2>
          <div className="mt-3 space-y-2">
            {teamLeaderboard.map((team, index) => (
              <article key={team.teamId} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <p className="font-semibold">
                  #{index + 1} {team.teamName}
                </p>
                <p className="text-sm text-slate-300">Volume: {team.totalVolume.toLocaleString()}</p>
                <p className="text-sm text-slate-300">Best lift: {team.bestLift.toLocaleString()}</p>
              </article>
            ))}
            {teamLeaderboard.length === 0 ? (
              <p className="text-sm text-slate-300">No leaderboard data yet.</p>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h2 className="text-lg font-semibold">Gym Leaderboard</h2>
          <div className="mt-3 space-y-2">
            {gymLeaderboard.map((gym, index) => (
              <article key={gym.gymId} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <p className="font-semibold">
                  #{index + 1} {gym.gymName}
                </p>
                <p className="text-sm text-slate-300">Volume: {gym.totalVolume.toLocaleString()}</p>
                <p className="text-sm text-slate-300">Best lift: {gym.bestLift.toLocaleString()}</p>
              </article>
            ))}
            {gymLeaderboard.length === 0 ? (
              <p className="text-sm text-slate-300">No gym leaderboard data yet.</p>
            ) : null}
          </div>
        </section>
      )}
    </AppShell>
  );
}
