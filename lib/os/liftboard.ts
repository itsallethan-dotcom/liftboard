import { osDb } from "@/lib/os/db";

export type LiftboardSummary = {
  totalUsers: number;
  totalWorkouts: number;
  totalVolume: number;
  workoutsThisWeek: number;
  activeUsersThisWeek: number;
  topLifter: string | null;
  topExercise: string | null;
  latestWorkoutAt: string | null;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  username: string | null;
};

type WorkoutRow = {
  user_id: string;
  exercise_name: string;
  weight: number | string;
  reps: number;
  sets: number;
  created_at: string;
};

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function profileLabel(profile: ProfileRow): string {
  const name = profile.display_name?.trim();
  if (name && !name.includes("@")) return name;
  if (profile.username?.trim()) return profile.username.trim();
  return "Unknown User";
}

export function formatLiftboardVolume(volume: number): string {
  if (volume <= 0) return "0";
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(1)}M`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(1)}k`;
  return volume.toLocaleString();
}

export function formatLiftboardDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function fetchLiftboardSummary(): Promise<LiftboardSummary> {
  const db = osDb();

  const [profilesCountRes, workoutsCountRes, profilesRes, workoutsRes, latestRes] =
    await Promise.all([
      db.from("profiles").select("*", { count: "exact", head: true }),
      db.from("workout_entries").select("*", { count: "exact", head: true }),
      db.from("profiles").select("id, display_name, username"),
      db.from("workout_entries").select("user_id, exercise_name, weight, reps, sets, created_at"),
      db
        .from("workout_entries")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  for (const result of [profilesCountRes, workoutsCountRes, profilesRes, workoutsRes, latestRes]) {
    if (result.error) throw new Error(result.error.message);
  }

  const profiles = (profilesRes.data ?? []) as ProfileRow[];
  const workouts = (workoutsRes.data ?? []) as WorkoutRow[];
  const profileById = new Map(profiles.map((p) => [p.id, p]));

  const weekStart = startOfWeek(new Date());
  let totalVolume = 0;
  let workoutsThisWeek = 0;
  const activeUsersThisWeek = new Set<string>();
  const volumeByUser = new Map<string, number>();
  const exerciseCounts = new Map<string, number>();

  for (const entry of workouts) {
    const weight = Number(entry.weight);
    const volume = weight * entry.reps * entry.sets;
    totalVolume += volume;

    volumeByUser.set(entry.user_id, (volumeByUser.get(entry.user_id) ?? 0) + volume);

    const exercise = entry.exercise_name?.trim() || "Unknown";
    exerciseCounts.set(exercise, (exerciseCounts.get(exercise) ?? 0) + 1);

    const created = new Date(entry.created_at);
    if (created >= weekStart) {
      workoutsThisWeek++;
      activeUsersThisWeek.add(entry.user_id);
    }
  }

  let topLifter: string | null = null;
  let topVolume = 0;
  for (const [userId, volume] of volumeByUser) {
    if (volume > topVolume) {
      topVolume = volume;
      const profile = profileById.get(userId);
      topLifter = profile ? profileLabel(profile) : "Unknown User";
    }
  }

  let topExercise: string | null = null;
  let topExerciseCount = 0;
  for (const [exercise, count] of exerciseCounts) {
    if (count > topExerciseCount) {
      topExerciseCount = count;
      topExercise = exercise;
    }
  }

  return {
    totalUsers: profilesCountRes.count ?? profiles.length,
    totalWorkouts: workoutsCountRes.count ?? workouts.length,
    totalVolume,
    workoutsThisWeek,
    activeUsersThisWeek: activeUsersThisWeek.size,
    topLifter,
    topExercise,
    latestWorkoutAt: (latestRes.data as { created_at: string } | null)?.created_at ?? null,
  };
}
