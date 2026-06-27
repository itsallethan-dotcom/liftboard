/**
 * Forgeonix CRM — in-memory demo data layer (Phase 1).
 *
 * A tiny mutable store over clones of the seed data, exposing a uniform CRUD
 * surface per entity. This is the "demo" branch of the service layer: when demo
 * mode is on, API routes (Phase 2) call these collections; when off, the same
 * route shape will call Supabase instead. State lives in module memory for the
 * process lifetime (resettable), which is all a single-operator demo needs.
 */
import type {
  Client,
  CrmNote,
  CrmRecord,
  CrmSnapshot,
  FollowUp,
  Lead,
  Payment,
  Proposal,
  Task,
  UpdateInput,
} from "@/lib/crm/types";
import {
  demoClients,
  demoFollowUps,
  demoLeads,
  demoNotes,
  demoPayments,
  demoProposals,
  demoTasks,
} from "@/lib/crm/demo-data";

function uid(prefix: string): string {
  const rnd =
    globalThis.crypto?.randomUUID?.().slice(0, 8) ??
    Math.random().toString(36).slice(2, 10);
  return `${prefix}_${rnd}`;
}

const nowIso = (): string => new Date().toISOString();

export type Collection<T extends CrmRecord> = {
  list(): T[];
  get(id: string): T | null;
  create(data: Omit<T, keyof CrmRecord>): T;
  update(id: string, patch: UpdateInput<T>): T | null;
  remove(id: string): boolean;
  reset(): void;
};

function collection<T extends CrmRecord>(prefix: string, seed: T[]): Collection<T> {
  const clone = (rows: T[]): T[] => rows.map((r) => ({ ...r }));
  let rows: T[] = clone(seed);

  return {
    list: () => clone(rows),
    get: (id) => {
      const found = rows.find((r) => r.id === id);
      return found ? { ...found } : null;
    },
    create: (data) => {
      const ts = nowIso();
      const row = { ...(data as object), id: uid(prefix), created_at: ts, updated_at: ts } as T;
      rows = [row, ...rows];
      return { ...row };
    },
    update: (id, patch) => {
      const i = rows.findIndex((r) => r.id === id);
      if (i < 0) return null;
      rows[i] = { ...rows[i], ...patch, updated_at: nowIso() } as T;
      return { ...rows[i] };
    },
    remove: (id) => {
      const before = rows.length;
      rows = rows.filter((r) => r.id !== id);
      return rows.length < before;
    },
    reset: () => {
      rows = clone(seed);
    },
  };
}

/** The CRM demo data layer — one collection per entity. */
export const crmDemo = {
  clients: collection<Client>("cl", demoClients),
  leads: collection<Lead>("ld", demoLeads),
  tasks: collection<Task>("tk", demoTasks),
  followUps: collection<FollowUp>("fu", demoFollowUps),
  proposals: collection<Proposal>("pr", demoProposals),
  payments: collection<Payment>("pay", demoPayments),
  notes: collection<CrmNote>("nt", demoNotes),
};

/** Full snapshot of the current demo state (Phase 3 dashboard read). */
export function crmDemoSnapshot(): CrmSnapshot {
  return {
    clients: crmDemo.clients.list(),
    leads: crmDemo.leads.list(),
    tasks: crmDemo.tasks.list(),
    followUps: crmDemo.followUps.list(),
    proposals: crmDemo.proposals.list(),
    payments: crmDemo.payments.list(),
    notes: crmDemo.notes.list(),
  };
}

/** Reset every collection back to seed (useful for demo resets / tests). */
export function resetCrmDemo(): void {
  Object.values(crmDemo).forEach((c) => c.reset());
}
