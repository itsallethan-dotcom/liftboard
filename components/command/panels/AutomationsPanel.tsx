"use client";

import {
  HubListItem,
  HubMuted,
  HubSection,
  HubStats,
  ModuleHubShell,
} from "@/components/command/ModuleHubShell";

type AutomationsPanelProps = { onClose?: () => void };

/**
 * Placeholder hub. The automation engine (n8n) is Phase 9 and intentionally
 * not built yet — this card reserves the slot and documents the planned flows.
 */
export function AutomationsPanel({ onClose }: AutomationsPanelProps) {
  return (
    <ModuleHubShell
      label="// AUTOMATIONS"
      title="Automation Engine"
      subtitle="n8n workflows · Phase 9 (not yet active)"
      onClose={onClose}
    >
      <HubSection label="Status">
        <HubStats
          items={[
            { label: "Engine", value: "Phase 9" },
            { label: "Workflows", value: "0" },
            { label: "Webhooks", value: "Planned", warn: true },
          ]}
        />
        <HubMuted>
          The automation layer plugs into the command center once Phase 1 is complete.
          Wiring n8n is deliberately deferred.
        </HubMuted>
      </HubSection>

      <HubSection label="Planned flows">
        <HubListItem title="Lead captured → CRM entry → task → notify" badge="planned" />
        <HubListItem title="Resume downloaded → log event → create lead → notify" badge="planned" />
        <HubListItem title="Infra outage → alert → notification → log" badge="planned" />
      </HubSection>
    </ModuleHubShell>
  );
}
