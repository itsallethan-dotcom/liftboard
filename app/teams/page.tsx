"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAppData } from "@/hooks/use-app-data";

export default function TeamsPage() {
  const {
    loading,
    myTeams,
    availableTeams,
    allGyms,
    profile,
    createTeam,
    joinTeam,
    createGym,
    joinGym,
    error,
    message,
    user,
    profileDisplayName,
  } = useAppData();
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [gymName, setGymName] = useState("");
  const [joinGymId, setJoinGymId] = useState("");

  if (loading) return <main className="min-h-screen bg-gray-950" />;

  return (
    <AppShell
      title="Teams & Gyms"
      user={user}
      profileDisplayName={profileDisplayName}
      avatarUrl={profile?.avatar_url ?? null}
    >
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-lg font-semibold">Current Membership</h2>
        <p className="mt-2 text-sm text-slate-300">Teams joined: {myTeams.length}</p>
        <p className="text-sm text-slate-300">Gym: {profile?.gym_id ? "Joined" : "Not joined"}</p>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-lg font-semibold">Create Team</h2>
        <form
          className="mt-3 grid gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await createTeam({ name: teamName.trim(), description: teamDescription.trim() });
            setTeamName("");
            setTeamDescription("");
          }}
        >
          <input className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Team name" value={teamName} onChange={(event) => setTeamName(event.target.value)} />
          <textarea className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Description" value={teamDescription} onChange={(event) => setTeamDescription(event.target.value)} />
          <button className="w-fit rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">Create Team</button>
        </form>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-lg font-semibold">Join Team</h2>
        <div className="mt-3 space-y-2">
          {availableTeams.map((team) => (
            <article key={team.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
              <div>
                <p className="font-semibold">{team.name}</p>
                <p className="text-xs text-slate-400">{team.description ?? "No description"}</p>
              </div>
              <button className="rounded-md border border-cyan-400/50 px-3 py-1 text-xs text-cyan-300" onClick={() => void joinTeam(team.id)}>
                Join Team
              </button>
            </article>
          ))}
          {availableTeams.length === 0 ? <p className="text-sm text-slate-300">No teams available to join right now.</p> : null}
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-lg font-semibold">Gyms</h2>
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await createGym(gymName.trim());
            setGymName("");
          }}
        >
          <input className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="New gym name" value={gymName} onChange={(event) => setGymName(event.target.value)} />
          <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">Create Gym</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          <select className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={joinGymId} onChange={(event) => setJoinGymId(event.target.value)}>
            <option value="">Select gym...</option>
            {allGyms.map((gym) => (
              <option key={gym.id} value={gym.id}>
                {gym.name}
              </option>
            ))}
          </select>
          <button className="rounded-lg border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300" onClick={() => void joinGym(joinGymId)} type="button">
            Join Gym
          </button>
        </div>
      </section>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
    </AppShell>
  );
}
