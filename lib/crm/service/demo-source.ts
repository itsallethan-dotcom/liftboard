/**
 * Forgeonix CRM — demo data source (Phase 2).
 * Wraps the in-memory demo store (Phase 1) in the async CrmDataSource contract.
 */
import { crmDemo, crmDemoSnapshot } from "@/lib/crm/demo-store";
import type { Collection } from "@/lib/crm/demo-store";
import type { CrmRecord } from "@/lib/crm/types";
import type { CrmDataSource, EntityStore } from "@/lib/crm/service/source";

/** Adapt a synchronous in-memory collection to the async EntityStore contract. */
function asyncify<T extends CrmRecord>(c: Collection<T>): EntityStore<T> {
  return {
    list: async () => c.list(),
    get: async (id) => c.get(id),
    create: async (input) => c.create(input),
    update: async (id, patch) => c.update(id, patch),
    remove: async (id) => c.remove(id),
  };
}

export const demoSource: CrmDataSource = {
  clients: asyncify(crmDemo.clients),
  leads: asyncify(crmDemo.leads),
  tasks: asyncify(crmDemo.tasks),
  followUps: asyncify(crmDemo.followUps),
  proposals: asyncify(crmDemo.proposals),
  payments: asyncify(crmDemo.payments),
  notes: asyncify(crmDemo.notes),
  snapshot: async () => crmDemoSnapshot(),
};
