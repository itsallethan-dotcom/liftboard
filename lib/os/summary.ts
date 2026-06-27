import { fetchCareerDashboard } from "@/lib/career/queries";
import { fetchBusinessDashboard } from "@/lib/os/business";
import { fetchMemoryDashboard } from "@/lib/os/memory";
import { fetchInfrastructureDashboard } from "@/lib/os/infrastructure";
import { fetchLeadsDashboard } from "@/lib/os/leads";
import { fetchNotesDashboard } from "@/lib/os/notes";
import { fetchOsProjects } from "@/lib/os/projects";
import { fetchLiftboardSummary, formatLiftboardVolume } from "@/lib/os/liftboard";
import { fetchRecordsDashboard } from "@/lib/os/records";
import type { ModuleDetailField } from "@/types/command";

export type OsModuleSummary = Record<string, ModuleDetailField[]>;

function toneFromStatus(status: string): ModuleDetailField["tone"] {
  if (["online", "live", "active", "received", "done", "resolved", "closed"].includes(status)) {
    return "ok";
  }
  if (["standby", "degraded", "pending", "in_development", "planned", "follow_up_due"].includes(status)) {
    return "warn";
  }
  if (["offline", "open", "new"].includes(status)) {
    return "neutral";
  }
  return "neutral";
}

