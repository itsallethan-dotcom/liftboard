/**
 * Forgeonix CRM — read layer (Phase 2).
 * Entity reads + dashboard aggregation. Aggregation runs in TS over a single
 * snapshot, so the dashboard is one round trip and the result is identical for
 * demo and Supabase sources.
 */
import { crmSource, storeFor } from "@/lib/crm/service";
import type {
  CrmActivity,
  CrmDashboard,
  CrmEntityKey,
  CrmRecord,
  CrmSnapshot,
  CrmStats,
} from "@/lib/crm/types";

export async function listEntity(key: CrmEntityKey): Promise<CrmRecord[]> {
  return storeFor(key).list();
}

export async function getEntity(key: CrmEntityKey, id: string): Promise<CrmRecord | null> {
  return storeFor(key).get(id);
}

export async function getCrmSnapshot(): Promise<CrmSnapshot> {
  return crmSource().snapshot();
}

const ACTIVE_CLIENT = "active";
const CLOSED_LEAD = ["won", "lost", "archived"];

export function computeCrmStats(s: CrmSnapshot): CrmStats {
  const now = Date.now();
  const taskOpen = (status: string) => status === "open" || status === "in_progress";
  const num = (v: number | null) => Number(v ?? 0);

  return {
    totalLeads: s.leads.length,
    activeLeads: s.leads.filter((l) => !CLOSED_LEAD.includes(l.status)).length,
    activeClients: s.clients.filter((c) => c.status === ACTIVE_CLIENT).length,
    openTasks: s.tasks.filter((t) => taskOpen(t.status)).length,
    overdueTasks: s.tasks.filter(
      (t) => taskOpen(t.status) && t.due_date != null && new Date(t.due_date).getTime() < now,
    ).length,
    followUpsDue: s.followUps.filter(
      (f) => f.status === "pending" && f.due_date != null && new Date(f.due_date).getTime() <= now,
    ).length,
    proposalsSent: s.proposals.filter((p) => p.sent_at != null).length,
    proposalsPending: s.proposals.filter((p) => p.status === "sent").length,
    revenueReceived: s.payments
      .filter((p) => p.status === "received")
      .reduce((sum, p) => sum + num(p.amount), 0),
    revenuePending: s.payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + num(p.amount), 0),
  };
}

export function computeRecentActivity(s: CrmSnapshot, limit = 10): CrmActivity[] {
  const items: CrmActivity[] = [
    ...s.leads.map((l) => mk(l.id, "lead", `Lead · ${l.name} (${l.status})`, l.updated_at)),
    ...s.clients.map((c) => mk(c.id, "client", `Client · ${c.name} (${c.status})`, c.updated_at)),
    ...s.tasks.map((t) => mk(t.id, "task", `Task · ${t.title} (${t.status})`, t.updated_at)),
    ...s.followUps.map((f) => mk(f.id, "follow_up", `Follow-up · ${f.title}`, f.updated_at)),
    ...s.proposals.map((p) => mk(p.id, "proposal", `Proposal · ${p.title} (${p.status})`, p.updated_at)),
    ...s.payments.map((p) => mk(p.id, "payment", `Payment · ${p.label} (${p.status})`, p.updated_at)),
    ...s.notes.map((n) => mk(n.id, "note", `Note · ${n.body.slice(0, 60)}`, n.updated_at)),
  ];
  return items
    .filter((i) => Boolean(i.at))
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, limit);
}

function mk(id: string, kind: CrmActivity["kind"], label: string, at: string): CrmActivity {
  return { id, kind, label, at };
}

/** One call → everything the dashboard needs (single snapshot round trip). */
export async function getCrmDashboard(): Promise<CrmDashboard> {
  const snapshot = await crmSource().snapshot();
  return {
    stats: computeCrmStats(snapshot),
    recentActivity: computeRecentActivity(snapshot),
    snapshot,
  };
}
