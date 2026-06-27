import { requireOwnerApi } from "@/lib/auth/owner";
import { addMemoryItem, fetchMemoryDashboard, fetchMemoryItems } from "@/lib/os/memory";
import {
  MEMORY_TYPES,
  type AddMemoryItemInput,
  type MemoryStatus,
  type MemoryType,
} from "@/types/memory";
import { NextResponse } from "next/server";

function parseType(value: unknown): MemoryType | undefined {
  return typeof value === "string" && MEMORY_TYPES.includes(value as MemoryType)
    ? (value as MemoryType)
    : undefined;
}

function parseTags(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return value.map((t) => String(t)).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return undefined;
}

export async function GET(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const moduleKey = searchParams.get("module");
    const query = searchParams.get("q");
    const status = (searchParams.get("status") as MemoryStatus | null) ?? undefined;

    // No filters → return the full dashboard (items + categories + stats).
    if (!category && !moduleKey && !query && !status) {
      const dashboard = await fetchMemoryDashboard();
      return NextResponse.json(dashboard);
    }

    const items = await fetchMemoryItems({
      categoryId: category,
      moduleKey,
      query,
      status,
    });
    return NextResponse.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load memory.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as Record<string, unknown>;
    const input: AddMemoryItemInput = {
      title: String(raw.title ?? ""),
      content: raw.content != null ? String(raw.content) : null,
      category_id: raw.category_id != null ? String(raw.category_id) : null,
      module_key: raw.module_key != null ? String(raw.module_key) : null,
      source: raw.source != null ? String(raw.source) : "manual",
      type: parseType(raw.type),
      importance: typeof raw.importance === "number" ? raw.importance : undefined,
      confidence: typeof raw.confidence === "number" ? raw.confidence : undefined,
      tags: parseTags(raw.tags),
      pinned: typeof raw.pinned === "boolean" ? raw.pinned : undefined,
    };
    const item = await addMemoryItem(input);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create memory.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
