"use client";

import {
  HubListItem,
  HubMuted,
  HubSection,
  HubStats,
  ModuleHubShell,
  useHubFetch,
} from "@/components/command/ModuleHubShell";
import type { InfrastructureDashboard } from "@/types/forgeonix-os";
import { useState } from "react";

type InfrastructurePanelProps = { onClose?: () => void };

function formatStatus(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function InfrastructurePanel({ onClose }: InfrastructurePanelProps) {
  const { data, loading, error } = useHubFetch<InfrastructureDashboard>("/api/os/infrastructure");
  const [expanded, setExpanded] = useState<string | null>(null);

  const openIncidents =
    data?.incidents.filter((i) => i.status === "open" || i.status === "investigating").length ?? 0;

  return (
    <ModuleHubShell
      label="// INFRASTRUCTURE"
      title="Systems Lab"
      onClose={onClose}
      loading={loading}
      error={error}
    >
      {data ? (
        <>
          <HubSection label="Services">
            <HubStats
              items={[
                { label: "Total", value: String(data.services.length) },
                {
                  label: "Online",
                  value: String(data.services.filter((s) => s.status === "online").length),
                },
                {
                  label: "Incidents",
                  value: String(openIncidents),
                  warn: openIncidents > 0,
                },
              ]}
            />
            {data.services.length === 0 ? (
              <HubMuted>No services in database.</HubMuted>
            ) : (
              data.services.map((s) => (
                <HubListItem
                  key={s.id}
                  title={s.name}
                  meta={s.notes ?? undefined}
                  badge={formatStatus(s.status)}
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                />
              ))
            )}
          </HubSection>

          <HubSection label="Planned Upgrades">
            {data.upgrades.length === 0 ? (
              <HubMuted>No planned upgrades.</HubMuted>
            ) : (
              data.upgrades.map((u) => (
                <HubListItem
                  key={u.id}
                  title={u.title}
                  meta={u.notes ?? undefined}
                  badge={formatStatus(u.status)}
                />
              ))
            )}
          </HubSection>

          <HubSection label="Assets">
            {data.assets.length === 0 ? (
              <HubMuted>No assets seeded.</HubMuted>
            ) : (
              data.assets.map((a) => (
                <HubListItem key={a.id} title={a.name} meta={a.host ?? undefined} badge={formatStatus(a.status)} />
              ))
            )}
          </HubSection>
        </>
      ) : null}
    </ModuleHubShell>
  );
}
