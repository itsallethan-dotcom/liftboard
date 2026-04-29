import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Avatar } from "@/components/avatar";

type ProfileRow = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

type WorkoutRow = {
  user_id: string;
  weight: number | string;
  reps: number;
  sets: number;
};

type TeamRow = {
  id: string;
  name: string;
};

type TeamMemberRow = {
  team_id: string;
  user_id: string;
};

type IndividualLeaderboardRow = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalVolume: number;
  bestLift: number;
};

type TeamLeaderboardRow = {
  teamId: string;
  teamName: string;
  totalVolume: number;
  bestLift: number;
};

function isEmailLike(value: string | null | undefined) {
  return Boolean(value && value.includes("@"));
}

function publicDisplayName(displayName: string | null, username: string | null) {
  const cleanDisplayName = displayName?.trim() ?? null;
  if (cleanDisplayName && !isEmailLike(cleanDisplayName)) return cleanDisplayName;
  if (username?.trim()) return username.trim();
  return "Unknown User";
}

export default async function Home() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const [profilesResponse, workoutsResponse, teamsResponse, membersResponse] = await Promise.all([
    supabase.from("profiles").select("id, display_name, username, avatar_url"),
    supabase.from("workout_entries").select("user_id, weight, reps, sets"),
    supabase.from("teams").select("id, name"),
    supabase.from("team_members").select("team_id, user_id"),
  ]);

  const profiles = (profilesResponse.data ?? []) as ProfileRow[];
  const workouts = (workoutsResponse.data ?? []) as WorkoutRow[];
  const teams = (teamsResponse.data ?? []) as TeamRow[];
  const teamMembers = (membersResponse.data ?? []) as TeamMemberRow[];

  const usersById = new Map<string, IndividualLeaderboardRow>();
  for (const profile of profiles) {
    usersById.set(profile.id, {
      userId: profile.id,
      displayName: publicDisplayName(profile.display_name, profile.username),
      avatarUrl: profile.avatar_url,
      totalVolume: 0,
      bestLift: 0,
    });
  }

  for (const workout of workouts) {
    const existing = usersById.get(workout.user_id) ?? {
      userId: workout.user_id,
      displayName: "Unknown User",
      avatarUrl: null,
      totalVolume: 0,
      bestLift: 0,
    };
    const workoutWeight = Number(workout.weight);
    existing.totalVolume += workoutWeight * workout.reps * workout.sets;
    existing.bestLift = Math.max(existing.bestLift, workoutWeight);
    usersById.set(workout.user_id, existing);
  }

  const globalLeaderboard = Array.from(usersById.values()).sort((a, b) => b.totalVolume - a.totalVolume);

  const usersByTeam = new Map<string, Set<string>>();
  for (const membership of teamMembers) {
    const existing = usersByTeam.get(membership.team_id) ?? new Set<string>();
    existing.add(membership.user_id);
    usersByTeam.set(membership.team_id, existing);
  }

  const workoutsByUser = new Map<string, WorkoutRow[]>();
  for (const workout of workouts) {
    const existing = workoutsByUser.get(workout.user_id) ?? [];
    existing.push(workout);
    workoutsByUser.set(workout.user_id, existing);
  }

  const teamLeaderboard: TeamLeaderboardRow[] = teams
    .filter((team) => (usersByTeam.get(team.id)?.size ?? 0) > 0)
    .map((team) => {
      let totalVolume = 0;
      let bestLift = 0;

      for (const userId of Array.from(usersByTeam.get(team.id) ?? [])) {
        const userWorkouts = workoutsByUser.get(userId) ?? [];
        for (const workout of userWorkouts) {
          const workoutWeight = Number(workout.weight);
          totalVolume += workoutWeight * workout.reps * workout.sets;
          bestLift = Math.max(bestLift, workoutWeight);
        }
      }

      return {
        teamId: team.id,
        teamName: team.name,
        totalVolume,
        bestLift,
      };
    })
    .sort((a, b) => b.totalVolume - a.totalVolume);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">LiftBoard</h1>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            Track your latest lifts and see how you stack up on the leaderboard.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              Log in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              Dashboard
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          <h2 className="text-xl font-semibold text-slate-100">Workout Submission</h2>
          <p className="mt-3 text-sm text-slate-300">
            Workout logging is available from your dashboard after login.
          </p>
          <div className="mt-4">
            <Link
              href="/login"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Log in to Submit Workouts
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          <h2 className="text-xl font-semibold text-slate-100">Global Individual Leaderboard</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-200">
                  <th className="px-3 py-2 font-semibold">Rank</th>
                  <th className="px-3 py-2 font-semibold">Athlete</th>
                  <th className="px-3 py-2 font-semibold">Total Volume</th>
                  <th className="px-3 py-2 font-semibold">Best Lift</th>
                </tr>
              </thead>
              <tbody>
                {globalLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-slate-300">
                      No workout entries yet.
                    </td>
                  </tr>
                ) : (
                  globalLeaderboard.map((entry, index) => (
                    <tr key={entry.userId} className="border-b border-slate-800">
                      <td className="px-3 py-2 font-semibold">{index + 1}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar name={entry.displayName} avatarUrl={entry.avatarUrl} size="sm" />
                          <span>{entry.displayName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">{entry.totalVolume.toLocaleString()}</td>
                      <td className="px-3 py-2">{entry.bestLift.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          <h2 className="text-xl font-semibold text-slate-100">Team Leaderboard</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-200">
                  <th className="px-3 py-2 font-semibold">Rank</th>
                  <th className="px-3 py-2 font-semibold">Team</th>
                  <th className="px-3 py-2 font-semibold">Total Volume</th>
                  <th className="px-3 py-2 font-semibold">Best Lift</th>
                </tr>
              </thead>
              <tbody>
                {teamLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-slate-300">
                      No teams with members yet.
                    </td>
                  </tr>
                ) : (
                  teamLeaderboard.map((entry, index) => (
                    <tr key={entry.teamId} className="border-b border-slate-800">
                      <td className="px-3 py-2 font-semibold">{index + 1}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar name={entry.teamName} avatarUrl={null} size="sm" />
                          <span>{entry.teamName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">{entry.totalVolume.toLocaleString()}</td>
                      <td className="px-3 py-2">{entry.bestLift.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
