import { osDb } from "@/lib/os/db";
import {
  MEMORY_TYPES,
  type AddMemoryCategoryInput,
  type AddMemoryItemInput,
  type AddMemoryRelationshipInput,
  type MemoryCategory,
  type MemoryDashboard,
  type MemoryItem,
  type MemoryItemFilter,
  type MemoryRelationship,
  type MemoryType,
  type RelatedMemory,
  type UpdateMemoryItemInput,
} from "@/types/memory";

/* ------------------------------- Categories ------------------------------- */

export async function fetchMemoryCategories(): Promise<MemoryCategory[]> {
  const { data, error } = await osDb()
    .from("memory_categories")
    .select("*")
    .order("display_order", { ascending: true })
    .order("label", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as MemoryCategory[];
}

export async function addMemoryCategory(input: AddMemoryCategoryInput): Promise<MemoryCategory> {
  const key = input.key.trim().toLowerCase();
  const label = input.label.trim();
  if (!key || !label) throw new Error("Category key and label are required.");

  const { data, error } = await osDb()
    .from("memory_categories")
    .insert({
      key,
      label,
      parent_id: input.parent_id ?? null,
      module_key: input.module_key ?? null,
      display_order: input.display_order ?? 0,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as MemoryCategory;
}

/* --------------------------------- Items ---------------------------------- */

function escapeLike(value: string): string {
  return value.replace(/[%_,()]/g, " ").trim();
}

export async function fetchMemoryItems(filter: MemoryItemFilter = {}): Promise<MemoryItem[]> {
  let query = osDb()
    .from("memory_items")
    .select("*")
    .order("pinned", { ascending: false })
    .order("importance", { ascending: false })
    .order("updated_at", { ascending: false });

  query = query.eq("status", filter.status ?? "active");
  if (filter.categoryId) query = query.eq("category_id", filter.categoryId);
  if (filter.moduleKey) query = query.eq("module_key", filter.moduleKey);

  const q = filter.query ? escapeLike(filter.query) : "";
  if (q.length >= 2) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
  }

  const { data, error } = await query.limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as MemoryItem[];
}

export async function fetchMemoryDashboard(): Promise<MemoryDashboard> {
  const [items, categories] = await Promise.all([
    fetchMemoryItems({ status: "active" }),
    fetchMemoryCategories(),
  ]);
  return {
    items,
    categories,
    stats: {
      total: items.length,
      pinned: items.filter((i) => i.pinned).length,
      highImportance: items.filter((i) => i.importance >= 4).length,
      categories: categories.length,
    },
  };
}

export async function addMemoryItem(input: AddMemoryItemInput): Promise<MemoryItem> {
  const title = input.title.trim();
  if (!title) throw new Error("Memory title is required.");

  const type = input.type ?? "fact";
  if (!MEMORY_TYPES.includes(type)) {
    throw new Error(`Invalid type. Allowed: ${MEMORY_TYPES.join(", ")}`);
  }
  const importance = clamp1to5(input.importance ?? 3);
  const confidence = clamp1to5(input.confidence ?? 3);

  const { data, error } = await osDb()
    .from("memory_items")
    .insert({
      title,
      content: input.content ?? null,
      category_id: input.category_id ?? null,
      module_key: input.module_key ?? null,
      source: input.source ?? "manual",
      type,
      importance,
      confidence,
      tags: input.tags ?? [],
      pinned: input.pinned ?? false,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as MemoryItem;
}

export async function updateMemoryItem(
  id: string,
  input: UpdateMemoryItemInput,
): Promise<MemoryItem> {
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.content !== undefined) patch.content = input.content;
  if (input.category_id !== undefined) patch.category_id = input.category_id;
  if (input.module_key !== undefined) patch.module_key = input.module_key;
  if (input.source !== undefined) patch.source = input.source;
  if (input.type !== undefined) {
    if (!MEMORY_TYPES.includes(input.type as MemoryType)) {
      throw new Error(`Invalid type. Allowed: ${MEMORY_TYPES.join(", ")}`);
    }
    patch.type = input.type;
  }
  if (input.importance !== undefined) patch.importance = clamp1to5(input.importance);
  if (input.confidence !== undefined) patch.confidence = clamp1to5(input.confidence);
  if (input.tags !== undefined) patch.tags = input.tags;
  if (input.pinned !== undefined) patch.pinned = input.pinned;
  if (input.status !== undefined) patch.status = input.status;

  const { data, error } = await osDb()
    .from("memory_items")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as MemoryItem;
}

/** Soft delete by default (archive); pass hard=true to remove permanently. */
export async function deleteMemoryItem(id: string, hard = false): Promise<void> {
  if (hard) {
    const { error } = await osDb().from("memory_items").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const { error } = await osDb()
    .from("memory_items")
    .update({ status: "archived" })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function searchMemory(rawQuery: string): Promise<MemoryItem[]> {
  return fetchMemoryItems({ query: rawQuery, status: "active" });
}

/* ----------------------------- Relationships ------------------------------ */

export async function fetchRelatedMemories(itemId: string): Promise<RelatedMemory[]> {
  const { data: rels, error } = await osDb()
    .from("memory_relationships")
    .select("*")
    .or(`from_item_id.eq.${itemId},to_item_id.eq.${itemId}`);
  if (error) throw new Error(error.message);

  const relationships = (rels ?? []) as MemoryRelationship[];
  if (relationships.length === 0) return [];

  const otherIds = Array.from(
    new Set(
      relationships.map((r) => (r.from_item_id === itemId ? r.to_item_id : r.from_item_id)),
    ),
  );

  const { data: items, error: itemsError } = await osDb()
    .from("memory_items")
    .select("*")
    .in("id", otherIds);
  if (itemsError) throw new Error(itemsError.message);

  const byId = new Map((items ?? []).map((i) => [(i as MemoryItem).id, i as MemoryItem]));
  return relationships.flatMap((relationship) => {
    const otherId =
      relationship.from_item_id === itemId ? relationship.to_item_id : relationship.from_item_id;
    const item = byId.get(otherId);
    return item ? [{ relationship, item }] : [];
  });
}

export async function addMemoryRelationship(
  input: AddMemoryRelationshipInput,
): Promise<MemoryRelationship> {
  if (!input.from_item_id || !input.to_item_id) {
    throw new Error("Both from_item_id and to_item_id are required.");
  }
  if (input.from_item_id === input.to_item_id) {
    throw new Error("A memory cannot be related to itself.");
  }
  const { data, error } = await osDb()
    .from("memory_relationships")
    .insert({
      from_item_id: input.from_item_id,
      to_item_id: input.to_item_id,
      relation_type: (input.relation_type ?? "related").trim() || "related",
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as MemoryRelationship;
}

export async function deleteMemoryRelationship(id: string): Promise<void> {
  const { error } = await osDb().from("memory_relationships").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* -------------------------------- Helpers --------------------------------- */

function clamp1to5(value: number): number {
  if (Number.isNaN(value)) return 3;
  return Math.max(1, Math.min(5, Math.round(value)));
}