function capitalizeStatus(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function fetchOsModuleSummary(): Promise<OsModuleSummary> {
  const [infra, business, leads, career, notes, records, projects, liftboard, memory] =
    await Promise.all([
    fetchInfrastructureDashboard(),
    fetchBusinessDashboard(),
    fetchLeadsDashboard(),
    fetchCareerDashboard(),
    fetchNotesDashboard(),
    fetchRecordsDashboard(),
    fetchOsProjects(),
    fetchLiftboardSummary().catch(() => null),
    fetchMemoryDashboard().catch(() => null),
  ]);

  const openIncidents = infra.incidents.filter((i) => i.status === "open" || i.status === "investigating").length;

  const activeClients = business.clients.filter((c) => c.status === "active" || c.status === "prospect").length;
  const openTasks = business.tasks.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const pendingRevenue = business.revenue.filter((r) => r.status === "pending").length;

  const nextTask = business.tasks.find((t) => t.status === "open" || t.status === "in_progress");

  const revenueEntries = business.revenue.length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const revenueThisMonth = business.monthlyRevenue.find((m) => m.month === thisMonth)?.total ?? 0;
  const outstandingInvoices = business.invoices.filter(
    (i) => i.status === "sent" || i.status === "overdue",
  ).length;
  const fmtMoney = (n: number) => (n > 0 ? `$${Math.round(n).toLocaleString()}` : "$0");

  return {
    infrastructure: [
      ...infra.services.slice(0, 4).map((s) => ({
        label: s.name,
        value: capitalizeStatus(s.status),
        tone: toneFromStatus(s.status),
      })),
      ...(infra.services.length === 0
        ? [{ label: "Services", value: "None seeded", tone: "warn" as const }]
        : []),
      ...(openIncidents > 0
        ? [{ label: "Incidents", value: String(openIncidents), tone: "warn" as const }]
        : []),
    ],
    business: [
      { label: "Clients", value: String(activeClients), tone: "neutral" },
      { label: "Leads", value: String(leads.stats.total), tone: "neutral" },
      {
        label: "Follow-ups Due",
        value: String(leads.stats.followUpsDue),
        tone: leads.stats.followUpsDue > 0 ? "warn" : "neutral",
      },
      { label: "Open Tasks", value: String(openTasks), tone: openTasks > 0 ? "warn" : "neutral" },
      { label: "Revenue (mo)", value: fmtMoney(revenueThisMonth), tone: revenueThisMonth > 0 ? "ok" : "neutral" },
      {
        label: "Next Action",
        value: nextTask?.title ?? "Build lead workflow",
        tone: "neutral",
      },
    ],
    finance: [
      { label: "Revenue (mo)", value: fmtMoney(revenueThisMonth), tone: revenueThisMonth > 0 ? "ok" : "neutral" },
      { label: "Outstanding Invoices", value: String(outstandingInvoices), tone: outstandingInvoices > 0 ? "warn" : "neutral" },
      { label: "Pending Revenue", value: String(pendingRevenue), tone: pendingRevenue > 0 ? "warn" : "neutral" },
      { label: "Revenue Entries", value: String(revenueEntries), tone: revenueEntries > 0 ? "ok" : "neutral" },
    ],
    automations: [
      { label: "Engine", value: "Phase 9", tone: "dev" },
      { label: "Workflows", value: "0", tone: "neutral" },
      { label: "Webhooks", value: "Planned", tone: "warn" },
    ],
    health: [
      { label: "Source", value: "Liftboard", tone: "neutral" },
      { label: "Bodyweight", value: "Planned", tone: "dev" },
      { label: "Bloodwork", value: "—", tone: "neutral" },
    ],
    career: [
      {
        label: "Applications",
        value: String(career.stats.totalActive),
        tone: "neutral",
      },
      {
        label: "Skills",
        value: String(career.skills.filter((s) => s.is_featured).length),
        tone: "neutral",
      },
      {
        label: "Follow-ups",
        value: String(career.stats.followUpsDue),
        tone: career.stats.followUpsDue > 0 ? "warn" : "ok",
      },
    ],
    // AI Memory is the primary system; notes/records are legacy internal sources.
    "ai-memory": memory
      ? [
          { label: "Memories", value: String(memory.stats.total), tone: "ok" },
          { label: "High Importance", value: String(memory.stats.highImportance), tone: "neutral" },
          { label: "Categories", value: String(memory.stats.categories), tone: "neutral" },
          { label: "Notes", value: String(notes.notes.length), tone: "neutral" },
          { label: "Records", value: String(records.records.length), tone: "neutral" },
        ]
      : [
          { label: "Notes", value: String(notes.notes.length), tone: "neutral" },
          { label: "Records", value: String(records.records.length), tone: "neutral" },
        ],
    liftboard: liftboard
      ? [
          { label: "Users", value: String(liftboard.totalUsers), tone: "neutral" },
          { label: "Workouts", value: String(liftboard.totalWorkouts), tone: "ok" },
          {
            label: "Volume",
            value: formatLiftboardVolume(liftboard.totalVolume),
            tone: liftboard.totalVolume > 0 ? "ok" : "neutral",
          },
          {
            label: "This Week",
            value: String(liftboard.workoutsThisWeek),
            tone: liftboard.workoutsThisWeek > 0 ? "ok" : "warn",
          },
          {
            label: "Top Lifter",
            value: liftboard.topLifter ?? "—",
            tone: "neutral",
          },
          {
            label: "Top Exercise",
            value: liftboard.topExercise ?? "—",
            tone: "neutral",
          },
        ]
      : [
          { label: "Status", value: "Sync failed", tone: "warn" },
          { label: "Users", value: "—", tone: "neutral" },
          { label: "Workouts", value: "—", tone: "neutral" },
        ],
    projects: [
      { label: "Total", value: String(projects.length), tone: "neutral" },
      { label: "Live", value: String(projects.filter((p) => p.status === "live").length), tone: "ok" },
      {
        label: "In Dev",
        value: String(projects.filter((p) => p.status === "in_development").length),
        tone: "dev",
      },
    ],
    // NOTE: notes & records are internal data sources surfaced *inside* the
    // ai-memory module above — they are intentionally not top-level modules,
    // matching the 9-card OS structure.
  };
}

/** Convenience export for modules that aren't hero cards but share memory. */
export async function fetchOsMemoryCounts() {
  const summary = await fetchOsModuleSummary();
  return summary;
}
