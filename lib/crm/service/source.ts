/**
 * Forgeonix CRM — the data-source contract (Phase 2).
 *
 * Both the demo source and the Supabase source implement this exact interface,
 * so the queries/mutations layer (and therefore the UI) is identical regardless
 * of where data lives.
 */
import type {
  Client,
  CreateInput,
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

export type EntityStore<T extends CrmRecord> = {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(input: CreateInput<T>): Promise<T>;
  update(id: string, patch: UpdateInput<T>): Promise<T | null>;
  remove(id: string): Promise<boolean>;
};

export type CrmDataSource = {
  clients: EntityStore<Client>;
  leads: EntityStore<Lead>;
  tasks: EntityStore<Task>;
  followUps: EntityStore<FollowUp>;
  proposals: EntityStore<Proposal>;
  payments: EntityStore<Payment>;
  notes: EntityStore<CrmNote>;
  /** One batched read of the whole dataset (used by the dashboard). */
  snapshot(): Promise<CrmSnapshot>;
};
