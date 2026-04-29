"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { ensureProfileRow, supabase } from "@/lib/supabase/client";
import { Avatar } from "@/components/avatar";

type DashboardUser = {
  id: string;
  email?: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  gym_id: string | null;
};

type GymRow = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
};

type GymLeaderboardRow = {
  gymId: string;
  gymName: string;
  totalVolume: number;
  bestLift: number;
};

type WorkoutEntry = {
  id: string;
  exercise_name: string;
  weight: number | string;
  reps: number;
  sets: number;
  created_at: string;
};

type JoinedProfile = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

type GlobalWorkoutRow = {
  user_id: string;
  weight: number | string;
  reps: number;
  sets: number;
  profiles: JoinedProfile | JoinedProfile[] | null;
};

type LeaderboardRow = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalVolume: number;
  bestLift: number;
};

type TeamMembershipRow = {
  role: string;
  teams: {
    id: string;
    name: string;
    description: string | null;
  } | {
    id: string;
    name: string;
    description: string | null;
  }[] | null;
};

type MyTeamRow = {
  id: string;
  name: string;
  description: string | null;
  role: string;
};

type TeamRow = {
  id: string;
  name: string;
  description: string | null;
};

type TeamMemberRow = {
  team_id: string;
  user_id: string;
};

type TeamWorkoutRow = {
  user_id: string;
  weight: number | string;
  reps: number;
  sets: number;
};

type TeamLeaderboardRow = {
  teamId: string;
  teamName: string;
  totalVolume: number;
  bestLift: number;
};

