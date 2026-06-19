"use client";

import {
  HubListItem,
  HubMuted,
  HubSection,
  HubStats,
  ModuleHubShell,
  useHubFetch,
} from "@/components/command/ModuleHubShell";
import type { BusinessDashboard } from "@/types/forgeonix-os";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { RecordsDashboard } from "@/types/forgeonix-os";

type BusinessPanelProps = { onClose?: () => void };

export function BusinessPanel({ onClose }: BusinessPanelProps) {
  const { data, loading, error } = useHubFetch<BusinessDashboard>("/api/os/business");
  const [records, setRecords] = useState<RecordsDashboard | null>(null);

  useEffect(() => {
    void fetch("/api/os/records")
      .then((r) => r.json())
      .then(setRecords)
      .catch(() => setRecords(null));
  }, []);

  const openTasks = data?.tasks.filter((t) => t.status === "open" || t.status === "in_progress") ?? [];

  return (
    <ModuleHubShell
      label="// FORGEONIX BUSINESS"
      title="Business Hub"
      onClose={onClose}
      loading={loading}
      error={error}
    >
      {data ? (
        <>
          <HubSection label="Overview">
            <HubStats
              items={[
                { label: "Clients", value: String(data.clients.length) },
                { label: "Projects", value: String(data.projects.length) },
                { label: "Tasks", value: String(openTasks.length), warn: openTasks.length > 0 },
              ]}
            />
          </HubSection>

          <HubSection label="Clients">
            {data.clients.length === 0 ? (
              <HubMuted>No clients in database.</HubMuted>
            ) : (
              data.clients.map((c) => (
                <HubListItem key={c.id} title={c.name} meta={c.company ?? undefined} badge={c.status} />
              ))
            )}
          </HubSection>

          <HubSection label="Projects">
            {data.projects.length === 0 ? (
              <HubMuted>No projects seeded.</HubMuted>
            ) : (
              data.projects.map((p) => (
                <div key={p.id} className="command-hub-row-wrap">
                  <HubListItem title={p.name} meta={p.stack ?? undefined} badge={p.status.replace(/_/g, " ")} />
                  {p.url ? (
                    <Link href={p.url} className="command-hub-link" target={p.url.startsWith("http") ? "_blank" : undefined}>
                      Open →
                    </Link>
                  ) : null}
                </div>
              ))
            )}
          </HubSection>

          <HubSection label="Tasks">
            {openTasks.length === 0 ? (
              <HubMuted>No open tasks.</HubMuted>
            ) : (
              openTasks.map((t) => (
                <HubListItem key={t.id} title={t.title} meta={t.notes ?? undefined} badge={t.status} />
              ))
            )}
          </HubSection>

          <HubSection label="Records · Milestones">
            {!records?.records.length ? (
              <HubMuted>No records yet.</HubMuted>
            ) : (
              records.records.slice(0, 5).map((r) => (
                <HubListItem
                  key={r.id}
                  title={r.title}
                  meta={r.project ?? undefined}
                  badge={r.record_type}
                />
              ))
            )}
          </HubSection>
        </>
      ) : null}
    </ModuleHubShell>
  );
}
