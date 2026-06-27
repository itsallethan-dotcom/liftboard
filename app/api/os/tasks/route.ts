import { requireOwnerApi } from "@/lib/auth/owner";
import {
  createCommandTask,
  fetchCommandTasks,
  updateCommandTask,
} from "@/lib/os/command-core";
import {
  COMMAND_TASK_STATES,
  type AddCommandTaskInput,
  type CommandTaskState,
  type UpdateCommandTaskInput,
} from "@/types/command-core";
import { NextResponse } from "next/server";

function parseStatus(value: unknown): CommandTaskState | undefined {
  return typeof value === "string" && COMMAND_TASK_STATES.includes(value as CommandTaskState)
    ? (value as CommandTaskState)
    : undefined;
}

export async function GET(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const includeDone = searchParams.get("includeDone") === "true";
    const tasks = await fetchCommandTasks({ includeDone });
    return NextResponse.json({ tasks });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load tasks.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as Record<string, unknown>;
    const input: AddCommandTaskInput = {
      title: String(raw.title ?? ""),
      status: parseStatus(raw.status),
      module_key: raw.module_key != null ? String(raw.module_key) : null,
      priority: typeof raw.priority === "number" ? raw.priority : 0,
      due_date: raw.due_date != null ? String(raw.due_date) : null,
      notes: raw.notes != null ? String(raw.notes) : null,
    };
    const task = await createCommandTask(input);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create task.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as Record<string, unknown>;
    const id = raw.id != null ? String(raw.id) : "";
    if (!id) throw new Error("Task id is required.");
    const patch: UpdateCommandTaskInput = {};
    if (raw.title !== undefined) patch.title = String(raw.title);
    if (raw.status !== undefined) patch.status = parseStatus(raw.status);
    if (raw.priority !== undefined && typeof raw.priority === "number") patch.priority = raw.priority;
    if (raw.due_date !== undefined) patch.due_date = raw.due_date != null ? String(raw.due_date) : null;
    if (raw.notes !== undefined) patch.notes = raw.notes != null ? String(raw.notes) : null;
    const task = await updateCommandTask(id, patch);
    return NextResponse.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update task.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
