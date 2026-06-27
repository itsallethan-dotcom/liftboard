/**
 * Forgeonix CRM — service entry point (Phase 2).
 * Picks the live data source from the demo-mode flag. Callers (queries/mutations)
 * never know or care which source they got.
 */
import { isDemoMode } from "@/lib/crm/config";
import { demoSource } from "@/lib/crm/service/demo-source";
import { supabaseSource } from "@/lib/crm/service/supabase-source";
import type { CrmDataSource, EntityStore } from "@/lib/crm/service/source";
import type { CrmEntityKey, CrmRecord } from "@/lib/crm/types";

export function crmSource(): CrmDataSource {
  return isDemoMode() ? demoSource : supabaseSource;
}

/** Generic, key-addressable access to a single entity store. */
export function storeFor(key: CrmEntityKey): EntityStore<CrmRecord> {
  return crmSource()[key] as unknown as EntityStore<CrmRecord>;
}

export type { CrmDataSource, EntityStore } from "@/lib/crm/service/source";
