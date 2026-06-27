import { requireOwnerApi } from "@/lib/auth/owner";
import {
  addMemoryRelationship,
  deleteMemoryRelationship,
  fetchRelatedMemories,
} from "@/lib/os/memory";
import type { AddMemoryRelationshipInput } from "@/types/memory";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    if (!itemId) throw new Error("itemId is required.");
    const related = await fetchRelatedMemories(itemId);
    return NextResponse.json({ related });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load relationships.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as Record<string, unknown>;
    const input: AddMemoryRelationshipInput = {
      from_item_id: String(raw.from_item_id ?? ""),
      to_item_id: String(raw.to_item_id ?? ""),
      relation_type: raw.relation_type != null ? String(raw.relation_type) : undefined,
    };
    const relationship = await addMemoryRelationship(input);
    return NextResponse.json(relationship, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create relationship.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("id is required.");
    await deleteMemoryRelationship(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete relationship.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
