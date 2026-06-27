import { requireOwnerApi } from "@/lib/auth/owner";
import { addBusinessTask, updateBusinessTask } from "@/lib/os/business";
import type { AddBusinessTaskInput, BusinessTask } from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as AddBusinessTaskInput;
    const task = await addBusinessTask(raw);
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
    const { id, ...patch } = (await request.json()) as { id?: string } & Record<string, unknown>;
    if (!id) throw new Error("id is required.");
    const task = await updateBusinessTask(
      id,
      patch as Partial<AddBusinessTaskInput & { status: BusinessTask["status"] }>,
    );
    return NextResponse.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update task.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
