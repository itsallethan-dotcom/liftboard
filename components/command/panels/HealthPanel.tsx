"use client";

import {
  HubListItem,
  HubMuted,
  HubSection,
  HubStats,
  ModuleHubShell,
} from "@/components/command/ModuleHubShell";
import Link from "next/link";

type HealthPanelProps = { onClose?: () => void };

/**
 * Placeholder hub. Personal health tracking (bodyweight, calories, training,
 * bloodwork) is future work; Liftboard already covers training volume. This
 * card reserves the slot without fabricating data.
 */
export function HealthPanel({ onClose }: HealthPanelProps) {
  return (
    <ModuleHubShell
      label="// HEALTH & FITNESS"
      title="Personal Health"
      subtitle="Weight · calories · training · bloodwork"
      onClose={onClose}
    >
      <HubSection label="Status">
        <HubStats
          items={[
            { label: "Training", value: "Liftboard" },
            { label: "Bodyweight", value: "Planned", warn: true },
            { label: "Bloodwork", value: "—" },
          ]}
        />
        <HubMuted>
          Training volume lives in the Liftboard module. Bodyweight, calories, and
          bloodwork tracking are planned as a dedicated data model.
        </HubMuted>
      </HubSection>

      <HubSection label="Linked">
        <Link href="/workouts" className="command-hub-link">
          Open Liftboard workouts →
        </Link>
      </HubSection>
    </ModuleHubShell>
  );
}
