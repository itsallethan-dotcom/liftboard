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
  // Phase 4 v2
  owner: string | null;
  converted_client_id: string | null;
  last_contacted_at: string | null;
  estimated_value: number | null;
  created_at: string;
  updated_at: string;
};

export const CLIENT_STATUSES = ["active", "prospect", "inactive", "archived"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const CLIENT_STAGES = ["active", "project_work", "revenue", "review", "archived"] as const;
export type ClientStage = (typeof CLIENT_STAGES)[number];

export type BusinessClient = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  status: ClientStatus;
  notes: string | null;
  // Phase 4 v2
  stage: ClientStage;
  lead_id: string | null;
  won_at: string | null;
  created_at: string;
  updated_at: string;
};

export const TASK_STATUSES = ["open", "in_progress", "done", "cancelled"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const PRIORITY_LEVELS = ["low", "medium", "high"] as const;
export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];

export type BusinessTask = {
  id: string;
  client_id: string | null;
  title: string;
  status: TaskStatus;
  priority: number;
  due_date: string | null;
  notes: string | null;
  // Phase 4 v2
  lead_id: string | null;
  owner: string | null;
  priority_level: PriorityLevel;
  created_at: string;
  updated_at: string;
};

export const FOLLOW_UP_STATUSES = ["pending", "done", "skipped"] as const;
export type FollowUpStatus = (typeof FOLLOW_UP_STATUSES)[number];

export const COMMUNICATION_CHANNELS = ["email", "call", "meeting", "message", "note", "other"] as const;
export type CommunicationChannel = (typeof COMMUNICATION_CHANNELS)[number];

export const COMMUNICATION_DIRECTIONS = ["inbound", "outbound"] as const;
export type CommunicationDirection = (typeof COMMUNICATION_DIRECTIONS)[number];

export type BusinessFollowUp = {
  id: string;
  client_id: string | null;
  lead_id: string | null;
  title: string;
  due_date: string | null;
  status: FollowUpStatus;
  notes: string | null;
  // Phase 4 v2
  owner: string | null;
  channel: CommunicationChannel | null;
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
  // Phase 4 v2
  lead_id: string | null;
  project_id: string | null;
  sent_at: string | null;
  accepted_at: string | null;
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
  // Phase 4 v2
  invoice_id: string | null;
  created_at: string;
  updated_at: string;
};

