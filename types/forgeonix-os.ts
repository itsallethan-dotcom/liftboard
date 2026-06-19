/** Shared Forgeonix OS memory types — dashboard reads, agents write. */

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
  "archived",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type Lead = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: LeadStatus;
  notes: string | null;
  follow_up_date: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
};

export const CLIENT_STATUSES = ["active", "prospect", "inactive", "archived"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export type BusinessClient = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  status: ClientStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const TASK_STATUSES = ["open", "in_progress", "done", "cancelled"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type BusinessTask = {
  id: string;
  client_id: string | null;
  title: string;
  status: TaskStatus;
  priority: number;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const FOLLOW_UP_STATUSES = ["pending", "done", "skipped"] as const;
export type FollowUpStatus = (typeof FOLLOW_UP_STATUSES)[number];

export type BusinessFollowUp = {
  id: string;
  client_id: string | null;
  lead_id: string | null;
  title: string;
  due_date: string | null;
  status: FollowUpStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const OFFER_STATUSES = ["draft", "sent", "accepted", "declined", "expired"] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];

export type BusinessOffer = {
  id: string;
  client_id: string | null;
  title: string;
  amount: number | null;
  currency: string;
  status: OfferStatus;
  valid_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const REVENUE_STATUSES = ["pending", "received", "cancelled"] as const;
export type RevenueStatus = (typeof REVENUE_STATUSES)[number];

export type BusinessRevenue = {
  id: string;
  client_id: string | null;
  label: string;
  amount: number;
  currency: string;
  status: RevenueStatus;
  recorded_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const ASSET_STATUSES = [
  "online",
  "offline",
  "standby",
  "planned",
  "decommissioned",
] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export type InfrastructureAsset = {
  id: string;
  name: string;
  asset_type: string | null;
  host: string | null;
  status: AssetStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const SERVICE_STATUSES = ["online", "offline", "standby", "degraded"] as const;
export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export type InfrastructureService = {
  id: string;
  asset_id: string | null;
  name: string;
  url: string | null;
  status: ServiceStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const INCIDENT_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export type IncidentSeverity = (typeof INCIDENT_SEVERITIES)[number];

export const INCIDENT_STATUSES = ["open", "investigating", "resolved", "closed"] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export type InfrastructureIncident = {
  id: string;
  service_id: string | null;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  opened_at: string | null;
  resolved_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const UPGRADE_STATUSES = [
  "planned",
  "scheduled",
  "in_progress",
  "done",
  "cancelled",
] as const;
export type UpgradeStatus = (typeof UPGRADE_STATUSES)[number];

export type InfrastructureUpgrade = {
  id: string;
  title: string;
  target_asset_id: string | null;
  priority: number;
  status: UpgradeStatus;
  planned_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const PROJECT_STATUSES = [
  "live",
  "in_development",
  "active",
  "completed",
  "archived",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type OsProject = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  status: ProjectStatus;
  stack: string | null;
  url: string | null;
  client_id: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export const NOTE_TYPES = ["note", "documentation"] as const;
export type NoteType = (typeof NOTE_TYPES)[number];

export type OsNote = {
  id: string;
  title: string;
  body: string | null;
  note_type: NoteType;
  tags: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
};

export const RECORD_TYPES = ["milestone", "win", "build", "incident", "other"] as const;
export type RecordType = (typeof RECORD_TYPES)[number];

export type OsRecord = {
  id: string;
  title: string;
  description: string | null;
  record_type: RecordType;
  project: string | null;
  category: string | null;
  record_date: string | null;
  created_at: string;
  updated_at: string;
};

export type InfrastructureDashboard = {
  assets: InfrastructureAsset[];
  services: InfrastructureService[];
  incidents: InfrastructureIncident[];
  upgrades: InfrastructureUpgrade[];
};

export type BusinessDashboard = {
  clients: BusinessClient[];
  tasks: BusinessTask[];
  followUps: BusinessFollowUp[];
  offers: BusinessOffer[];
  revenue: BusinessRevenue[];
  projects: OsProject[];
};

export type LeadsDashboard = {
  leads: Lead[];
  stats: { total: number; followUpsDue: number; qualified: number };
};

export type NotesDashboard = {
  notes: OsNote[];
};

export type RecordsDashboard = {
  records: OsRecord[];
};

export type AddLeadInput = {
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  status?: LeadStatus;
  notes?: string | null;
  follow_up_date?: string | null;
  priority?: number;
};

export type UpdateLeadInput = Partial<AddLeadInput>;

export type AddOsProjectInput = {
  name: string;
  slug?: string | null;
  description?: string | null;
  status?: ProjectStatus;
  stack?: string | null;
  url?: string | null;
  client_id?: string | null;
  display_order?: number;
};

export type UpdateOsProjectInput = Partial<AddOsProjectInput>;

export type AddOsNoteInput = {
  title: string;
  body?: string | null;
  note_type?: NoteType;
  tags?: string | null;
  project_id?: string | null;
};

export type UpdateOsNoteInput = Partial<AddOsNoteInput>;

export type AddOsRecordInput = {
  title: string;
  description?: string | null;
  record_type?: RecordType;
  project?: string | null;
  category?: string | null;
  record_date?: string | null;
};

export type UpdateOsRecordInput = Partial<AddOsRecordInput>;

export type AddBusinessClientInput = {
  name: string;
  company?: string | null;
  email?: string | null;
  status?: ClientStatus;
  notes?: string | null;
};

export type AddBusinessTaskInput = {
  title: string;
  client_id?: string | null;
  status?: TaskStatus;
  priority?: number;
  due_date?: string | null;
  notes?: string | null;
};

export type AddInfrastructureServiceInput = {
  name: string;
  asset_id?: string | null;
  url?: string | null;
  status?: ServiceStatus;
  notes?: string | null;
};
