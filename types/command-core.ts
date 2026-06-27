// Phase 1 command-core types — module registry, notifications, logs, tasks, search.

export type ModuleState = "online" | "standby" | "dev" | "offline";
export type NotificationLevel = "info" | "success" | "warn" | "critical";
export type LogLevel = "system" | "info" | "success" | "warn" | "error";
export type CommandTaskState = "open" | "in_progress" | "done" | "cancelled";

export const NOTIFICATION_LEVELS: NotificationLevel[] = ["info", "success", "warn", "critical"];
export const COMMAND_TASK_STATES: CommandTaskState[] = ["open", "in_progress", "done", "cancelled"];

export type ModuleStatusRow = {
  id: string;
  key: string;
  label: string;
  subtitle: string | null;
  slot: string | null;
  status: ModuleState;
  enabled: boolean;
  href: string | null;
  display_order: number;
  load_pct: number | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NotificationRow = {
  id: string;
  title: string;
  body: string | null;
  level: NotificationLevel;
  module_key: string | null;
  href: string | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
};

export type CommandLogRow = {
  id: string;
  level: LogLevel;
  message: string;
  module_key: string | null;
  created_at: string;
};

export type CommandTaskRow = {
  id: string;
  title: string;
  status: CommandTaskState;
  module_key: string | null;
  priority: number;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AddNotificationInput = {
  title: string;
  body?: string | null;
  level?: NotificationLevel;
  module_key?: string | null;
  href?: string | null;
};

export type AddCommandLogInput = {
  message: string;
  level?: LogLevel;
  module_key?: string | null;
};

export type AddCommandTaskInput = {
  title: string;
  status?: CommandTaskState;
  module_key?: string | null;
  priority?: number;
  due_date?: string | null;
  notes?: string | null;
};

export type UpdateCommandTaskInput = {
  title?: string;
  status?: CommandTaskState;
  priority?: number;
  due_date?: string | null;
  notes?: string | null;
};

/** A single cross-module search hit. */
export type SearchResult = {
  id: string;
  /** Kind of record: lead, client, project, note, record, task, service. */
  type: string;
  /** Which OS card this result belongs to (module_status.key). */
  module_key: string;
  title: string;
  subtitle?: string | null;
  status?: string | null;
};

/** Lightweight real metrics for the HUD (no fabricated CPU/MEM/NET). */
export type CommandCoreMetrics = {
  onlineModules: number;
  totalModules: number;
  unreadNotifications: number;
  openTasks: number;
};