export const INVOICE_STATUSES = ["draft", "sent", "paid", "overdue", "void"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export type BusinessContact = {
  id: string;
  client_id: string | null;
  lead_id: string | null;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BusinessCommunication = {
  id: string;
  client_id: string | null;
  lead_id: string | null;
  contact_id: string | null;
  channel: CommunicationChannel;
  direction: CommunicationDirection | null;
  subject: string | null;
  summary: string | null;
  occurred_at: string | null;
  owner: string | null;
  created_at: string;
};

export type BusinessInvoice = {
  id: string;
  client_id: string | null;
  project_id: string | null;
  invoice_number: string | null;
  amount: number | null;
  currency: string;
  status: InvoiceStatus;
  issued_date: string | null;
  due_date: string | null;
  paid_date: string | null;
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

export const ASSET_KINDS = ["host", "vm", "lxc", "network_device", "storage", "other"] as const;
export type AssetKind = (typeof ASSET_KINDS)[number];

export type InfrastructureAsset = {
  id: string;
  name: string;
  asset_type: string | null;
  host: string | null;
  status: AssetStatus;
  notes: string | null;
  // Phase 3 v2 — hierarchy, addressing, VM specs.
  parent_id: string | null;
  kind: AssetKind;
  ip_address: string | null;
  mac_address: string | null;
  os: string | null;
  node_role: string | null;
  cpu_cores: number | null;
  ram_mb: number | null;
  disk_gb: number | null;
  created_at: string;
  updated_at: string;
};

export const SERVICE_STATUSES = ["online", "offline", "standby", "degraded"] as const;
export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export const CONTAINER_STATUSES = [
  "running",
  "stopped",
  "paused",
  "restarting",
  "exited",
] as const;
export type ContainerStatus = (typeof CONTAINER_STATUSES)[number];

export const BACKUP_HEALTHS = ["ok", "stale", "failing", "none"] as const;
export type BackupHealth = (typeof BACKUP_HEALTHS)[number];

export type InfrastructureService = {
  id: string;
  asset_id: string | null;
  name: string;
  url: string | null;
  status: ServiceStatus;
  notes: string | null;
  // Phase 3 v2 — addressing + container linkage.
  ip_address: string | null;
  port: number | null;
  internal_url: string | null;
  container_id: string | null;
  created_at: string;
  updated_at: string;
};

export type InfrastructureContainer = {
  id: string;
  asset_id: string | null;
  name: string;
  image: string | null;
  status: ContainerStatus;
  ports: string | null;
  volumes: string | null;
  compose_stack: string | null;
  ip_address: string | null;
  restart_policy: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type InfrastructureDependency = {
  id: string;
  from_type: string;
  from_id: string;
  to_type: string;
  to_id: string;
  dependency_type: string;
  notes: string | null;
  created_at: string;
};

export type InfrastructureBackup = {
  id: string;
  target_type: string | null;
  target_id: string | null;
  name: string;
  method: string | null;
  schedule: string | null;
  location: string | null;
  retention: string | null;
  last_run_at: string | null;
  health: BackupHealth;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type InfrastructureStatusEvent = {
  id: string;
  target_type: string;
  target_id: string;
  status: string;
  note: string | null;
  created_at: string;
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
  // Phase 4 v2
  value: number | null;
  start_date: string | null;
  completed_at: string | null;
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
  // Phase 3 v2
  containers: InfrastructureContainer[];
  dependencies: InfrastructureDependency[];
  backups: InfrastructureBackup[];
  statusEvents: InfrastructureStatusEvent[];
};

/** Derived nested topology: host -> children (vm/lxc), each with containers/services. */
export type TopologyNode = {
  asset: InfrastructureAsset;
  children: TopologyNode[];
  containers: InfrastructureContainer[];
  services: InfrastructureService[];
};

export type BusinessDashboard = {
  clients: BusinessClient[];
  tasks: BusinessTask[];
  followUps: BusinessFollowUp[];
  offers: BusinessOffer[];
  revenue: BusinessRevenue[];
  projects: OsProject[];
  // Phase 4 v2
  leads: Lead[];
  contacts: BusinessContact[];
  communications: BusinessCommunication[];
  invoices: BusinessInvoice[];
  monthlyRevenue: MonthlyRevenue[];
};

export type MonthlyRevenue = { month: string; total: number };

/** Unified lead→client pipeline board. */
export const PIPELINE_STAGES = [
  "lead",
  "contacted",
  "proposal",
  "client",
  "project_work",
  "revenue",
  "review",
  "archived",
] as const;
export type PipelineStageKey = (typeof PIPELINE_STAGES)[number];

export type PipelineCard = {
  id: string;
  kind: "lead" | "client";
  title: string;
  subtitle: string | null;
  stage: PipelineStageKey;
  value: number | null;
  status: string;
};

export type PipelineColumn = {
  key: PipelineStageKey;
  label: string;
  cards: PipelineCard[];
};

/* ----------------------------- Phase 4 inputs ----------------------------- */

export type AddBusinessContactInput = {
  name: string;
  client_id?: string | null;
  lead_id?: string | null;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
};
export type UpdateBusinessContactInput = Partial<AddBusinessContactInput>;

export type AddBusinessCommunicationInput = {
  channel?: CommunicationChannel;
  client_id?: string | null;
  lead_id?: string | null;
  contact_id?: string | null;
  direction?: CommunicationDirection | null;
  subject?: string | null;
  summary?: string | null;
  occurred_at?: string | null;
  owner?: string | null;
};

export type AddBusinessInvoiceInput = {
  client_id?: string | null;
  project_id?: string | null;
  invoice_number?: string | null;
  amount?: number | null;
  currency?: string;
  status?: InvoiceStatus;
  issued_date?: string | null;
  due_date?: string | null;
  paid_date?: string | null;
  notes?: string | null;
};
export type UpdateBusinessInvoiceInput = Partial<AddBusinessInvoiceInput>;

export type ConvertLeadResult = { client: BusinessClient; lead: Lead };

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
  ip_address?: string | null;
  port?: number | null;
  internal_url?: string | null;
  container_id?: string | null;
};
export type UpdateInfrastructureServiceInput = Partial<AddInfrastructureServiceInput>;

export type AddInfrastructureAssetInput = {
  name: string;
  kind?: AssetKind;
  parent_id?: string | null;
  asset_type?: string | null;
  status?: AssetStatus;
  ip_address?: string | null;
  mac_address?: string | null;
  os?: string | null;
  node_role?: string | null;
  cpu_cores?: number | null;
  ram_mb?: number | null;
  disk_gb?: number | null;
  notes?: string | null;
};
export type UpdateInfrastructureAssetInput = Partial<AddInfrastructureAssetInput>;

export type AddInfrastructureContainerInput = {
  name: string;
  asset_id?: string | null;
  image?: string | null;
  status?: ContainerStatus;
  ports?: string | null;
  volumes?: string | null;
  compose_stack?: string | null;
  ip_address?: string | null;
  restart_policy?: string | null;
  notes?: string | null;
};
export type UpdateInfrastructureContainerInput = Partial<AddInfrastructureContainerInput>;

export type AddInfrastructureDependencyInput = {
  from_type: string;
  from_id: string;
  to_type: string;
  to_id: string;
  dependency_type?: string;
  notes?: string | null;
};

export type AddInfrastructureBackupInput = {
  name: string;
  target_type?: string | null;
  target_id?: string | null;
  method?: string | null;
  schedule?: string | null;
  location?: string | null;
  retention?: string | null;
  last_run_at?: string | null;
  health?: BackupHealth;
  notes?: string | null;
};
export type UpdateInfrastructureBackupInput = Partial<AddInfrastructureBackupInput>;

export type AddInfrastructureIncidentInput = {
  title: string;
  service_id?: string | null;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  notes?: string | null;
};

export type AddInfrastructureUpgradeInput = {
  title: string;
  target_asset_id?: string | null;
  priority?: number;
  status?: UpgradeStatus;
  planned_date?: string | null;
  notes?: string | null;
};
export type UpdateInfrastructureUpgradeInput = Partial<AddInfrastructureUpgradeInput>;
