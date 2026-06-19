import { fetchCareerDashboard } from "@/lib/career/queries";
import { fetchBusinessDashboard } from "@/lib/os/business";
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
  const [infra, business, leads, career, notes, records, projects, liftboard] =
    await Promise.all([
    fetchInfrastructureDashboard(),
    fetchBusinessDashboard(),
    fetchLeadsDashboard(),
    fetchCareerDashboard(),
    fetchNotesDashboard(),
    fetchRecordsDashboard(),
    fetchOsProjects(),
    fetchLiftboardSummary().catch(() => null),
  ]);

  const openIncidents = infra.incidents.filter((i) => i.status === "open" || i.status === "investigating").length;

  const activeProjects = projects.filter((p) => !["completed", "archived"].includes(p.status)).length;
  const activeClients = business.clients.filter((c) => c.status === "active" || c.status === "prospect").length;
  const openTasks = business.tasks.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const pendingRevenue = business.revenue.filter((r) => r.status === "pending").length;

  const nextTask = business.tasks.find((t) => t.status === "open" || t.status === "in_progress");

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
      { label: "Active Projects", value: String(activeProjects), tone: "neutral" },
      { label: "Clients", value: String(activeClients), tone: "neutral" },
      {
        label: "Revenue Tracked",
        value: pendingRevenue > 0 ? `${pendingRevenue} pending` : "Manual Pending",
        tone: pendingRevenue > 0 ? "ok" : "warn",
      },
      {
        label: "Next Action",
        value: nextTask?.title ?? "Build lead workflow",
        tone: "neutral",
      },
      { label: "Open Tasks", value: String(openTasks), tone: openTasks > 0 ? "warn" : "neutral" },
    ],
    leads: [
      { label: "Prospects", value: String(leads.stats.total), tone: "neutral" },
      {
        label: "Follow-ups Due",
        value: String(leads.stats.followUpsDue),
        tone: leads.stats.followUpsDue > 0 ? "warn" : "neutral",
      },
      {
        label: "Qualified",
        value: String(leads.stats.qualified),
        tone: leads.stats.qualified > 0 ? "ok" : "neutral",
      },
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
    "ai-ops": [
      { label: "Notes", value: String(notes.notes.length), tone: "neutral" },
      {
        label: "Documentation",
        value: String(notes.notes.filter((n) => n.note_type === "documentation").length),
        tone: "neutral",
      },
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
    notes: [
      { label: "Notes", value: String(notes.notes.filter((n) => n.note_type === "note").length), tone: "neutral" },
      {
        label: "Docs",
        value: String(notes.notes.filter((n) => n.note_type === "documentation").length),
        tone: "neutral",
      },
    ],
    records: [
      { label: "Total", value: String(records.records.length), tone: "neutral" },
      {
        label: "Milestones",
        value: String(records.records.filter((r) => r.record_type === "milestone").length),
        tone: "neutral",
      },
      {
        label: "Wins",
        value: String(records.records.filter((r) => r.record_type === "win").length),
        tone: "ok",
      },
    ],
  };
}

/** Convenience export for modules that aren't hero cards but share memory. */
export async function fetchOsMemoryCounts() {
  const summary = await fetchOsModuleSummary();
  return summary;
}
