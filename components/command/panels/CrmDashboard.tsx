"use client";

/**
 * CRM dashboard (Phase 3). Source-agnostic: reads the single `/api/crm/dashboard`
 * endpoint (demo or Supabase — it can't tell) and renders with the existing V1 hub
 * toolkit, so it matches the frozen command-center style with no new CSS.
 */
import {
  HubListItem,
  HubMuted,
  HubSection,
  HubStats,
  useHubFetch,
} from "@/components/command/ModuleHubShell";
import type { CrmDashboard as CrmDashboardData } from "@/lib/crm/types";

function money(n: number): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function ago(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function CrmDashboard() {
  const { data, loading, error } = useHubFetch<CrmDashboardData>("/api/crm/dashboard");

  if (loading) return <HubMuted>Loading CRM…</HubMuted>;
  if (error) return <p className="command-hub-panel__error">{error}</p>;
  if (!data) return null;

  const { stats, recentActivity } = data;

  return (
    <>
      <HubSection label="CRM Overview">
        <HubStats
          items={[
            { label: "Total Leads", value: String(stats.totalLeads) },
            { label: "Active Clients", value: String(stats.activeClients) },
            { label: "Open Tasks", value: String(stats.openTasks), warn: stats.overdueTasks > 0 },
            { label: "Follow-ups Due", value: String(stats.followUpsDue), warn: stats.followUpsDue > 0 },
            { label: "Proposals Sent", value: String(stats.proposalsSent) },
            { label: "Revenue Tracked", value: money(stats.revenueReceived) },
          ]}
        />
      </HubSection>

      <HubSection label="Pipeline & Cash">
        <HubStats
          items={[
            { label: "Active Leads", value: String(stats.activeLeads) },
            { label: "Overdue Tasks", value: String(stats.overdueTasks), warn: stats.overdueTasks > 0 },
            { label: "Proposals Pending", value: String(stats.proposalsPending) },
            { label: "Revenue Pending", value: money(stats.revenuePending) },
          ]}
        />
      </HubSection>

      <HubSection label="Recent Activity">
        {recentActivity.length === 0 ? (
          <HubMuted>No recent activity.</HubMuted>
        ) : (
          recentActivity.map((a) => (
            <HubListItem
              key={`${a.kind}-${a.id}`}
              title={a.label}
              meta={ago(a.at)}
              badge={a.kind.replace("_", " ")}
            />
          ))
        )}
      </HubSection>
    </>
  );
}
