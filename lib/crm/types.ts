/**
 * Forgeonix CRM — data model (Phase 1).
 *
 * The CRM does NOT invent a parallel schema. It re-uses the canonical Forgeonix OS
 * entity types (the same shapes the existing Supabase tables use), so the demo
 * data layer and the future Supabase adapter stay byte-compatible. Only CRM-level
 * aggregates and the standalone Note entity are defined here.
 */
import type {
  Lead,
  BusinessClient,
  BusinessTask,
  BusinessFollowUp,
  BusinessOffer,
  BusinessRevenue,
} from "@/types/forgeonix-os";

/* --- Canonical entities, re-exported under CRM-friendly names --- */
export type { Lead };
export type Client = BusinessClient;
export type Task = BusinessTask;
export type FollowUp = BusinessFollowUp;
export type Proposal = BusinessOffer; // "offers/proposals"
export type Payment = BusinessRevenue; // "revenue/payments"

export type {
  LeadStatus,
  ClientStatus,
  ClientStage,
  TaskStatus,
  PriorityLevel,
  FollowUpStatus,
  OfferStatus as ProposalStatus,
  RevenueStatus as PaymentStatus,
} from "@/types/forgeonix-os";

export {
  LEAD_STATUSES,
  CLIENT_STATUSES,
  CLIENT_STAGES,
  TASK_STATUSES,
  PRIORITY_LEVELS,
  FOLLOW_UP_STATUSES,
  OFFER_STATUSES as PROPOSAL_STATUSES,
  REVENUE_STATUSES as PAYMENT_STATUSES,
} from "@/types/forgeonix-os";

/* --- CRM-specific: standalone notes attached to a client or lead --- */
export type CrmNote = {
  id: string;
  client_id: string | null;
  lead_id: string | null;
  body: string;
  owner: string | null;
  created_at: string;
  updated_at: string;
};

/* --- Dashboard read shapes (Phase 3 will consume these) --- */
export type CrmStats = {
  totalLeads: number;
  activeLeads: number;
  activeClients: number;
  openTasks: number;
  overdueTasks: number;
  followUpsDue: number;
  proposalsSent: number;
  proposalsPending: number;
  revenueReceived: number;
  revenuePending: number;
};

export type CrmActivity = {
  id: string;
  kind: "lead" | "client" | "task" | "follow_up" | "proposal" | "payment" | "note";
  label: string;
  at: string;
};

/** The full CRM dataset — what the data layer returns and the dashboard reads. */
export type CrmSnapshot = {
  clients: Client[];
  leads: Lead[];
  tasks: Task[];
  followUps: FollowUp[];
  proposals: Proposal[];
  payments: Payment[];
  notes: CrmNote[];
};

/** A record with the standard CRM bookkeeping fields. */
export type CrmRecord = { id: string; created_at: string; updated_at: string };

/** Input shapes derived from an entity: create omits bookkeeping, update is partial. */
export type CreateInput<T extends CrmRecord> = Omit<T, keyof CrmRecord>;
export type UpdateInput<T extends CrmRecord> = Partial<CreateInput<T>>;

/** The seven CRM collections. */
export type CrmEntityKey =
  | "clients"
  | "leads"
  | "tasks"
  | "followUps"
  | "proposals"
  | "payments"
  | "notes";

/** Single-call dashboard payload: aggregates + the snapshot they were computed from. */
export type CrmDashboard = {
  stats: CrmStats;
  recentActivity: CrmActivity[];
  snapshot: CrmSnapshot;
};
