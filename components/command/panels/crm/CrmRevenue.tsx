"use client";

/** CRM Phase 7 — revenue + proposals: amounts, statuses, sent/accepted/paid dates. */
import { useState } from "react";
import {
  HubField,
  HubForm,
  HubListItem,
  HubMuted,
  HubSection,
  HubStats,
  useHubFetch,
} from "@/components/command/ModuleHubShell";
import { toDateInput, useCrmSection } from "@/components/command/panels/crm/crm-hooks";
import { crmApi } from "@/lib/crm/client";
import {
  PAYMENT_STATUSES,
  PROPOSAL_STATUSES,
  type Client,
  type Payment,
  type PaymentStatus,
  type Proposal,
  type ProposalStatus,
} from "@/lib/crm/types";

function money(n: number | null | undefined): string {
  if (n == null) return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
      Number(n),
    );
  } catch {
    return `$${Math.round(Number(n))}`;
  }
}

export function CrmRevenue() {
  const proposals = useCrmSection<Proposal>("proposals");
  const payments = useCrmSection<Payment>("revenue");
  const { data: clients } = useHubFetch<Client[]>("/api/crm/clients");

  const clientName = (id: string | null) => (id ? (clients ?? []).find((c) => c.id === id)?.name ?? "Client" : "—");

  const [prop, setProp] = useState({ title: "", amount: "", client: "" });
  const [pay, setPay] = useState({ label: "", amount: "", client: "", recorded_date: "" });

  const addProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prop.title.trim()) return;
    void proposals.run(async () => {
      await crmApi.create("proposals", {
        title: prop.title.trim(),
        amount: prop.amount ? Number(prop.amount) : null,
        currency: "USD",
        status: "draft",
        client_id: prop.client || null,
        lead_id: null,
        project_id: null,
        valid_until: null,
        sent_at: null,
        accepted_at: null,
        notes: null,
      });
      setProp({ title: "", amount: "", client: "" });
    });
  };

  const setProposalStatus = (p: Proposal, status: ProposalStatus) =>
    proposals.run(async () => {
      const patch: Record<string, unknown> = { status };
      if (status === "sent" && !p.sent_at) patch.sent_at = new Date().toISOString();
      if (status === "accepted" && !p.accepted_at) patch.accepted_at = new Date().toISOString();
      await crmApi.update("proposals", p.id, patch);
    });

  const addPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pay.label.trim() || !pay.amount) return;
    void payments.run(async () => {
      await crmApi.create("revenue", {
        label: pay.label.trim(),
        amount: Number(pay.amount),
        currency: "USD",
        status: "received",
        client_id: pay.client || null,
        invoice_id: null,
        recorded_date: pay.recorded_date || new Date().toISOString().slice(0, 10),
        notes: null,
      });
      setPay({ label: "", amount: "", client: "", recorded_date: "" });
    });
  };

  const setPaymentStatus = (p: Payment, status: PaymentStatus) =>
    payments.run(async () => void (await crmApi.update("revenue", p.id, { status })));

  if (proposals.loading) return <HubMuted>Loading revenue…</HubMuted>;

  const received = payments.rows.filter((p) => p.status === "received").reduce((s, p) => s + Number(p.amount || 0), 0);
  const pending = payments.rows.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount || 0), 0);
  const proposalValue = proposals.rows
    .filter((p) => p.status === "sent")
    .reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <>
      {proposals.error ? <p className="command-hub-panel__error">{proposals.error}</p> : null}
      {payments.error ? <p className="command-hub-panel__error">{payments.error}</p> : null}

      <HubSection label="Cash Summary">
        <HubStats
          items={[
            { label: "Received", value: money(received) },
            { label: "Pending", value: money(pending), warn: pending > 0 },
            { label: "In Proposals", value: money(proposalValue) },
          ]}
        />
      </HubSection>

      <HubSection label={`Proposals · ${proposals.rows.length}`}>
        {proposals.rows.length === 0 ? <HubMuted>No proposals.</HubMuted> : null}
        {proposals.rows.map((p) => (
          <div key={p.id} style={{ marginBottom: 6 }}>
            <HubListItem
              title={p.title}
              meta={`${clientName(p.client_id)} · ${money(p.amount)}${p.sent_at ? ` · sent ${toDateInput(p.sent_at)}` : ""}${p.accepted_at ? ` · accepted ${toDateInput(p.accepted_at)}` : ""}`}
              badge={p.status}
            />
            <select
              value={p.status}
              disabled={proposals.saving}
              onChange={(e) => setProposalStatus(p, e.target.value as ProposalStatus)}
              style={{ marginTop: 4, width: "100%" }}
            >
              {PROPOSAL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ))}
      </HubSection>

      <HubForm title="Add Proposal" onSubmit={addProposal} saving={proposals.saving} submitLabel="Add Proposal">
        <HubField label="Title">
          <input value={prop.title} onChange={(e) => setProp({ ...prop, title: e.target.value })} />
        </HubField>
        <HubField label="Amount (USD)">
          <input type="number" value={prop.amount} onChange={(e) => setProp({ ...prop, amount: e.target.value })} />
        </HubField>
        <HubField label="Client">
          <select value={prop.client} onChange={(e) => setProp({ ...prop, client: e.target.value })}>
            <option value="">Unassigned</option>
            {(clients ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </HubField>
      </HubForm>

      <HubSection label={`Payments · ${payments.rows.length}`}>
        {payments.rows.length === 0 ? <HubMuted>No payments.</HubMuted> : null}
        {payments.rows.map((p) => (
          <div key={p.id} style={{ marginBottom: 6 }}>
            <HubListItem
              title={p.label}
              meta={`${clientName(p.client_id)} · ${money(p.amount)}${p.recorded_date ? ` · ${toDateInput(p.recorded_date)}` : ""}`}
              badge={p.status}
            />
            <select
              value={p.status}
              disabled={payments.saving}
              onChange={(e) => setPaymentStatus(p, e.target.value as PaymentStatus)}
              style={{ marginTop: 4, width: "100%" }}
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ))}
      </HubSection>

      <HubForm title="Record Payment" onSubmit={addPayment} saving={payments.saving} submitLabel="Record Payment">
        <HubField label="Label">
          <input value={pay.label} onChange={(e) => setPay({ ...pay, label: e.target.value })} />
        </HubField>
        <HubField label="Amount (USD)">
          <input type="number" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} />
        </HubField>
        <HubField label="Client">
          <select value={pay.client} onChange={(e) => setPay({ ...pay, client: e.target.value })}>
            <option value="">Unassigned</option>
            {(clients ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </HubField>
        <HubField label="Paid date">
          <input type="date" value={pay.recorded_date} onChange={(e) => setPay({ ...pay, recorded_date: e.target.value })} />
        </HubField>
      </HubForm>
    </>
  );
}
