"use client";

/** CRM Phase 5 — lead pipeline: grouped by stage, add lead, move through pipeline. */
import { useState } from "react";
import {
  HubField,
  HubForm,
  HubListItem,
  HubMuted,
  HubSection,
} from "@/components/command/ModuleHubShell";
import { toDateInput, useCrmSection } from "@/components/command/panels/crm/crm-hooks";
import { crmApi } from "@/lib/crm/client";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/lib/crm/types";

/** Friendly pipeline labels over the canonical statuses (no schema change). */
const LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Discovery",
  proposal: "Proposal Sent",
  won: "Won",
  lost: "Lost",
  archived: "Archived",
};
/** Pipeline order shown as columns; won/lost/archived shown compactly below. */
const PIPELINE: LeadStatus[] = ["new", "contacted", "qualified", "proposal"];
const CLOSED: LeadStatus[] = ["won", "lost", "archived"];

const blank = { name: "", company: "", email: "", status: "new" as LeadStatus, follow_up_date: "" };

export function CrmLeads() {
  const { rows, loading, error, saving, run } = useCrmSection<Lead>("leads");
  const [form, setForm] = useState(blank);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    void run(async () => {
      await crmApi.create("leads", {
        name: form.name.trim(),
        company: form.company || null,
        email: form.email || null,
        status: form.status,
        follow_up_date: form.follow_up_date || null,
        source: "manual",
        priority: 1,
      });
      setForm(blank);
    });
  };

  const setStatus = (lead: Lead, status: LeadStatus) =>
    run(async () => void (await crmApi.update("leads", lead.id, { status })));

  if (loading) return <HubMuted>Loading pipeline…</HubMuted>;

  const byStatus = (s: LeadStatus) => rows.filter((l) => l.status === s);

  return (
    <>
      {error ? <p className="command-hub-panel__error">{error}</p> : null}

      {PIPELINE.map((stage) => {
        const leads = byStatus(stage);
        return (
          <HubSection key={stage} label={`${LABEL[stage]} · ${leads.length}`}>
            {leads.length === 0 ? <HubMuted>—</HubMuted> : null}
            {leads.map((l) => (
              <div key={l.id} style={{ marginBottom: 6 }}>
                <HubListItem
                  title={l.name}
                  meta={[l.company, l.estimated_value ? `$${l.estimated_value}` : null]
                    .filter(Boolean)
                    .join(" · ")}
                  badge={l.follow_up_date ? `f/u ${toDateInput(l.follow_up_date)}` : undefined}
                />
                <select
                  value={l.status}
                  disabled={saving}
                  onChange={(e) => setStatus(l, e.target.value as LeadStatus)}
                  style={{ marginTop: 4, width: "100%" }}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </HubSection>
        );
      })}

      <HubSection label="Closed">
        {CLOSED.flatMap((s) => byStatus(s)).length === 0 ? <HubMuted>—</HubMuted> : null}
        {CLOSED.flatMap((s) => byStatus(s)).map((l) => (
          <HubListItem key={l.id} title={l.name} meta={l.company ?? "—"} badge={LABEL[l.status]} />
        ))}
      </HubSection>

      <HubForm title="Add Lead" onSubmit={add} saving={saving} submitLabel="Add Lead">
        <HubField label="Name">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </HubField>
        <HubField label="Company">
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </HubField>
        <HubField label="Email">
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </HubField>
        <HubField label="Stage">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {LABEL[s]}
              </option>
            ))}
          </select>
        </HubField>
        <HubField label="Next follow-up">
          <input
            type="date"
            value={form.follow_up_date}
            onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })}
          />
        </HubField>
      </HubForm>
    </>
  );
}
