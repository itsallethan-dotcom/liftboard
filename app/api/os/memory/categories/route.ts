import { requireOwnerApi } from "@/lib/auth/owner";
import { addMemoryCategory, fetchMemoryCategories } from "@/lib/os/memory";
import type { AddMemoryCategoryInput } from "@/types/memory";
import { NextResponse } from "next/server";

export async function GET() {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const categories = await fetchMemoryCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load categories.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as Record<string, unknown>;
    const input: AddMemoryCategoryInput = {
      key: String(raw.key ?? ""),
      label: String(raw.label ?? ""),
      parent_id: raw.parent_id != null ? String(raw.parent_id) : null,
      module_key: raw.module_key != null ? String(raw.module_key) : null,
      display_order: typeof raw.display_order === "number" ? raw.display_order : 0,
    };
    const category = await addMemoryCategory(input);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create category.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
