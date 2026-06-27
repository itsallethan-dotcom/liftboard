// Phase 2 — AI Memory types (structured second-brain).

export const MEMORY_TYPES = [
  "fact",
  "preference",
  "goal",
  "event",
  "contact",
  "reference",
  "idea",
] as const;
export type MemoryType = (typeof MEMORY_TYPES)[number];

export const MEMORY_STATUSES = ["active", "archived"] as const;
export type MemoryStatus = (typeof MEMORY_STATUSES)[number];

export const MEMORY_SOURCES = ["manual", "chatgpt", "import", "dashboard"] as const;
export type MemorySource = (typeof MEMORY_SOURCES)[number];

/** Free-text, but these are the suggested/known relation types. */
export const RELATION_TYPES = [
  "related",
  "depends_on",
  "contradicts",
  "example_of",
  "parent",
] as const;
export type RelationType = string;

export type MemoryCategory = {
  id: string;
  key: string;
  label: string;
  parent_id: string | null;
  module_key: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type MemoryItem = {
  id: string;
  title: string;
  content: string | null;
  category_id: string | null;
  module_key: string | null;
  source: string;
  type: MemoryType;
  importance: number; // 1–5
  confidence: number; // 1–5
  tags: string[];
  pinned: boolean;
  status: MemoryStatus;
  created_at: string;
  updated_at: string;
};

export type MemoryRelationship = {
  id: string;
  from_item_id: string;
  to_item_id: string;
  relation_type: RelationType;
  created_at: string;
};

/** A relationship joined with the item on the other end (for display). */
export type RelatedMemory = {
  relationship: MemoryRelationship;
  item: MemoryItem;
};

export type MemoryDashboard = {
  items: MemoryItem[];
  categories: MemoryCategory[];
  stats: {
    total: number;
    pinned: number;
    highImportance: number; // importance >= 4
    categories: number;
  };
};

export type AddMemoryItemInput = {
  title: string;
  content?: string | null;
  category_id?: string | null;
  module_key?: string | null;
  source?: string;
  type?: MemoryType;
  importance?: number;
  confidence?: number;
  tags?: string[];
  pinned?: boolean;
};

export type UpdateMemoryItemInput = Partial<AddMemoryItemInput> & {
  status?: MemoryStatus;
};

export type AddMemoryCategoryInput = {
  key: string;
  label: string;
  parent_id?: string | null;
  module_key?: string | null;
  display_order?: number;
};

export type AddMemoryRelationshipInput = {
  from_item_id: string;
  to_item_id: string;
  relation_type?: RelationType;
};

export type MemoryItemFilter = {
  categoryId?: string | null;
  moduleKey?: string | null;
  query?: string | null;
  status?: MemoryStatus;
};
