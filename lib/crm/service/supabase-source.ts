/**
 * Forgeonix CRM — Supabase data source (Phase 2).
 *
 * Implements the same CrmDataSource contract over the existing canonical tables,
 * so responses are byte-identical to the demo source. Notes have no dedicated
 * table, so they map to `business_communications` rows with channel = 'note'
 * (keeping the CRM connected to the existing communications data, not a silo).
 */
import { osDb } from "@/lib/os/db";
import type {
  Client,
  CrmNote,
  CrmRecord,
  FollowUp,
  Lead,
  Payment,
  Proposal,
  Task,
} from "@/lib/crm/types";
import type { CrmDataSource, EntityStore } from "@/lib/crm/service/source";

/** Generic store for entities whose CRM type maps 1:1 to a table's columns. */
function tableStore<T extends CrmRecord>(
  table: string,
  order: { column: string; ascending?: boolean },
): EntityStore<T> {
  return {
    list: async () => {
      const { data, error } = await osDb()
        .from(table)
        .select("*")
        .order(order.column, { ascending: order.ascending ?? false, nullsFirst: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as T[];
    },
    get: async (id) => {
      const { data, error } = await osDb().from(table).select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return (data as T) ?? null;
    },
    create: async (input) => {
      const { data, error } = await osDb()
        .from(table)
        .insert(input as Record<string, unknown>)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return data as T;
    },
    update: async (id, patch) => {
      const { data, error } = await osDb()
        .from(table)
        .update(patch as Record<string, unknown>)
        .eq("id", id)
        .select("*")
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data as T) ?? null;
    },
    remove: async (id) => {
      const { error } = await osDb().from(table).delete().eq("id", id);
      if (error) throw new Error(error.message);
      return true;
    },
  };
}

/* --- Notes ↔ business_communications(channel='note') mapping --- */
function commToNote(row: Record<string, unknown>): CrmNote {
  const ts =
    (row.created_at as string | null) ??
    (row.occurred_at as string | null) ??
    new Date().toISOString();
  return {
    id: String(row.id),
    client_id: (row.client_id as string | null) ?? null,
    lead_id: (row.lead_id as string | null) ?? null,
    body: (row.summary as string | null) ?? "",
    owner: (row.owner as string | null) ?? null,
    created_at: ts,
    updated_at: ts,
  };
}

const notesStore: EntityStore<CrmNote> = {
  list: async () => {
    const { data, error } = await osDb()
      .from("business_communications")
      .select("*")
      .eq("channel", "note")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as Record<string, unknown>[]).map(commToNote);
  },
  get: async (id) => {
    const { data, error } = await osDb()
      .from("business_communications")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? commToNote(data as Record<string, unknown>) : null;
  },
  create: async (input) => {
    const { data, error } = await osDb()
      .from("business_communications")
      .insert({
        channel: "note",
        client_id: input.client_id ?? null,
        lead_id: input.lead_id ?? null,
        summary: input.body,
        owner: input.owner ?? null,
        occurred_at: new Date().toISOString(),
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return commToNote(data as Record<string, unknown>);
  },
  update: async (id, patch) => {
    const upd: Record<string, unknown> = {};
    if (patch.body !== undefined) upd.summary = patch.body;
    if (patch.client_id !== undefined) upd.client_id = patch.client_id;
    if (patch.lead_id !== undefined) upd.lead_id = patch.lead_id;
    if (patch.owner !== undefined) upd.owner = patch.owner;
    const { data, error } = await osDb()
      .from("business_communications")
      .update(upd)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? commToNote(data as Record<string, unknown>) : null;
  },
  remove: async (id) => {
    const { error } = await osDb().from("business_communications").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  },
};

export const supabaseSource: CrmDataSource = {
  clients: tableStore<Client>("business_clients", { column: "name", ascending: true }),
  leads: tableStore<Lead>("leads", { column: "created_at" }),
  tasks: tableStore<Task>("business_tasks", { column: "due_date", ascending: true }),
  followUps: tableStore<FollowUp>("business_follow_ups", { column: "due_date", ascending: true }),
  proposals: tableStore<Proposal>("business_offers", { column: "created_at" }),
  payments: tableStore<Payment>("business_revenue", { column: "recorded_date" }),
  notes: notesStore,
  snapshot: async () => {
    const [clients, leads, tasks, followUps, proposals, payments, notes] = await Promise.all([
      supabaseSource.clients.list(),
      supabaseSource.leads.list(),
      supabaseSource.tasks.list(),
      supabaseSource.followUps.list(),
      supabaseSource.proposals.list(),
      supabaseSource.payments.list(),
      supabaseSource.notes.list(),
    ]);
    return { clients, leads, tasks, followUps, proposals, payments, notes };
  },
};
