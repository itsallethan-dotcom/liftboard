import { requireOwnerApi } from "@/lib/auth/owner";
import { deleteMemoryItem, updateMemoryItem } from "@/lib/os/memory";
import {
  MEMORY_TYPES,
  type MemoryStatus,
  type MemoryType,
  type UpdateMemoryItemInput,
} from "@/types/memory";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

function parseType(value: unknown): MemoryType | undefined {
  return typeof value === "string" && MEMORY_TYPES.includes(value as MemoryType)
    ? (value as MemoryType)
    : undefined;
}

export async function PATCH(request: Request, ctx: RouteContext) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const raw = (await request.json()) as Record<string, unknown>;
    const patch: UpdateMemoryItemInput = {};
    if (raw.title !== undefined) patch.title = String(raw.title);
    if (raw.content !== undefined) patch.content = raw.content != null ? String(raw.content) : null;
    if (raw.category_id !== undefined)
      patch.category_id = raw.category_id != null ? String(raw.category_id) : null;
    if (raw.module_key !== undefined)
      patch.module_key = raw.module_key != null ? String(raw.module_key) : null;
    if (raw.source !== undefined) patch.source = String(raw.source);
    if (raw.type !== undefined) patch.type = parseType(raw.type);
    if (raw.importance !== undefined && typeof raw.importance === "number")
      patch.importance = raw.importance;
    if (raw.confidence !== undefined && typeof raw.confidence === "number")
      patch.confidence = raw.confidence;
    if (raw.tags !== undefined && Array.isArray(raw.tags))
      patch.tags = raw.tags.map((t) => String(t));
    if (raw.pinned !== undefined && typeof raw.pinned === "boolean") patch.pinned = raw.pinned;
    if (raw.status !== undefined) patch.status = raw.status as MemoryStatus;

    const item = await updateMemoryItem(id, patch);
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update memory.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, ctx: RouteContext) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const { searchParams } = new URL(request.url);
    const hard = searchParams.get("hard") === "true";
    await deleteMemoryItem(id, hard);
    return NextResponse.json({ ok: true, hard });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete memory.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
