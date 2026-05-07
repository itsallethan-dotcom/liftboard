"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ensureProfileRow, supabase } from "@/lib/supabase/client";

export type DashboardUser = { id: string; email?: string };
export type ProfileRow = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  gym_id: string | null;
};
export type WorkoutEntry = {
  id: string;
  exercise_name: string;
  weight: number | string;
  reps: number;
  sets: number;
  created_at: string;
};
export type LeaderboardRow = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalVolume: number;
  bestLift: number;
  gymName: string;
  teamName: string;
};
export type TeamLeaderboardRow = {
  teamId: string;
  teamName: string;
  totalVolume: number;
  bestLift: number;
};
export type GymLeaderboardRow = {
  gymId: string;
  gymName: string;
  totalVolume: number;
  bestLift: number;
};
export type MyTeamRow = { id: string; name: string; description: string | null; role: string };
export type TeamRow = { id: string; name: string; description: string | null };
export type GymRow = { id: string; name: string; created_by: string; created_at: string };

type UseAppDataOptions = {
  requireAuth?: boolean;
  includePrivateData?: boolean;
};

type TeamMemberJoinedRow = {
  user_id: string;
  teams: { id: string; name: string } | { id: string; name: string }[] | null;
};

export function useAppData(options?: UseAppDataOptions) {
  const requireAuth = options?.requireAuth ?? true;
  const includePrivateData = options?.includePrivateData ?? requireAuth;
  const router = useRouter();

  const [user, setUser] = useState<DashboardUser | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardRow[]>([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState<TeamLeaderboardRow[]>([]);
  const [gymLeaderboard, setGymLeaderboard] = useState<GymLeaderboardRow[]>([]);
  const [myTeams, setMyTeams] = useState<MyTeamRow[]>([]);
  const [availableTeams, setAvailableTeams] = useState<TeamRow[]>([]);
  const [allGyms, setAllGyms] = useState<GymRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const profileDisplayName = useMemo(() => {
    const name = profile?.display_name?.trim();
    if (name && !name.includes("@")) return name;
    if (profile?.username?.trim()) return profile.username.trim();
    return "Unknown User";
  }, [profile]);

  const stats = useMemo(
    () =>
      workouts.reduce(
        (acc, entry) => {
          const w = Number(entry.weight);
          return {
            totalVolume: acc.totalVolume + w * entry.reps * entry.sets,
            bestLift: Math.max(acc.bestLift, w),
            totalEntries: acc.totalEntries + 1,
          };
        },
        { totalVolume: 0, bestLift: 0, totalEntries: 0 },
      ),
    [workouts],
  );

  const fetchProfile = useCallback(async (userId: string, email?: string) => {
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, gym_id")
      .eq("id", userId)
      .maybeSingle();
    if (profileError) throw profileError;
    if (!data) {
      await ensureProfileRow(userId, email ?? null);
      return null;
    }
    setProfile(data as ProfileRow);
    return data as ProfileRow;
  }, []);

  const fetchWorkouts = useCallback(async (userId: string) => {
    const { data, error: workoutsError } = await supabase
      .from("workout_entries")
      .select("id, exercise_name, weight, reps, sets, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (workoutsError) throw workoutsError;
    setWorkouts(data ?? []);
  }, []);

  const fetchGyms = useCallback(async () => {
    const { data, error: gymsError } = await supabase
      .from("gyms")
      .select("id, name, created_by, created_at")
      .order("name");

    if (gymsError) {
      // TODO: If gyms table is not deployed yet, keep UI stable with empty gym state.
      if ((gymsError as { code?: string }).code === "42P01") {
        setAllGyms([]);
        return;
      }
      throw gymsError;
    }
    setAllGyms((data ?? []) as GymRow[]);
  }, []);

  const fetchLeaderboards = useCallback(async () => {
    const [profilesRes, workoutsRes, teamsRes, teamMembersRes, gymsRes] = await Promise.all([
      supabase.from("profiles").select("id, display_name, username, avatar_url, gym_id"),
      supabase.from("workout_entries").select("user_id, weight, reps, sets"),
      supabase.from("teams").select("id, name"),
      supabase.from("team_members").select("user_id, team_id, teams(id, name)"),
      supabase.from("gyms").select("id, name"),
    ]);

    if (profilesRes.error) throw profilesRes.error;
    if (workoutsRes.error) throw workoutsRes.error;
    if (teamsRes.error) throw teamsRes.error;
    if (teamMembersRes.error) throw teamMembersRes.error;
    if (gymsRes.error && (gymsRes.error as { code?: string }).code !== "42P01") throw gymsRes.error;

    const profiles = (profilesRes.data ?? []) as ProfileRow[];
    const workouts = (workoutsRes.data ?? []) as {
      user_id: string;
      weight: number | string;
      reps: number;
      sets: number;
    }[];
    const teams = (teamsRes.data ?? []) as { id: string; name: string }[];
    const teamMembers = (teamMembersRes.data ?? []) as TeamMemberJoinedRow[];
    const gyms = (gymsRes.data ?? []) as { id: string; name: string }[];

    const gymNameById = new Map<string, string>(gyms.map((g) => [g.id, g.name]));
    const teamNameByUser = new Map<string, string>();
    for (const row of teamMembers) {
      const team = Array.isArray(row.teams) ? row.teams[0] : row.teams;
      if (team && !teamNameByUser.has(row.user_id)) {
        teamNameByUser.set(row.user_id, team.name);
      }
    }

    const rowsByUser = new Map<string, LeaderboardRow>();
    for (const p of profiles) {
      rowsByUser.set(p.id, {
        userId: p.id,
        displayName: p.display_name?.trim() || p.username?.trim() || "Unknown User",
        avatarUrl: p.avatar_url,
        totalVolume: 0,
        bestLift: 0,
        gymName: p.gym_id ? gymNameById.get(p.gym_id) ?? "No gym" : "No gym",
        teamName: teamNameByUser.get(p.id) ?? "No team",
      });
    }

    for (const entry of workouts) {
      const row = rowsByUser.get(entry.user_id) ?? {
        userId: entry.user_id,
        displayName: "Unknown User",
        avatarUrl: null,
        totalVolume: 0,
        bestLift: 0,
        gymName: "No gym",
        teamName: teamNameByUser.get(entry.user_id) ?? "No team",
      };
      const weight = Number(entry.weight);
      row.totalVolume += weight * entry.reps * entry.sets;
      row.bestLift = Math.max(row.bestLift, weight);
      rowsByUser.set(entry.user_id, row);
    }

    setGlobalLeaderboard(Array.from(rowsByUser.values()).sort((a, b) => b.totalVolume - a.totalVolume));

    const usersByTeam = new Map<string, Set<string>>();
    for (const member of teamMembers) {
      const teamId = Array.isArray(member.teams) ? member.teams[0]?.id : member.teams?.id;
      if (!teamId) continue;
      const existing = usersByTeam.get(teamId) ?? new Set<string>();
      existing.add(member.user_id);
      usersByTeam.set(teamId, existing);
    }

    const teamRows = teams
      .map((team) => {
        let totalVolume = 0;
        let bestLift = 0;
        for (const workout of workouts) {
          if (!(usersByTeam.get(team.id) ?? new Set()).has(workout.user_id)) continue;
          const w = Number(workout.weight);
          totalVolume += w * workout.reps * workout.sets;
          bestLift = Math.max(bestLift, w);
        }
        return { teamId: team.id, teamName: team.name, totalVolume, bestLift };
      })
      .filter((row) => row.totalVolume > 0 || row.bestLift > 0)
      .sort((a, b) => b.totalVolume - a.totalVolume);
    setTeamLeaderboard(teamRows);

    const gymRows = gyms
      .map((gym) => {
        let totalVolume = 0;
        let bestLift = 0;
        for (const userRow of rowsByUser.values()) {
          if (userRow.gymName !== gym.name) continue;
          totalVolume += userRow.totalVolume;
          bestLift = Math.max(bestLift, userRow.bestLift);
        }
        return { gymId: gym.id, gymName: gym.name, totalVolume, bestLift };
      })
      .filter((row) => row.totalVolume > 0 || row.bestLift > 0)
      .sort((a, b) => b.totalVolume - a.totalVolume);
    setGymLeaderboard(gymRows);
  }, []);

  const fetchTeams = useCallback(async (userId: string) => {
    const [mineResponse, allResponse, membershipsResponse] = await Promise.all([
      supabase.from("team_members").select("role, teams(id, name, description)").eq("user_id", userId),
      supabase.from("teams").select("id, name, description").order("name"),
      supabase.from("team_members").select("team_id").eq("user_id", userId),
    ]);
    if (mineResponse.error) throw mineResponse.error;
    if (allResponse.error) throw allResponse.error;
    if (membershipsResponse.error) throw membershipsResponse.error;

    const mine = ((mineResponse.data ?? []) as { role: string; teams: TeamRow | TeamRow[] | null }[])
      .map((row) => {
        const team = Array.isArray(row.teams) ? row.teams[0] : row.teams;
        if (!team) return null;
        return { id: team.id, name: team.name, description: team.description, role: row.role };
      })
      .filter((row): row is MyTeamRow => row !== null);
    const membershipIds = new Set((membershipsResponse.data ?? []).map((m) => m.team_id as string));
    setMyTeams(mine);
    setAvailableTeams(((allResponse.data ?? []) as TeamRow[]).filter((t) => !membershipIds.has(t.id)));
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchLeaderboards(), fetchGyms()]);
    if (!user || !includePrivateData) return;
    await Promise.all([fetchProfile(user.id, user.email), fetchWorkouts(user.id), fetchTeams(user.id)]);
  }, [fetchGyms, fetchLeaderboards, fetchProfile, fetchTeams, fetchWorkouts, includePrivateData, user]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user;
        if (!sessionUser) {
          if (requireAuth) {
            router.replace("/login");
            return;
          }
          await Promise.all([fetchLeaderboards(), fetchGyms()]);
          return;
        }

        setUser({ id: sessionUser.id, email: sessionUser.email });
        const loadedProfile = await fetchProfile(sessionUser.id, sessionUser.email);

        if (requireAuth && !loadedProfile?.username) {
          router.replace("/complete-profile");
          return;
        }

        await Promise.all([fetchLeaderboards(), fetchGyms()]);
        if (includePrivateData) {
          await Promise.all([fetchWorkouts(sessionUser.id), fetchTeams(sessionUser.id)]);
        }
      } catch (loadError) {
        console.error(loadError);
        setError("Could not load app data right now.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [
    fetchGyms,
    fetchLeaderboards,
    fetchProfile,
    fetchTeams,
    fetchWorkouts,
    includePrivateData,
    requireAuth,
    router,
  ]);

  const guardAuth = () => {
    if (user) return true;
    setError("Please log in to continue.");
    router.push("/login");
    return false;
  };

  const addWorkout = useCallback(
    async (payload: { exercise_name: string; weight: number; reps: number; sets: number }) => {
      if (!guardAuth()) return;
      setError(null);
      setMessage(null);
      const { error: insertError } = await supabase.from("workout_entries").insert({
        user_id: user!.id,
        ...payload,
      });
      if (insertError) {
        setError("Could not save workout. Please try again.");
        return;
      }
      setMessage("Workout logged.");
      await refreshAll();
    },
    [refreshAll, router, user],
  );

  const updateWorkout = useCallback(
    async (workoutId: string, payload: { exercise_name: string; weight: number; reps: number; sets: number }) => {
      if (!guardAuth()) return;
      setError(null);
      setMessage(null);
      const { error: updateError } = await supabase
        .from("workout_entries")
        .update(payload)
        .eq("id", workoutId)
        .eq("user_id", user!.id);
      if (updateError) {
        setError("Could not update workout. Please try again.");
        return;
      }
      setMessage("Workout updated.");
      await refreshAll();
    },
    [refreshAll, router, user],
  );

  const deleteWorkout = useCallback(
    async (workoutId: string) => {
      if (!guardAuth()) return;
      setError(null);
      setMessage(null);
      const { error: deleteError } = await supabase
        .from("workout_entries")
        .delete()
        .eq("id", workoutId)
        .eq("user_id", user!.id);
      if (deleteError) {
        setError("Could not delete workout. Please try again.");
        return;
      }
      setMessage("Workout deleted.");
      await refreshAll();
    },
    [refreshAll, router, user],
  );

  const saveProfile = useCallback(
    async (payload: { display_name: string; username: string; avatar_url: string | null }) => {
      if (!guardAuth()) return;
      setError(null);
      setMessage(null);
      const { error: profileError } = await supabase.from("profiles").update(payload).eq("id", user!.id);
      if (profileError) {
        setError(profileError.code === "23505" ? "That username is already taken." : "Could not save profile.");
        return;
      }
      setMessage("Profile updated.");
      await refreshAll();
    },
    [refreshAll, router, user],
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!guardAuth()) return;
      setError(null);
      setMessage(null);

      const objectPath = `${user!.id}/avatar.png`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(objectPath, file, {
        upsert: true,
      });
      if (uploadError) {
        setError("Upload failed. Please try again.");
        return;
      }

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(objectPath);
      const avatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user!.id);
      if (profileError) {
        setError("Avatar uploaded, but profile update failed.");
        return;
      }

      setMessage("Profile picture updated.");
      await refreshAll();
    },
    [refreshAll, router, user],
  );

  const createTeam = useCallback(
    async (payload: { name: string; description: string }) => {
      if (!guardAuth()) return;
      setError(null);
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({ name: payload.name, description: payload.description || null, created_by: user!.id })
        .select("id")
        .single();
      if (teamError || !teamData) {
        setError("Could not create team.");
        return;
      }
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({ team_id: teamData.id, user_id: user!.id, role: "owner" });
      if (memberError) {
        setError("Could not join created team.");
        return;
      }
      setMessage("Team created.");
      await refreshAll();
    },
    [refreshAll, router, user],
  );

  const joinTeam = useCallback(
    async (teamId: string) => {
      if (!guardAuth()) return;
      setError(null);
      const { error: joinError } = await supabase
        .from("team_members")
        .insert({ team_id: teamId, user_id: user!.id, role: "member" });
      if (joinError && joinError.code !== "23505") {
        setError("Could not join team.");
        return;
      }
      setMessage("Team joined.");
      await refreshAll();
    },
    [refreshAll, router, user],
  );

  const createGym = useCallback(
    async (name: string) => {
      if (!guardAuth()) return;
      setError(null);
      const { data, error: gymError } = await supabase
        .from("gyms")
        .insert({ name, created_by: user!.id })
        .select("id")
        .single();
      if (gymError || !data) {
        setError("Could not create gym.");
        return;
      }
      const { error: profileError } = await supabase.from("profiles").update({ gym_id: data.id }).eq("id", user!.id);
      if (profileError) {
        setError("Could not assign gym.");
        return;
      }
      setMessage("Gym created and joined.");
      await refreshAll();
    },
    [refreshAll, router, user],
  );

  const joinGym = useCallback(
    async (gymId: string) => {
      if (!guardAuth()) return;
      setError(null);
      const { error: joinError } = await supabase.from("profiles").update({ gym_id: gymId }).eq("id", user!.id);
      if (joinError) {
        setError("Could not join gym.");
        return;
      }
      setMessage("Gym joined.");
      await refreshAll();
    },
    [refreshAll, router, user],
  );

  return {
    loading,
    user,
    profile,
    workouts,
    stats,
    profileDisplayName,
    globalLeaderboard,
    teamLeaderboard,
    gymLeaderboard,
    myTeams,
    availableTeams,
    allGyms,
    message,
    error,
    setError,
    setMessage,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    saveProfile,
    uploadAvatar,
    createTeam,
    joinTeam,
    createGym,
    joinGym,
    refreshAll,
  };
}
