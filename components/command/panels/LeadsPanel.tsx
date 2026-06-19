"use client";

import {
  HubBtn,
  HubField,
  HubForm,
  HubListItem,
  HubMuted,
  HubSection,
  HubStats,
  ModuleHubShell,
  useHubFetch,
} from "@/components/command/ModuleHubShell";
import type { LeadsDashboard } from "@/types/forgeonix-os";
import { useState } from "react";

type LeadsPanelProps = { onClose?: () => void };

export function LeadsPanel({ onClose }: LeadsPanelProps) {
  const { data, loading, error, reload, setError } = useHubFetch<LeadsDashboard>("/api/os/leads");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [followUp, setFollowUp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/os/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company: company || null,
          follow_up_date: followUp || null,
          source: "manual",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed.");
      setFormOpen(false);
      setName("");
      setCompany("");
      setFollowUp("");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModuleHubShell
      label="// LEAD GENERATION"
      title="Pipeline"
      onClose={onClose}
      loading={loading}
      error={error}
    >
      {data ? (
        <>
          <HubSection label="Pipeline">
            <HubStats
              items={[
                { label: "Active", value: String(data.stats.total) },
                {
                  label: "Follow-ups",
                  value: String(data.stats.followUpsDue),
                  warn: data.stats.followUpsDue > 0,
                },
                { label: "Qualified", value: String(data.stats.qualified) },
              ]}
            />
            {data.leads.length === 0 ? (
              <HubMuted>No leads yet — add one below.</HubMuted>
            ) : (
              data.leads.slice(0, 8).map((lead) => (
                <HubListItem
                  key={lead.id}
                  title={lead.name}
                  meta={lead.company ?? lead.email ?? undefined}
                  badge={lead.status}
                />
              ))
            )}
            <HubBtn onClick={() => setFormOpen(!formOpen)}>
              {formOpen ? "Cancel" : "+ Add lead"}
            </HubBtn>
            {formOpen ? (
              <HubForm title="New lead" onSubmit={handleSubmit} saving={saving}>
                <HubField label="Name">
                  <input required value={name} onChange={(e) => setName(e.target.value)} />
                </HubField>
                <HubField label="Company">
                  <input value={company} onChange={(e) => setCompany(e.target.value)} />
                </HubField>
                <HubField label="Follow-up date">
                  <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
                </HubField>
              </HubForm>
            ) : null}
          </HubSection>
        </>
      ) : null}
    </ModuleHubShell>
  );
}
