"use client";

import {
  HubListItem,
  HubMuted,
  HubSection,
  HubStats,
  ModuleHubShell,
  useHubFetch,
} from "@/components/command/ModuleHubShell";
import {
  formatLiftboardDate,
  formatLiftboardVolume,
  type LiftboardSummary,
} from "@/lib/os/liftboard";
import Link from "next/link";

type LiftboardPanelProps = { onClose?: () => void };

export function LiftboardPanel({ onClose }: LiftboardPanelProps) {
  const { data, loading, error } = useHubFetch<LiftboardSummary>("/api/os/liftboard-summary");

  const isEmpty =
    data &&
    data.totalUsers === 0 &&
    data.totalWorkouts === 0 &&
    data.totalVolume === 0;

  return (
    <ModuleHubShell
      label="// LIFTBOARD"
      title="App Metrics"
      subtitle="Live · profiles · workout_entries"
      onClose={onClose}
      loading={loading}
      error={error}
    >
      {data ? (
        <>
          {isEmpty ? (
            <HubMuted>No Liftboard data yet — log workouts in the app to populate metrics.</HubMuted>
          ) : null}

          <HubSection label="Main Stats">
            <HubStats
              items={[
                { label: "Users", value: String(data.totalUsers) },
                { label: "Workouts", value: String(data.totalWorkouts) },
                { label: "Volume", value: formatLiftboardVolume(data.totalVolume) },
                {
                  label: "This Week",
                  value: String(data.workoutsThisWeek),
                  warn: data.workoutsThisWeek === 0 && data.totalWorkouts > 0,
                },
              ]}
            />
            <HubMuted>
              {data.activeUsersThisWeek} active user{data.activeUsersThisWeek === 1 ? "" : "s"} this week
            </HubMuted>
          </HubSection>

          <HubSection label="Highlights">
            <HubListItem
              title="Top Lifter"
              meta={data.topLifter ?? "—"}
              badge={data.topLifter ? "volume" : undefined}
            />
            <HubListItem
              title="Top Exercise"
              meta={data.topExercise ?? "—"}
              badge={data.topExercise ? "logged" : undefined}
            />
            <HubListItem
              title="Latest Workout"
              meta={formatLiftboardDate(data.latestWorkoutAt)}
            />
          </HubSection>

          <HubSection label="Open App">
            <Link href="/dashboard" className="command-hub-link">
              Open Liftboard dashboard →
            </Link>
            <Link href="/leaderboard" className="command-hub-link">
              View leaderboard →
            </Link>
          </HubSection>
        </>
      ) : null}
    </ModuleHubShell>
  );
}
