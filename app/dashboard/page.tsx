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

  if (loading) return <main className="forgeonix-app min-h-screen" />;

  const panel = "forgeonix-app-shell-panel rounded-sm";
  const tabActive = "border-[#67e8f9]/50 bg-[#67e8f9]/10 text-[#a5f3fc]";
  const tabIdle = "border-white/10 bg-[#141414]/80 text-[#e0e0e0]";
  const rowCard = "rounded-sm border border-white/[0.06] bg-[#141414]/80 p-3";

  return (
    <AppShell
      title="Leaderboard"
      user={user}
      profileDisplayName={profileDisplayName}
      avatarUrl={profile?.avatar_url ?? null}
    >
      {!user ? (
        <section className={`${panel} border-[#67e8f9]/30 p-5`}>
          <h2 className="text-xl font-semibold text-[#e8e8e8]">Live Gym Leaderboard</h2>
          <p className="mt-2 text-sm text-[#a0a0a0]">
            Track rankings live. Log in to record workouts, join teams, and compete in challenges.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/login"
              className="rounded-sm border border-[#67e8f9]/40 bg-[#141414]/80 px-3 py-1.5 text-sm font-semibold text-[#a5f3fc]"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="forgeonix-btn-ghost rounded-sm border border-white/20 px-3 py-1.5 text-sm font-semibold text-[#e0e0e0]"
            >
              Sign Up
            </Link>
            <Link
              href="/signup"
              className="rounded-sm border border-[#67e8f9]/35 bg-[#67e8f9]/10 px-3 py-1.5 text-sm font-semibold text-[#a5f3fc]"
            >
              Join the Challenge
            </Link>
          </div>
        </section>
      ) : null}

      <section className={`${panel} p-4`}>
        <div className="flex gap-2">
          <button
            className={`rounded-sm border px-3 py-1.5 text-sm ${
              tab === "individual" ? tabActive : tabIdle
            }`}
            onClick={() => setTab("individual")}
          >
            Individual
          </button>
          <button
            className={`rounded-sm border px-3 py-1.5 text-sm ${
              tab === "teams" ? tabActive : tabIdle
            }`}
            onClick={() => setTab("teams")}
          >
            Teams
          </button>
          <button
            className={`rounded-sm border px-3 py-1.5 text-sm ${
              tab === "gyms" ? tabActive : tabIdle
            }`}
            onClick={() => setTab("gyms")}
          >
            Gyms
          </button>
        </div>
      </section>

      {tab === "individual" ? (
        <section className={`${panel} p-4`}>
          <h2 className="text-lg font-semibold text-[#e8e8e8]">Individual Leaderboard</h2>
          <div className="mt-3 space-y-2 md:hidden">
            {globalLeaderboard.map((entry, index) => (
              <article key={entry.userId} className={rowCard}>
                <p className="font-semibold">
                  #{index + 1} {entry.displayName}
                </p>
                <p className="text-sm text-[#c0c0c0]">Volume: {entry.totalVolume.toLocaleString()}</p>
                <p className="text-sm text-[#c0c0c0]">Best lift: {entry.bestLift.toLocaleString()}</p>
                <p className="text-sm text-[#a0a0a0]">Gym: {entry.gymName}</p>
                <p className="text-sm text-[#a0a0a0]">Team: {entry.teamName}</p>
              </article>
            ))}
          </div>
          <div className="mt-3 hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-[#a0a0a0]">
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
                  <tr key={entry.userId} className="border-b border-white/[0.06] text-[#e0e0e0]">
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
        <section className={`${panel} p-4`}>
          <h2 className="text-lg font-semibold text-[#e8e8e8]">Team Leaderboard</h2>
          <div className="mt-3 space-y-2">
            {teamLeaderboard.map((team, index) => (
              <article key={team.teamId} className={rowCard}>
                <p className="font-semibold">
                  #{index + 1} {team.teamName}
                </p>
                <p className="text-sm text-[#c0c0c0]">Volume: {team.totalVolume.toLocaleString()}</p>
                <p className="text-sm text-[#c0c0c0]">Best lift: {team.bestLift.toLocaleString()}</p>
              </article>
            ))}
            {teamLeaderboard.length === 0 ? (
              <p className="text-sm text-[#a0a0a0]">No leaderboard data yet.</p>
            ) : null}
          </div>
        </section>
      ) : (
        <section className={`${panel} p-4`}>
          <h2 className="text-lg font-semibold text-[#e8e8e8]">Gym Leaderboard</h2>
          <div className="mt-3 space-y-2">
            {gymLeaderboard.map((gym, index) => (
              <article key={gym.gymId} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <p className="font-semibold">
                  #{index + 1} {gym.gymName}
                </p>
                <p className="text-sm text-[#c0c0c0]">Volume: {gym.totalVolume.toLocaleString()}</p>
                <p className="text-sm text-[#c0c0c0]">Best lift: {gym.bestLift.toLocaleString()}</p>
              </article>
            ))}
            {gymLeaderboard.length === 0 ? (
              <p className="text-sm text-[#a0a0a0]">No gym leaderboard data yet.</p>
            ) : null}
          </div>
        </section>
      )}
    </AppShell>
  );
}
