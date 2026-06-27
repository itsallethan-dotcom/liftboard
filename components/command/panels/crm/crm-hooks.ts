"use client";

/**
 * Shared CRM section state: list fetch + a `run` wrapper that performs a mutation
 * then reloads, tracking saving/error. Keeps every CRM section component tiny.
 */
import { useState } from "react";
import { useHubFetch } from "@/components/command/ModuleHubShell";

export function useCrmSection<T>(seg: string) {
  const { data, loading, error, reload, setError } = useHubFetch<T[]>(`/api/crm/${seg}`);
  const [saving, setSaving] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setError(null);
    setSaving(true);
    try {
      await fn();
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setSaving(false);
    }
  };

  return { rows: data ?? [], loading, error, saving, run, reload };
}

/** YYYY-MM-DD from an ISO/date string, or "" */
export function toDateInput(value: string | null | undefined): string {
  return value ? String(value).slice(0, 10) : "";
}

/** True when a date is in the past (overdue). */
export function isOverdue(value: string | null | undefined): boolean {
  if (!value) return false;
  const t = new Date(value).getTime();
  return !Number.isNaN(t) && t < Date.now();
}