type RecentActivityRow = {
  id: string;
  exercise_name: string;
  weight: number | string;
  reps: number;
  sets: number;
  created_at: string;
  profiles: Omit<JoinedProfile, "id"> | Omit<JoinedProfile, "id">[] | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [exerciseName, setExerciseName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [myTeams, setMyTeams] = useState<MyTeamRow[]>([]);
  const [availableTeams, setAvailableTeams] = useState<TeamRow[]>([]);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [joiningTeamId, setJoiningTeamId] = useState<string | null>(null);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardRow[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [teamLeaderboard, setTeamLeaderboard] = useState<TeamLeaderboardRow[]>([]);
  const [isLoadingTeamLeaderboard, setIsLoadingTeamLeaderboard] = useState(false);
  const [allGyms, setAllGyms] = useState<GymRow[]>([]);
  const [gymNameInput, setGymNameInput] = useState("");
  const [joinGymId, setJoinGymId] = useState("");
  const [isCreatingGym, setIsCreatingGym] = useState(false);
  const [isJoiningGym, setIsJoiningGym] = useState(false);
  const [isLoadingGyms, setIsLoadingGyms] = useState(false);
  const [gymLeaderboard, setGymLeaderboard] = useState<GymLeaderboardRow[]>([]);
  const [isLoadingGymLeaderboard, setIsLoadingGymLeaderboard] = useState(false);
  const [recentActivity, setRecentActivity] = useState<RecentActivityRow[]>([]);
  const [isLoadingRecentActivity, setIsLoadingRecentActivity] = useState(false);
  const [usernameGateError, setUsernameGateError] = useState<string | null>(null);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const [avatarUploadSuccess, setAvatarUploadSuccess] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [selectedAvatarPreviewUrl, setSelectedAvatarPreviewUrl] = useState<string | null>(null);
  const [workoutFormTouched, setWorkoutFormTouched] = useState(false);

  const stats = workouts.reduce(
    (acc, entry) => {
      const entryWeight = Number(entry.weight);
      const entryVolume = entryWeight * entry.reps * entry.sets;
      const hasBetterLift = entryWeight > acc.bestLift;

      return {
        totalVolume: acc.totalVolume + entryVolume,
        bestLift: hasBetterLift ? entryWeight : acc.bestLift,
        bestLiftExerciseName: hasBetterLift ? entry.exercise_name : acc.bestLiftExerciseName,
        totalEntries: acc.totalEntries + 1,
      };
    },
    {
      totalVolume: 0,
      bestLift: 0,
      bestLiftExerciseName: "-",
      totalEntries: 0,
    },
  );

  const publicDisplayName = (displayName: string | null, username: string | null) => {
    const cleanDisplayName = displayName?.trim() ?? null;
    if (cleanDisplayName && !cleanDisplayName.includes("@")) return cleanDisplayName;
    if (username?.trim()) return username.trim();
    return "Unknown User";
  };

  const profileDisplayName = publicDisplayName(profile?.display_name ?? null, profile?.username ?? null);
  const hasUsername = Boolean(profile?.username);
  const parsedWeightValue = Number(weight);
  const parsedRepsValue = Number(reps);
  const parsedSetsValue = Number(sets);

  const exerciseError =
    workoutFormTouched && exerciseName.trim().length === 0 ? "Exercise name is required." : null;
  const weightError =
    workoutFormTouched && (weight.length === 0 || Number.isNaN(parsedWeightValue))
      ? "Weight is required."
      : workoutFormTouched && parsedWeightValue <= 0
        ? "Weight must be greater than 0."
        : workoutFormTouched && parsedWeightValue > 2000
          ? "Weight must be 2000 or less."
          : null;
  const repsError =
    workoutFormTouched && (reps.length === 0 || Number.isNaN(parsedRepsValue))
      ? "Reps are required."
      : workoutFormTouched && parsedRepsValue <= 0
        ? "Reps must be greater than 0."
        : workoutFormTouched && parsedRepsValue > 100
          ? "Reps must be 100 or less."
          : null;
  const setsError =
    workoutFormTouched && (sets.length === 0 || Number.isNaN(parsedSetsValue))
      ? "Sets are required."
      : workoutFormTouched && parsedSetsValue <= 0
        ? "Sets must be greater than 0."
        : workoutFormTouched && parsedSetsValue > 20
          ? "Sets must be 20 or less."
          : null;

  const isWorkoutFormValid =
    exerciseName.trim().length > 0 &&
    !Number.isNaN(parsedWeightValue) &&
    !Number.isNaN(parsedRepsValue) &&
    !Number.isNaN(parsedSetsValue) &&
    parsedWeightValue > 0 &&
    parsedWeightValue <= 2000 &&
    parsedRepsValue > 0 &&
    parsedRepsValue <= 100 &&
    parsedSetsValue > 0 &&
    parsedSetsValue <= 20;

  const getTopRankStyles = (rank: number) => {
    if (rank === 1) return "bg-amber-500/20 border-amber-400";
    if (rank === 2) return "bg-slate-300/20 border-slate-300";
    if (rank === 3) return "bg-orange-500/20 border-orange-400";
    return "bg-slate-900 border-slate-700";
  };

  const getRankBadgeStyles = (rank: number) => {
    if (rank === 1) return "bg-amber-400 text-amber-950";
    if (rank === 2) return "bg-slate-300 text-slate-900";
    if (rank === 3) return "bg-orange-400 text-orange-950";
    return "bg-slate-700 text-slate-100";
  };

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setAvatarUploadError(null);
    setAvatarUploadSuccess(null);

    if (!file) {
      setSelectedAvatarFile(null);
      setSelectedAvatarPreviewUrl(null);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setAvatarUploadError("Invalid file type. Please upload a PNG, JPG/JPEG, or WEBP image.");
      setSelectedAvatarFile(null);
      setSelectedAvatarPreviewUrl(null);
      return;
    }

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setAvatarUploadError("File is too large. Please upload an image smaller than 2MB.");
      setSelectedAvatarFile(null);
      setSelectedAvatarPreviewUrl(null);
      return;
    }

    setSelectedAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setSelectedAvatarPreviewUrl(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (selectedAvatarPreviewUrl) {
        URL.revokeObjectURL(selectedAvatarPreviewUrl);
      }
    };
  }, [selectedAvatarPreviewUrl]);

  const handleAvatarUploadSubmit = async () => {
    if (!user || !selectedAvatarFile) {
      setAvatarUploadError("Please choose an image file first.");
      return;
    }

    const objectPath = `${user.id}/avatar.png`;

    setErrorMessage(null);
    setAvatarUploadError(null);
    setAvatarUploadSuccess(null);
    setIsUploadingAvatar(true);

    const { error: uploadError } = await supabase.storage.from("avatars").upload(objectPath, selectedAvatarFile, {
      upsert: true,
    });

    if (uploadError) {
      console.error("Avatar upload failed:", uploadError);
      setAvatarUploadError("Upload failed. Please try again.");
      setIsUploadingAvatar(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(objectPath);
    const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (profileUpdateError) {
      console.error("Failed to save avatar URL to profile:", profileUpdateError);
      setAvatarUploadError("Avatar uploaded, but profile update failed. Please try again.");
      setIsUploadingAvatar(false);
      return;
    }

    setAvatarUrlInput(publicUrl);
    await Promise.all([fetchProfile(user.id), fetchGlobalLeaderboard()]);
    setSelectedAvatarFile(null);
    setSelectedAvatarPreviewUrl(null);
    setAvatarUploadSuccess("Profile picture updated.");
    setIsUploadingAvatar(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, gym_id")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch profile:", error);
      setErrorMessage("Could not load profile right now.");
      return null;
    }

    if (!data) {
      await ensureProfileRow(userId, user?.email ?? null);
      const fallback = {
        id: userId,
        display_name: null,
        username: null,
        avatar_url: null,
        gym_id: null,
      };
      setProfile(fallback);
      setUsernameGateError("Username is required before you can continue.");
      setDisplayNameInput("");
      setUsernameInput("");
      setAvatarUrlInput("");
      return fallback;
    }

    setProfile(data as ProfileRow);
    if (!data.username) {
      setUsernameGateError("Username is required before you can continue.");
    } else {
      setUsernameGateError(null);
    }
    setDisplayNameInput(data.display_name ?? "");
    setUsernameInput(data.username ?? "");
    setAvatarUrlInput(data.avatar_url ?? "");
    return data as ProfileRow;
  };

  const fetchUserWorkouts = async (userId: string) => {
    setIsLoadingWorkouts(true);

    const { data, error } = await supabase
      .from("workout_entries")
      .select("id, exercise_name, weight, reps, sets, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setIsLoadingWorkouts(false);

    if (error) {
      console.error("Failed to fetch workouts:", error);
      setErrorMessage("Could not load workouts right now.");
      return;
    }

    setWorkouts(data ?? []);
  };

  const fetchGlobalLeaderboard = async () => {
    setIsLoadingLeaderboard(true);

    const [profilesResponse, entriesResponse] = await Promise.all([
      supabase.from("profiles").select("id, display_name, username, avatar_url, gym_id"),
      supabase
        .from("workout_entries")
        .select("user_id, weight, reps, sets, profiles(id, display_name, username, avatar_url)"),
    ]);

    setIsLoadingLeaderboard(false);

    if (profilesResponse.error) {
      console.error("Failed to fetch profiles for leaderboard:", profilesResponse.error);
      setErrorMessage("Could not load global leaderboard right now.");
      return;
    }

    if (entriesResponse.error) {
      console.error("Failed to fetch leaderboard workouts:", entriesResponse.error);
      setErrorMessage("Could not load global leaderboard right now.");
      return;
    }

    const profiles = (profilesResponse.data ?? []) as ProfileRow[];
    const allEntries = (entriesResponse.data ?? []) as GlobalWorkoutRow[];

    const rowsByUser = new Map<string, LeaderboardRow>();
    for (const profile of profiles) {
      rowsByUser.set(profile.id, {
        userId: profile.id,
        displayName: publicDisplayName(profile.display_name, profile.username),
        avatarUrl: profile.avatar_url ?? null,
        totalVolume: 0,
        bestLift: 0,
      });
    }

    for (const entry of allEntries) {
      const entryWeight = Number(entry.weight);
      const profile = Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles;
      const currentRow = rowsByUser.get(entry.user_id) ?? {
        userId: entry.user_id,
        displayName: publicDisplayName(profile?.display_name ?? null, profile?.username ?? null),
        avatarUrl: profile?.avatar_url ?? null,
        totalVolume: 0,
        bestLift: 0,
      };

      currentRow.totalVolume += entryWeight * entry.reps * entry.sets;
      currentRow.bestLift = Math.max(currentRow.bestLift, entryWeight);
      rowsByUser.set(entry.user_id, currentRow);
    }

    const sortedRows = Array.from(rowsByUser.values()).sort((a, b) => b.totalVolume - a.totalVolume);
    setGlobalLeaderboard(sortedRows);
  };

  const fetchMyTeams = async (userId: string) => {
    setIsLoadingTeams(true);

    const { data, error } = await supabase
      .from("team_members")
      .select("role, teams(id, name, description)")
      .eq("user_id", userId);

    setIsLoadingTeams(false);

    if (error) {
      console.error("Failed to fetch teams:", error);
      setErrorMessage("Could not load your teams right now.");
      return;
    }

    const memberships = (data ?? []) as TeamMembershipRow[];
    const mappedTeams: MyTeamRow[] = memberships
      .map((membership) => {
        const team = Array.isArray(membership.teams) ? membership.teams[0] : membership.teams;
        if (!team) return null;
        return {
          id: team?.id,
          name: team?.name,
          description: team?.description ?? null,
          role: membership.role,
        };
      })
      .filter((team): team is MyTeamRow => team !== null);

    setMyTeams(mappedTeams);
  };

  const fetchAvailableTeams = async (userId: string) => {
    const [teamsResponse, membershipsResponse] = await Promise.all([
      supabase.from("teams").select("id, name, description").order("name", { ascending: true }),
      supabase.from("team_members").select("team_id").eq("user_id", userId),
    ]);

    if (teamsResponse.error) {
      console.error("Failed to fetch available teams:", teamsResponse.error);
      setErrorMessage("Could not load available teams right now.");
      return;
    }

    if (membershipsResponse.error) {
      console.error("Failed to fetch team memberships:", membershipsResponse.error);
      setErrorMessage("Could not load available teams right now.");
      return;
    }

    const allTeams = (teamsResponse.data ?? []) as TeamRow[];
    const membershipTeamIds = new Set(
      (membershipsResponse.data ?? []).map((membership) => membership.team_id as string),
    );

    setAvailableTeams(allTeams.filter((team) => !membershipTeamIds.has(team.id)));
  };

  const fetchTeamLeaderboard = async () => {
    setIsLoadingTeamLeaderboard(true);

    const [teamsResponse, teamMembersResponse, workoutsResponse, profilesResponse] = await Promise.all([
      supabase.from("teams").select("id, name"),
      supabase.from("team_members").select("team_id, user_id"),
      supabase.from("workout_entries").select("user_id, weight, reps, sets"),
      supabase.from("profiles").select("id, display_name"),
    ]);

    setIsLoadingTeamLeaderboard(false);

    if (teamsResponse.error) {
      console.error("Failed to fetch teams for team leaderboard:", teamsResponse.error);
      setErrorMessage("Could not load team leaderboard right now.");
      return;
    }

    if (teamMembersResponse.error) {
      console.error("Failed to fetch team members for team leaderboard:", teamMembersResponse.error);
      setErrorMessage("Could not load team leaderboard right now.");
      return;
    }

    if (workoutsResponse.error) {
      console.error("Failed to fetch workouts for team leaderboard:", workoutsResponse.error);
      setErrorMessage("Could not load team leaderboard right now.");
      return;
    }

    if (profilesResponse.error) {
      console.error("Failed to fetch profiles for team leaderboard:", profilesResponse.error);
      setErrorMessage("Could not load team leaderboard right now.");
      return;
    }

    const teams = (teamsResponse.data ?? []) as TeamRow[];
    const teamMembers = (teamMembersResponse.data ?? []) as TeamMemberRow[];
    const teamWorkouts = (workoutsResponse.data ?? []) as TeamWorkoutRow[];

    const usersByTeam = new Map<string, Set<string>>();
    for (const member of teamMembers) {
      const existingMembers = usersByTeam.get(member.team_id) ?? new Set<string>();
      existingMembers.add(member.user_id);
      usersByTeam.set(member.team_id, existingMembers);
    }

    const workoutsByUser = new Map<string, TeamWorkoutRow[]>();
    for (const workout of teamWorkouts) {
      const existingWorkouts = workoutsByUser.get(workout.user_id) ?? [];
      existingWorkouts.push(workout);
      workoutsByUser.set(workout.user_id, existingWorkouts);
    }

    const leaderboardRows: TeamLeaderboardRow[] = teams
      .filter((team) => (usersByTeam.get(team.id)?.size ?? 0) > 0)
      .map((team) => {
        const teamUserIds = Array.from(usersByTeam.get(team.id) ?? []);
        let totalVolume = 0;
        let bestLift = 0;

        for (const userId of teamUserIds) {
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

    setTeamLeaderboard(leaderboardRows);
  };

  const fetchGyms = async () => {
    setIsLoadingGyms(true);

    const { data, error } = await supabase
      .from("gyms")
      .select("id, name, created_by, created_at")
      .order("name", { ascending: true });

    setIsLoadingGyms(false);

    if (error) {
      console.error("Failed to fetch gyms:", error);
      setErrorMessage("Could not load gyms right now.");
      return;
    }

    setAllGyms((data ?? []) as GymRow[]);
  };

  const fetchGymLeaderboard = async () => {
    setIsLoadingGymLeaderboard(true);

    const [gymsResponse, profilesResponse, workoutsResponse] = await Promise.all([
      supabase.from("gyms").select("id, name"),
      supabase.from("profiles").select("id, gym_id"),
      supabase.from("workout_entries").select("user_id, weight, reps, sets"),
    ]);

    setIsLoadingGymLeaderboard(false);

    if (gymsResponse.error) {
      console.error("Failed to fetch gyms for gym leaderboard:", gymsResponse.error);
      setErrorMessage("Could not load gym leaderboard right now.");
      return;
    }
    if (profilesResponse.error) {
      console.error("Failed to fetch profiles for gym leaderboard:", profilesResponse.error);
      setErrorMessage("Could not load gym leaderboard right now.");
      return;
    }
    if (workoutsResponse.error) {
      console.error("Failed to fetch workouts for gym leaderboard:", workoutsResponse.error);
      setErrorMessage("Could not load gym leaderboard right now.");
      return;
    }

    const gymList = (gymsResponse.data ?? []) as { id: string; name: string }[];
    const profileGyms = (profilesResponse.data ?? []) as { id: string; gym_id: string | null }[];
    const allWorkouts = (workoutsResponse.data ?? []) as TeamWorkoutRow[];

    const userGym = new Map<string, string>();
    for (const row of profileGyms) {
      if (row.gym_id) userGym.set(row.id, row.gym_id);
    }

    const statsByGym = new Map<string, { name: string; totalVolume: number; bestLift: number }>();
    for (const gym of gymList) {
      statsByGym.set(gym.id, { name: gym.name, totalVolume: 0, bestLift: 0 });
    }

    for (const workout of allWorkouts) {
      const gymId = userGym.get(workout.user_id);
      if (!gymId) continue;
      const slot = statsByGym.get(gymId);
      if (!slot) continue;
      const w = Number(workout.weight);
      slot.totalVolume += w * workout.reps * workout.sets;
      slot.bestLift = Math.max(slot.bestLift, w);
    }

    const rows: GymLeaderboardRow[] = Array.from(statsByGym.entries())
      .map(([gymId, s]) => ({
        gymId,
        gymName: s.name,
        totalVolume: s.totalVolume,
        bestLift: s.bestLift,
      }))
      .sort((a, b) => b.totalVolume - a.totalVolume);

    setGymLeaderboard(rows);
  };

  const fetchRecentActivity = async () => {
    setIsLoadingRecentActivity(true);

    const { data, error } = await supabase
      .from("workout_entries")
      .select("id, exercise_name, weight, reps, sets, created_at, profiles(display_name, username, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(10);

    setIsLoadingRecentActivity(false);

    if (error) {
      console.error("Failed to fetch recent activity:", error);
      setErrorMessage("Could not load recent activity right now.");
      return;
    }

    setRecentActivity((data ?? []) as RecentActivityRow[]);
  };

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session?.user) {
        router.replace("/login");
        return;
      }

      setUser({
        id: data.session.user.id,
        email: data.session.user.email,
      });

      const loadedProfile = await fetchProfile(data.session.user.id);
      if (!loadedProfile?.username) {
        router.replace("/complete-profile");
        return;
      }

      await Promise.all([
        fetchUserWorkouts(data.session.user.id),
        fetchGlobalLeaderboard(),
        fetchTeamLeaderboard(),
        fetchGymLeaderboard(),
        fetchGyms(),
        fetchRecentActivity(),
        fetchMyTeams(data.session.user.id),
        fetchAvailableTeams(data.session.user.id),
      ]);
      setIsLoading(false);
    };

    void loadSession();
  }, [router]);

  const handleWorkoutSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWorkoutFormTouched(true);

    if (!user) {
      setErrorMessage("You must be logged in to add workouts.");
      return;
    }

    if (!hasUsername) {
      setErrorMessage("Set your username before adding workouts.");
      return;
    }

    if (!isWorkoutFormValid) {
      setErrorMessage("Fix the workout form errors before submitting.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const parsedWeight = Number(weight);
    const parsedReps = Number(reps);
    const parsedSets = Number(sets);

    const { error } = await supabase.from("workout_entries").insert({
      user_id: user.id,
      exercise_name: exerciseName,
      weight: parsedWeight,
      reps: parsedReps,
      sets: parsedSets,
    });

    setIsSubmitting(false);

    if (error) {
      console.error("Failed to create workout:", error);
      setErrorMessage("Could not save workout. Please try again.");
      return;
    }

    setExerciseName("");
    setWeight("");
    setReps("");
    setSets("");
    setWorkoutFormTouched(false);

    await fetchUserWorkouts(user.id);
    await fetchGlobalLeaderboard();
    await fetchTeamLeaderboard();
    await fetchGymLeaderboard();
    await fetchRecentActivity();
  };

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSavingProfile(true);

    const normalizedUsername = usernameInput.trim().toLowerCase();
    const usernameRule = /^[a-z0-9_]{3,20}$/;

    if (!normalizedUsername) {
      setErrorMessage("Username is required.");
      return;
    }

    if (!usernameRule.test(normalizedUsername)) {
      setErrorMessage(
        "Username must be 3-20 characters, lowercase only, no spaces. Use letters, numbers, or underscore.",
      );
      return;
    }

    const updates = {
      display_name: displayNameInput.trim() || normalizedUsername,
      username: normalizedUsername,
      avatar_url: avatarUrlInput.trim() || null,
    };

    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);

    setIsSavingProfile(false);

    if (error) {
      console.error("Failed to update profile:", error);
      if (error.code === "23505") {
        setErrorMessage("That username is already taken. Please choose another one.");
      } else {
        setErrorMessage(error.message);
      }
      return;
    }

    setUsernameGateError(null);
    setSuccessMessage("Profile updated.");
    await Promise.all([fetchProfile(user.id), fetchGlobalLeaderboard()]);
  };

  const handleCreateTeam = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setErrorMessage("You must be logged in to create a team.");
      return;
    }

    setErrorMessage(null);
    setIsCreatingTeam(true);

    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .insert({
        name: teamName,
        description: teamDescription || null,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (teamError || !teamData) {
      console.error("Failed to create team:", teamError);
      setErrorMessage(teamError?.message ?? "Could not create team.");
      setIsCreatingTeam(false);
      return;
    }

    const { error: membershipError } = await supabase.from("team_members").insert({
      team_id: teamData.id,
      user_id: user.id,
      role: "owner",
    });

    if (membershipError) {
      console.error("Failed to add team owner membership:", membershipError);
      setErrorMessage(membershipError.message);
      setIsCreatingTeam(false);
      return;
    }

    setTeamName("");
    setTeamDescription("");
    setIsCreatingTeam(false);
    await Promise.all([
      fetchMyTeams(user.id),
      fetchTeamLeaderboard(),
      fetchAvailableTeams(user.id),
      fetchRecentActivity(),
    ]);
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!user) {
      setErrorMessage("You must be logged in to join a team.");
      return;
    }

    setErrorMessage(null);
    setJoiningTeamId(teamId);

    const { data: existingMembership, error: membershipCheckError } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipCheckError) {
      console.error("Failed to check team membership:", membershipCheckError);
      setErrorMessage(membershipCheckError.message);
      setJoiningTeamId(null);
      return;
    }

    if (existingMembership) {
      setErrorMessage("Already in team");
      setJoiningTeamId(null);
      await Promise.all([fetchMyTeams(user.id), fetchTeamLeaderboard(), fetchAvailableTeams(user.id)]);
      return;
    }

    const { error } = await supabase.from("team_members").insert({
      team_id: teamId,
      user_id: user.id,
      role: "member",
    });

    if (error) {
      console.error("Failed to join team:", error);

      // Unique violation means the user is already in this team.
      if (error.code === "23505") {
        setErrorMessage("Already in team");
      } else {
        setErrorMessage(error.message);
      }

      setJoiningTeamId(null);
      await Promise.all([fetchMyTeams(user.id), fetchTeamLeaderboard(), fetchAvailableTeams(user.id)]);
      return;
    }

    setJoiningTeamId(null);
    await Promise.all([fetchMyTeams(user.id), fetchTeamLeaderboard(), fetchAvailableTeams(user.id)]);
  };

  const handleCreateGym = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setErrorMessage("You must be logged in to create a gym.");
      return;
    }
    if (!hasUsername) {
      setErrorMessage("Set your username before creating a gym.");
      return;
    }

    const name = gymNameInput.trim();
    if (name.length < 2) {
      setErrorMessage("Gym name must be at least 2 characters.");
      return;
    }
    if (name.length > 80) {
      setErrorMessage("Gym name must be 80 characters or less.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsCreatingGym(true);

    const { data: gymData, error: insertError } = await supabase
      .from("gyms")
      .insert({ name, created_by: user.id })
      .select("id")
      .single();

    if (insertError || !gymData) {
      console.error("Failed to create gym:", insertError);
      setErrorMessage(insertError?.message ?? "Could not create gym.");
      setIsCreatingGym(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ gym_id: gymData.id })
      .eq("id", user.id);

    if (profileError) {
      console.error("Failed to join created gym:", profileError);
      setErrorMessage(profileError.message);
      setIsCreatingGym(false);
      return;
    }

    setGymNameInput("");
    setIsCreatingGym(false);
    setSuccessMessage("Gym created. You are now a member.");
    await Promise.all([fetchProfile(user.id), fetchGyms(), fetchGymLeaderboard(), fetchGlobalLeaderboard()]);
  };

  const handleJoinGym = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setErrorMessage("You must be logged in to join a gym.");
      return;
    }
    if (!hasUsername) {
      setErrorMessage("Set your username before joining a gym.");
      return;
    }
    if (!joinGymId) {
      setErrorMessage("Choose a gym from the list.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsJoiningGym(true);

    const { error } = await supabase.from("profiles").update({ gym_id: joinGymId }).eq("id", user.id);

    setIsJoiningGym(false);

    if (error) {
      console.error("Failed to join gym:", error);
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage("You joined the gym.");
    await Promise.all([fetchProfile(user.id), fetchGymLeaderboard(), fetchGlobalLeaderboard()]);
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <p className="text-sm text-slate-200">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <LogoutButton />
        </div>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={profileDisplayName} avatarUrl={profile?.avatar_url} size="lg" />
            <div>
              <p className="text-lg font-semibold text-slate-100">{profileDisplayName}</p>
              <p className="text-sm text-slate-300">{user?.email}</p>
              <p className="text-xs text-slate-400">User ID: {user?.id}</p>
            </div>
          </div>
          <form onSubmit={handleProfileSave} className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-100">
              Display Name
              <input
                type="text"
                value={displayNameInput}
                onChange={(event) => setDisplayNameInput(event.target.value)}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-100">
              Username
              <input
                type="text"
                value={usernameInput}
                onChange={(event) => setUsernameInput(event.target.value.toLowerCase().replace(/\s+/g, ""))}
                required
                minLength={3}
                maxLength={20}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-100 sm:col-span-2">
              Avatar URL
              <input
                type="url"
                value={avatarUrlInput}
                onChange={(event) => setAvatarUrlInput(event.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-100 sm:col-span-2">
              Upload Profile Picture
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                onChange={handleAvatarFileChange}
                disabled={isUploadingAvatar}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-950 hover:file:bg-emerald-400"
              />
              <span className="text-xs text-slate-300">PNG, JPG/JPEG, or WEBP. Max size 2MB.</span>
            </label>
            {selectedAvatarPreviewUrl ? (
              <div className="sm:col-span-2">
                <p className="mb-2 text-xs text-slate-300">Preview</p>
                <img
                  src={selectedAvatarPreviewUrl}
                  alt="Selected avatar preview"
                  className="h-20 w-20 rounded-full border border-slate-600 object-cover"
                />
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleAvatarUploadSubmit}
              disabled={isUploadingAvatar || !selectedAvatarFile}
              className="w-full rounded-lg border border-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-900/30 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit"
            >
              {isUploadingAvatar ? "Uploading..." : "Upload Avatar"}
            </button>
            <button
              type="submit"
              disabled={isSavingProfile || isUploadingAvatar}
              className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit"
            >
              {isSavingProfile ? "Saving..." : "Save Profile"}
            </button>
          </form>
          {!hasUsername ? (
            <p className="mt-3 text-sm font-medium text-amber-300">
              Username required. Set it now to unlock workout submission and the full dashboard.
            </p>
          ) : null}
          {usernameGateError ? <p className="mt-2 text-sm text-rose-400">{usernameGateError}</p> : null}
          {isUploadingAvatar ? <p className="mt-2 text-sm text-slate-300">Uploading avatar...</p> : null}
          {avatarUploadError ? <p className="mt-2 text-sm text-rose-400">{avatarUploadError}</p> : null}
          {avatarUploadSuccess ? <p className="mt-2 text-sm text-emerald-400">{avatarUploadSuccess}</p> : null}
        </section>

        {!hasUsername ? (
          <section className="mt-6 rounded-xl border border-amber-700 bg-amber-950/30 p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-amber-200">Complete setup to continue</h2>
            <p className="mt-2 text-sm text-amber-100">
              Set a unique username to unlock workouts, teams, and leaderboard interactions.
            </p>
          </section>
        ) : null}

        {hasUsername ? (
          <>
        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-slate-700 bg-slate-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Total Volume</p>
            <p className="mt-2 text-2xl font-bold text-slate-100">{stats.totalVolume.toLocaleString()}</p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Best Lift</p>
            <p className="mt-2 text-2xl font-bold text-slate-100">{stats.bestLift.toLocaleString()}</p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Best Lift Exercise</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">{stats.bestLiftExerciseName}</p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Total Entries</p>
            <p className="mt-2 text-2xl font-bold text-slate-100">{stats.totalEntries}</p>
          </article>
        </section>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-100">Gym</h2>
          {isLoadingGyms ? (
            <p className="mt-3 text-sm text-slate-300">Loading gyms...</p>
          ) : (
            <>
              <p className="mt-2 text-sm text-slate-200">
                <span className="text-slate-400">Your gym: </span>
                {profile?.gym_id ? (
                  <span className="font-semibold text-emerald-300">
                    {allGyms.find((g) => g.id === profile.gym_id)?.name ?? "—"}
                  </span>
                ) : (
                  <span className="text-slate-300">Not in a gym yet.</span>
                )}
              </p>
              <form onSubmit={handleCreateGym} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm font-medium text-slate-100">
                  New gym name
                  <input
                    type="text"
                    value={gymNameInput}
                    onChange={(event) => setGymNameInput(event.target.value)}
                    minLength={2}
                    maxLength={80}
                    placeholder="e.g. Iron Valley"
                    className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
                  />
                </label>
                <button
                  type="submit"
                  disabled={isCreatingGym}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit"
                >
                  {isCreatingGym ? "Creating..." : "Create & join"}
                </button>
              </form>
              <form onSubmit={handleJoinGym} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm font-medium text-slate-100">
                  Join an existing gym
                  <select
                    value={joinGymId}
                    onChange={(event) => setJoinGymId(event.target.value)}
                    className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
                  >
                    <option value="">Select a gym...</option>
                    {allGyms.map((gym) => (
                      <option key={gym.id} value={gym.id}>
                        {gym.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  disabled={isJoiningGym || !joinGymId}
                  className="w-full rounded-lg border border-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-900/30 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit"
                >
                  {isJoiningGym ? "Joining..." : "Join gym"}
                </button>
              </form>
            </>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-100">Global Leaderboard</h2>
          {isLoadingLeaderboard ? (
            <p className="mt-3 text-sm text-slate-300">Loading leaderboard...</p>
          ) : globalLeaderboard.length === 0 ? (
            <p className="mt-3 text-sm text-slate-300">No workout entries yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-200">
                    <th className="px-2 py-2 font-semibold">Rank</th>
                    <th className="px-2 py-2 font-semibold">Display Name</th>
                    <th className="px-2 py-2 font-semibold">Total Volume</th>
                    <th className="px-2 py-2 font-semibold">Best Lift</th>
                  </tr>
                </thead>
                <tbody>
                  {globalLeaderboard.map((entry, index) => (
                    <tr
                      key={entry.userId}
                      className={`border-b border-slate-800 transition hover:scale-[1.01] hover:bg-slate-800/50 ${
                        entry.userId === user?.id ? "bg-emerald-500/20" : ""
                      }`}
                    >
                      <td className="px-2 py-2 font-medium">
                        <span
                          className={`inline-flex min-w-12 items-center justify-center rounded-full border px-2 py-0.5 text-xs font-bold ${getTopRankStyles(index + 1)}`}
                        >
                          #{index + 1}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar name={entry.displayName} avatarUrl={entry.avatarUrl} size="sm" />
                          <span>{entry.displayName}</span>
                          {entry.userId === user?.id ? (
                            <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-xs font-semibold text-emerald-950">
                              You
                            </span>
                          ) : null}
                          {index < 3 ? (
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-bold ${getRankBadgeStyles(index + 1)}`}
                            >
                              #{index + 1}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-2 py-2">{entry.totalVolume.toLocaleString()}</td>
                      <td className="px-2 py-2">{entry.bestLift.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-100">Team Leaderboard</h2>
          {isLoadingTeamLeaderboard ? (
            <p className="mt-3 text-sm text-slate-300">Loading team leaderboard...</p>
          ) : teamLeaderboard.length === 0 ? (
            <p className="mt-3 text-sm text-slate-300">No teams with members yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-200">
                    <th className="px-2 py-2 font-semibold">Rank</th>
                    <th className="px-2 py-2 font-semibold">Team Name</th>
                    <th className="px-2 py-2 font-semibold">Total Volume</th>
                    <th className="px-2 py-2 font-semibold">Best Lift</th>
                  </tr>
                </thead>
                <tbody>
                  {teamLeaderboard.map((team, index) => (
                    <tr key={team.teamId} className="border-b border-slate-800">
                      <td className="px-2 py-2 font-medium">{index + 1}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar name={team.teamName} avatarUrl={null} size="sm" />
                          <span>{team.teamName}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2">{team.totalVolume.toLocaleString()}</td>
                      <td className="px-2 py-2">{team.bestLift.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-100">Gym Leaderboard</h2>
          {isLoadingGymLeaderboard ? (
            <p className="mt-3 text-sm text-slate-300">Loading gym leaderboard...</p>
          ) : gymLeaderboard.length === 0 ? (
            <p className="mt-3 text-sm text-slate-300">No gyms yet. Create one above.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-200">
                    <th className="px-2 py-2 font-semibold">Rank</th>
                    <th className="px-2 py-2 font-semibold">Gym</th>
                    <th className="px-2 py-2 font-semibold">Total Volume</th>
                    <th className="px-2 py-2 font-semibold">Best Lift</th>
                  </tr>
                </thead>
                <tbody>
                  {gymLeaderboard.map((row, index) => (
                    <tr
                      key={row.gymId}
                      className={`border-b border-slate-800 ${
                        row.gymId === profile?.gym_id ? "bg-emerald-500/20" : ""
                      }`}
                    >
                      <td className="px-2 py-2 font-medium">{index + 1}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar name={row.gymName} avatarUrl={null} size="sm" />
                          <span>{row.gymName}</span>
                          {row.gymId === profile?.gym_id ? (
                            <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-xs font-semibold text-emerald-950">
                              Yours
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-2 py-2">{row.totalVolume.toLocaleString()}</td>
                      <td className="px-2 py-2">{row.bestLift.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-100">Recent Activity</h2>
          {isLoadingRecentActivity ? (
            <p className="mt-3 text-sm text-slate-300">Loading recent activity...</p>
          ) : recentActivity.length === 0 ? (
            <p className="mt-3 text-sm text-slate-300">No recent workouts yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-200">
                    <th className="px-2 py-2 font-semibold">Athlete</th>
                    <th className="px-2 py-2 font-semibold">Workout</th>
                    <th className="px-2 py-2 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((entry) => {
                    const profile = Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles;
                    const athleteName = publicDisplayName(
                      profile?.display_name ?? null,
                      profile?.username ?? null,
                    );
                    return (
                      <tr key={entry.id} className="border-b border-slate-800">
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-2">
                            <Avatar
                              name={athleteName}
                              avatarUrl={profile?.avatar_url ?? null}
                              size="sm"
                            />
                            <span>{athleteName}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          {entry.exercise_name} - {Number(entry.weight).toLocaleString()} x {entry.reps} x{" "}
                          {entry.sets}
                        </td>
                        <td className="px-2 py-2">
                          {new Date(entry.created_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-100">Add Workout</h2>
          {!hasUsername ? (
            <p className="mt-2 text-sm text-amber-300">
              Set a valid username in Profile first to enable workout submission.
            </p>
          ) : null}
          <form onSubmit={handleWorkoutSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-100 sm:col-span-2">
              Exercise Name
              <input
                type="text"
                required
                value={exerciseName}
                onChange={(event) => {
                  setExerciseName(event.target.value);
                  setWorkoutFormTouched(true);
                }}
                disabled={!hasUsername}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
              />
              {exerciseError ? <span className="text-xs text-rose-400">{exerciseError}</span> : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-100">
              Weight
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={weight}
                onChange={(event) => {
                  setWeight(event.target.value);
                  setWorkoutFormTouched(true);
                }}
                disabled={!hasUsername}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
              />
              {weightError ? <span className="text-xs text-rose-400">{weightError}</span> : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-100">
              Reps
              <input
                type="number"
                required
                min="1"
                value={reps}
                onChange={(event) => {
                  setReps(event.target.value);
                  setWorkoutFormTouched(true);
                }}
                disabled={!hasUsername}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
              />
              {repsError ? <span className="text-xs text-rose-400">{repsError}</span> : null}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-100">
              Sets
              <input
                type="number"
                required
                min="1"
                value={sets}
                onChange={(event) => {
                  setSets(event.target.value);
                  setWorkoutFormTouched(true);
                }}
                disabled={!hasUsername}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
              />
              {setsError ? <span className="text-xs text-rose-400">{setsError}</span> : null}
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting || !hasUsername || !isWorkoutFormValid}
                className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Save Workout"}
              </button>
            </div>
          </form>

          {errorMessage ? <p className="mt-3 text-sm text-rose-400">{errorMessage}</p> : null}
          {successMessage ? <p className="mt-2 text-sm text-emerald-400">{successMessage}</p> : null}
        </section>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-100">Create Team</h2>
          <form onSubmit={handleCreateTeam} className="mt-4 grid gap-3">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-100">
              Team Name
              <input
                type="text"
                required
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-100">
              Description (optional)
              <textarea
                value={teamDescription}
                onChange={(event) => setTeamDescription(event.target.value)}
                rows={3}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
              />
            </label>
            <button
              type="submit"
              disabled={isCreatingTeam}
              className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit"
            >
              {isCreatingTeam ? "Creating team..." : "Create Team"}
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-100">My Teams</h2>
          {isLoadingTeams ? (
            <p className="mt-3 text-sm text-slate-300">Loading teams...</p>
          ) : myTeams.length === 0 ? (
            <p className="mt-3 text-sm text-slate-300">You are not in any teams yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-200">
                    <th className="px-2 py-2 font-semibold">Team Name</th>
                    <th className="px-2 py-2 font-semibold">Description</th>
                    <th className="px-2 py-2 font-semibold">Role</th>
                    <th className="px-2 py-2 font-semibold">Your Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {myTeams.map((team) => (
                    <tr key={team.id} className="border-b border-slate-800">
                      <td className="px-2 py-2">{team.name}</td>
                      <td className="px-2 py-2">{team.description ?? "-"}</td>
                      <td className="px-2 py-2 capitalize">{team.role}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar name={profileDisplayName} avatarUrl={profile?.avatar_url} size="sm" />
                          <span>{profileDisplayName}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-100">Available Teams</h2>
          {availableTeams.length === 0 ? (
            <p className="mt-3 text-sm text-slate-300">No teams available to join right now.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-200">
                    <th className="px-2 py-2 font-semibold">Team Name</th>
                    <th className="px-2 py-2 font-semibold">Description</th>
                    <th className="px-2 py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableTeams.map((team) => (
                    <tr key={team.id} className="border-b border-slate-800">
                      <td className="px-2 py-2">{team.name}</td>
                      <td className="px-2 py-2">{team.description ?? "-"}</td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => handleJoinTeam(team.id)}
                          disabled={joiningTeamId === team.id}
                          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {joiningTeamId === team.id ? "Joining..." : "Join Team"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-100">Your Workouts</h2>
          {isLoadingWorkouts ? (
            <p className="mt-3 text-sm text-slate-300">Loading workouts...</p>
          ) : workouts.length === 0 ? (
            <p className="mt-3 text-sm text-slate-300">No workouts yet. Add your first entry above.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-200">
                    <th className="px-2 py-2 font-semibold">Exercise</th>
                    <th className="px-2 py-2 font-semibold">Weight</th>
                    <th className="px-2 py-2 font-semibold">Reps</th>
                    <th className="px-2 py-2 font-semibold">Sets</th>
                    <th className="px-2 py-2 font-semibold">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((entry) => {
                    const entryWeight = Number(entry.weight);
                    const volume = entryWeight * entry.reps * entry.sets;

                    return (
                      <tr key={entry.id} className="border-b border-slate-800">
                        <td className="px-2 py-2">{entry.exercise_name}</td>
                        <td className="px-2 py-2">{entryWeight}</td>
                        <td className="px-2 py-2">{entry.reps}</td>
                        <td className="px-2 py-2">{entry.sets}</td>
                        <td className="px-2 py-2 font-medium">{volume}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-6">
          <Link href="/" className="text-sm font-medium text-emerald-400 underline">
            Back to home
          </Link>
        </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
