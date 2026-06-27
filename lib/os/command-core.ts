import { osDb } from "@/lib/os/db";
import {
  COMMAND_TASK_STATES,
  NOTIFICATION_LEVELS,
  type AddCommandLogInput,
  type AddCommandTaskInput,
  type AddNotificationInput,
  type CommandCoreMetrics,
  type CommandLogRow,
  type CommandTaskRow,
  type ModuleStatusRow,
  type NotificationRow,
  type SearchResult,
  type UpdateCommandTaskInput,
} from "@/types/command-core";

/* ----------------------------- Module registry ---------------------------- */

export async function fetchModuleStatus(): Promise<ModuleStatusRow[]> {
  const { data, error } = await osDb()
    .from("module_status")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as ModuleStatusRow[];
}

/* ------------------------------ Notifications ----------------------------- */

export async function fetchNotifications(options?: {
  unreadOnly?: boolean;
  limit?: number;
}): Promise<NotificationRow[]> {
  let query = osDb()
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(options?.limit ?? 50);
  if (options?.unreadOnly) query = query.eq("read", false);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as NotificationRow[];
}

export async function createNotification(input: AddNotificationInput): Promise<NotificationRow> {
  const title = input.title.trim();
  if (!title) throw new Error("Notification title is required.");
  const level = input.level ?? "info";
  if (!NOTIFICATION_LEVELS.includes(level)) {
    throw new Error(`Invalid level. Allowed: ${NOTIFICATION_LEVELS.join(", ")}`);
  }

  const { data, error } = await osDb()
    .from("notifications")
    .insert({
      title,
      body: input.body ?? null,
      level,
      module_key: input.module_key ?? null,
      href: input.href ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as NotificationRow;
}

export async function markNotificationRead(id: string, read = true): Promise<NotificationRow> {
  const { data, error } = await osDb()
    .from("notifications")
    .update({ read, read_at: read ? new Date().toISOString() : null })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as NotificationRow;
}

export async function markAllNotificationsRead(): Promise<void> {
  const { error } = await osDb()
    .from("notifications")
    .update({ read: true, read_at: new Date().toISOString() })
    .eq("read", false);
  if (error) throw new Error(error.message);
}

/* -------------------------------- Logs feed ------------------------------- */

export async function fetchCommandLogs(limit = 20): Promise<CommandLogRow[]> {
  const { data, error } = await osDb()
    .from("command_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  // Return chronological (oldest first) for terminal display.
  return ((data ?? []) as CommandLogRow[]).reverse();
}

export async function appendCommandLog(input: AddCommandLogInput): Promise<CommandLogRow> {
  const message = input.message.trim();
  if (!message) throw new Error("Log message is required.");
  const { data, error } = await osDb()
    .from("command_logs")
    .insert({ message, level: input.level ?? "info", module_key: input.module_key ?? null })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as CommandLogRow;
}

/* ------------------------------ Command tasks ----------------------------- */

export async function fetchCommandTasks(options?: {
  includeDone?: boolean;
}): Promise<CommandTaskRow[]> {
  let query = osDb()
    .from("command_tasks")
    .select("*")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });
  if (!options?.includeDone) query = query.in("status", ["open", "in_progress"]);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as CommandTaskRow[];
}

export async function createCommandTask(input: AddCommandTaskInput): Promise<CommandTaskRow> {
  const title = input.title.trim();
  if (!title) throw new Error("Task title is required.");
  const status = input.status ?? "open";
  if (!COMMAND_TASK_STATES.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${COMMAND_TASK_STATES.join(", ")}`);
  }

  const { data, error } = await osDb()
    .from("command_tasks")
    .insert({
      title,
      status,
      module_key: input.module_key ?? null,
      priority: input.priority ?? 0,
      due_date: input.due_date ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as CommandTaskRow;
}

export async function updateCommandTask(
  id: string,
  input: UpdateCommandTaskInput,
): Promise<CommandTaskRow> {
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.status !== undefined) patch.status = input.status;
  if (input.priority !== undefined) patch.priority = input.priority;
  if (input.due_date !== undefined) patch.due_date = input.due_date;
  if (input.notes !== undefined) patch.notes = input.notes;

  const { data, error } = await osDb()
    .from("command_tasks")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as CommandTaskRow;
}

/* --------------------------------- Metrics -------------------------------- */

export async function fetchCommandCoreMetrics(): Promise<CommandCoreMetrics> {
  const [modules, unread, openTasks] = await Promise.all([
    fetchModuleStatus(),
    fetchNotifications({ unreadOnly: true, limit: 100 }),
    fetchCommandTasks(),
  ]);
  return {
    onlineModules: modules.filter((m) => m.status === "online").length,
    totalModules: modules.length,
    unreadNotifications: unread.length,
    openTasks: openTasks.length,
  };
}

/* ------------------------------ Cross search ------------------------------ */

type SearchTable = {
  table: string;
  type: string;
  module_key: string;
  columns: string[]; // columns to ilike against
  titleCol: string;
  subtitleCol?: string;
  statusCol?: string;
};

const SEARCH_TABLES: SearchTable[] = [
  { table: "leads", type: "lead", module_key: "business", columns: ["name", "company", "notes"], titleCol: "name", subtitleCol: "company", statusCol: "status" },
  { table: "business_clients", type: "client", module_key: "business", columns: ["name", "company", "notes"], titleCol: "name", subtitleCol: "company", statusCol: "status" },
  { table: "os_projects", type: "project", module_key: "projects", columns: ["name", "description", "stack"], titleCol: "name", subtitleCol: "stack", statusCol: "status" },
  { table: "os_notes", type: "note", module_key: "ai-memory", columns: ["title", "body", "tags"], titleCol: "title", subtitleCol: "tags", statusCol: "note_type" },
  { table: "memory_items", type: "memory", module_key: "ai-memory", columns: ["title", "content"], titleCol: "title", subtitleCol: "content", statusCol: "type" },
  { table: "os_records", type: "record", module_key: "ai-memory", columns: ["title", "description", "project"], titleCol: "title", subtitleCol: "project", statusCol: "record_type" },
  { table: "command_tasks", type: "task", module_key: "infrastructure", columns: ["title", "notes"], titleCol: "title", subtitleCol: "notes", statusCol: "status" },
  { table: "infrastructure_services", type: "service", module_key: "infrastructure", columns: ["name", "notes"], titleCol: "name", subtitleCol: "notes", statusCol: "status" },
];

export async function searchOs(rawQuery: string, perTable = 5): Promise<SearchResult[]> {
  const q = rawQuery.trim();
  if (q.length < 2) return [];
  const pattern = `%${q.replace(/[%_]/g, "")}%`;
  const db = osDb();

  const results = await Promise.all(
    SEARCH_TABLES.map(async (cfg) => {
      const orFilter = cfg.columns.map((c) => `${c}.ilike.${pattern}`).join(",");
      const { data, error } = await db
        .from(cfg.table)
        .select("*")
        .or(orFilter)
        .limit(perTable);
      if (error) return [] as SearchResult[];
      return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
        id: String(row.id),
        type: cfg.type,
        module_key: cfg.module_key,
        title: String(row[cfg.titleCol] ?? "Untitled"),
        subtitle: cfg.subtitleCol ? (row[cfg.subtitleCol] as string | null) : null,
        status: cfg.statusCol ? (row[cfg.statusCol] as string | null) : null,
      }));
    }),
  );

  return results.flat();
}
