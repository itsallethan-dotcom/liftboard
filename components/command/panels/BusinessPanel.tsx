"use client";

import {
  HubBtn,
  HubField,
  HubForm,
  HubMuted,
  HubSection,
  HubStats,
  ModuleHubShell,
  useHubFetch,
} from "@/components/command/ModuleHubShell";
import { CrmWorkspace } from "@/components/command/panels/crm/CrmWorkspace";
import { buildPipeline } from "@/lib/os/pipeline";
import {
  CLIENT_STAGES,
  COMMUNICATION_CHANNELS,
  INVOICE_STATUSES,
  PRIORITY_LEVELS,
  type BusinessDashboard,
} from "@/types/forgeonix-os";
import { useState } from "react";

type BusinessPanelProps = { onClose?: () => void };

const ACCENT = "#ff7a36";
const BORDER = "rgba(255, 122, 54, 0.25)";
const TABS = ["CRM", "Dashboard", "Pipeline", "Clients", "Tasks", "Invoices", "Revenue"] as const;
type Tab = (typeof TABS)[number];

const badge: React.CSSProperties = {
  display: "inline-block", color: ACCENT, font: "9px ui-monospace, monospace",
  letterSpacing: "0.06em", textTransform: "uppercase", border: `1px solid ${BORDER}`,
  borderRadius: 3, padding: "1px 5px", marginLeft: 4,
};
const row: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
  padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
};
const miniBtn: React.CSSProperties = {
  background: "rgba(8,14,20,0.85)", border: `1px solid ${BORDER}`, borderRadius: 3,
  color: "#cfeff5", cursor: "pointer", font: "10px ui-monospace, monospace", padding: "2px 6px",
};
const mono = (size = 12): React.CSSProperties => ({ color: "#dadfe2", font: `${size}px ui-monospace, monospace` });

function money(amount: number | null | undefined, currency = "USD") {
  if (amount == null) return "—";
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(amount)); }
  catch { return `${currency} ${Number(amount).toFixed(2)}`; }
}

async function mutate(url: string, method: string, body?: unknown): Promise<void> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error ?? "Request failed.");
  }
}

type RunFn = (fn: () => Promise<void>) => Promise<void>;

export function BusinessPanel({ onClose }: BusinessPanelProps) {
  const { data, loading, error, reload, setError } =
    useHubFetch<BusinessDashboard>("/api/os/business");
  const [tab, setTab] = useState<Tab>("CRM");

  const run: RunFn = async (fn) => {
    setError(null);
    try { await fn(); await reload(); }
    catch (e) { setError(e instanceof Error ? e.message : "Action failed."); }
  };

  return (
    <ModuleHubShell
      label="// FORGEONIX BUSINESS"
      title="Business OS"
      subtitle="Pipeline · clients · tasks · revenue"
      onClose={onClose}
      loading={loading}
      error={error}
    >
      {data ? (
        <>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "0 0 8px" }}>
            {TABS.map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)}
                style={{ ...miniBtn, background: tab === t ? "rgba(255,122,54,0.15)" : "rgba(8,14,20,0.85)",
                  color: tab === t ? ACCENT : "#cfeff5", font: "11px ui-monospace, monospace", padding: "5px 9px" }}>
                {t}
              </button>
            ))}
          </div>

          {tab === "CRM" ? <CrmWorkspace /> : null}
          {tab === "Dashboard" ? <DashboardTab data={data} /> : null}
          {tab === "Pipeline" ? <PipelineTab data={data} run={run} /> : null}
          {tab === "Clients" ? <ClientsTab data={data} run={run} /> : null}
          {tab === "Tasks" ? <TasksTab data={data} run={run} /> : null}
          {tab === "Invoices" ? <InvoicesTab data={data} run={run} /> : null}
          {tab === "Revenue" ? <RevenueTab data={data} /> : null}
        </>
      ) : null}
    </ModuleHubShell>
  );
}

/* -------------------------------- Dashboard ------------------------------- */

function DashboardTab({ data }: { data: BusinessDashboard }) {
  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = today.slice(0, 7);
  const openLeads = data.leads.filter((l) => !["won", "lost", "archived"].includes(l.status)).length;
  const activeClients = data.clients.filter((c) => c.status === "active" || c.status === "prospect").length;
  const openTasks = data.tasks.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const followUpsDue = data.followUps.filter((f) => f.status === "pending" && f.due_date && f.due_date <= today).length;
  const monthRevenue = data.monthlyRevenue.find((m) => m.month === thisMonth)?.total ?? 0;
  const outstanding = data.invoices.filter((i) => i.status === "sent" || i.status === "overdue");

  return (
    <>
      <HubSection label="Overview">
        <HubStats
          items={[
            { label: "Open Leads", value: String(openLeads) },
            { label: "Clients", value: String(activeClients) },
            { label: "Open Tasks", value: String(openTasks), warn: openTasks > 0 },
            { label: "Follow-ups Due", value: String(followUpsDue), warn: followUpsDue > 0 },
            { label: "Revenue (mo)", value: money(monthRevenue) },
            { label: "Invoices Outstanding", value: String(outstanding.length), warn: outstanding.length > 0 },
          ]}
        />
      </HubSection>

      <HubSection label="Upcoming · Follow-ups">
        {data.followUps.filter((f) => f.status === "pending").length === 0 ? (
          <HubMuted>No pending follow-ups.</HubMuted>
        ) : (
          data.followUps.filter((f) => f.status === "pending").slice(0, 6).map((f) => (
            <div key={f.id} style={row}>
              <span style={mono()}>{f.title}</span>
              <span style={{ ...mono(10), color: "#8aa" }}>{f.due_date ?? "—"}</span>
            </div>
          ))
        )}
      </HubSection>
    </>
  );
}

/* -------------------------------- Pipeline -------------------------------- */

function PipelineTab({ data, run }: { data: BusinessDashboard; run: RunFn }) {
  const columns = buildPipeline(data);
  return (
    <HubSection label="Pipeline · Lead → Client → Archived">
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
        {columns.map((col) => (
          <div key={col.key} style={{ minWidth: 150, flex: "0 0 auto" }}>
            <p style={{ ...mono(10), color: ACCENT, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>
              {col.label} · {col.cards.length}
            </p>
            {col.cards.length === 0 ? (
              <p style={{ ...mono(10), color: "#566" }}>—</p>
            ) : (
              col.cards.map((card) => (
                <div key={`${card.kind}-${card.id}`}
                  style={{ border: `1px solid ${BORDER}`, borderRadius: 4, padding: 6, marginBottom: 5, background: "rgba(8,14,20,0.6)" }}>
                  <p style={{ ...mono(11), color: "#e6feff", margin: 0 }}>{card.title}</p>
                  {card.subtitle ? <p style={{ ...mono(9), color: "#8aa", margin: "2px 0 0" }}>{card.subtitle}</p> : null}
                  {card.value != null ? <p style={{ ...mono(9), color: "#8aa", margin: "2px 0 0" }}>{money(card.value)}</p> : null}
                  {card.kind === "lead" && ["lead", "contacted", "proposal"].includes(card.stage) ? (
                    <button type="button" style={{ ...miniBtn, marginTop: 4 }}
                      onClick={() => run(() => mutate("/api/os/business/convert", "POST", { leadId: card.id }))}>
                      Convert →
                    </button>
                  ) : null}
                  {card.kind === "client" ? (
                    <select value={card.stage === "client" ? "active" : card.stage}
                      onChange={(e) => run(() => mutate("/api/os/business/clients", "PATCH", { id: card.id, stage: e.target.value }))}
                      aria-label="Client stage" style={{ ...miniBtn, marginTop: 4, width: "100%" }}>
                      {CLIENT_STAGES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                  ) : null}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </HubSection>
  );
}

/* --------------------------------- Clients -------------------------------- */

function ClientsTab({ data, run }: { data: BusinessDashboard; run: RunFn }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault();
    await run(async () => {
      await mutate("/api/os/business/clients", "POST", { name, company: company || null, status: "active" });
      setName(""); setCompany(""); setOpen(false);
    });
  };

  return (
    <>
      <HubSection label="Clients">
        {data.clients.length === 0 ? <HubMuted>No clients yet.</HubMuted> : (
          data.clients.map((c) => (
            <div key={c.id} style={row}>
              <button type="button" onClick={() => setSelected(selected === c.id ? null : c.id)}
                style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", flex: 1 }}>
                <span style={mono()}>{c.company ?? c.name}</span>
                <span style={badge}>{c.stage.replace(/_/g, " ")}</span>
              </button>
            </div>
          ))
        )}
        <HubBtn onClick={() => setOpen(!open)}>{open ? "Cancel" : "+ Add client"}</HubBtn>
        {open ? (
          <HubForm title="New client" onSubmit={addClient}>
            <HubField label="Name"><input required value={name} onChange={(e) => setName(e.target.value)} /></HubField>
            <HubField label="Company"><input value={company} onChange={(e) => setCompany(e.target.value)} /></HubField>
          </HubForm>
        ) : null}
      </HubSection>

      {selected ? <ClientDetail data={data} clientId={selected} run={run} /> : null}
    </>
  );
}

function ClientDetail({ data, clientId, run }: { data: BusinessDashboard; clientId: string; run: RunFn }) {
  const contacts = data.contacts.filter((c) => c.client_id === clientId);
  const comms = data.communications.filter((c) => c.client_id === clientId);
  const [cName, setCName] = useState("");
  const [cRole, setCRole] = useState("");
  const [summary, setSummary] = useState("");
  const [channel, setChannel] = useState<string>("note");

  const addContact = async () => {
    if (!cName.trim()) return;
    await run(async () => {
      await mutate("/api/os/business/contacts", "POST", { client_id: clientId, name: cName, role: cRole || null });
      setCName(""); setCRole("");
    });
  };
  const logComm = async () => {
    if (!summary.trim()) return;
    await run(async () => {
      await mutate("/api/os/business/communications", "POST", { client_id: clientId, channel, summary });
      setSummary("");
    });
  };

  return (
    <>
      <HubSection label="Contacts">
        {contacts.length === 0 ? <HubMuted>No contacts.</HubMuted> :
          contacts.map((c) => (
            <div key={c.id} style={row}>
              <span style={mono()}>{c.name}{c.role ? ` · ${c.role}` : ""}</span>
              <button type="button" style={miniBtn} title="Delete contact" aria-label={`Delete ${c.name}`}
                onClick={() => run(() => mutate(`/api/os/business/contacts?id=${c.id}`, "DELETE"))}>✕</button>
            </div>
          ))}
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <input value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Name"
            style={{ flex: 1, background: "rgba(8,14,20,0.85)", border: `1px solid ${BORDER}`, borderRadius: 4, color: "#dffaff", font: "12px ui-monospace, monospace", padding: "5px 8px" }} />
          <input value={cRole} onChange={(e) => setCRole(e.target.value)} placeholder="Role"
            style={{ width: 90, background: "rgba(8,14,20,0.85)", border: `1px solid ${BORDER}`, borderRadius: 4, color: "#dffaff", font: "12px ui-monospace, monospace", padding: "5px 8px" }} />
          <button type="button" style={miniBtn} onClick={addContact}>Add</button>
        </div>
      </HubSection>

      <HubSection label="Communication History">
        {comms.length === 0 ? <HubMuted>No communications logged.</HubMuted> :
          comms.slice(0, 10).map((c) => (
            <div key={c.id} style={{ ...mono(11), color: "#9bb", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={badge}>{c.channel}</span> {c.summary}
              <span style={{ ...mono(9), color: "#566" }}> · {(c.occurred_at ?? c.created_at).slice(0, 10)}</span>
            </div>
          ))}
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <select value={channel} onChange={(e) => setChannel(e.target.value)} aria-label="Channel" style={miniBtn}>
            {COMMUNICATION_CHANNELS.map((ch) => <option key={ch} value={ch}>{ch}</option>)}
          </select>
          <input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Log a note / call / email…"
            style={{ flex: 1, background: "rgba(8,14,20,0.85)", border: `1px solid ${BORDER}`, borderRadius: 4, color: "#dffaff", font: "12px ui-monospace, monospace", padding: "5px 8px" }} />
          <button type="button" style={miniBtn} onClick={logComm}>Log</button>
        </div>
      </HubSection>
    </>
  );
}

/* ---------------------------------- Tasks --------------------------------- */

function TasksTab({ data, run }: { data: BusinessDashboard; run: RunFn }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<string>("medium");
  const [due, setDue] = useState("");
  const openTasks = data.tasks.filter((t) => t.status !== "done" && t.status !== "cancelled");

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await run(async () => {
      await mutate("/api/os/business/tasks", "POST", { title, priority_level: level, due_date: due || null });
      setTitle(""); setLevel("medium"); setDue(""); setOpen(false);
    });
  };

  return (
    <HubSection label="Tasks">
      {openTasks.length === 0 ? <HubMuted>No open tasks.</HubMuted> :
        openTasks.map((t) => (
          <div key={t.id} style={row}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flex: 1 }}>
              <input type="checkbox" checked={t.status === "done"}
                onChange={() => run(() => mutate("/api/os/business/tasks", "PATCH", { id: t.id, status: t.status === "done" ? "open" : "done" }))} />
              <span style={mono()}>{t.title}</span>
              <span style={badge}>{t.priority_level}</span>
            </label>
            <span style={{ ...mono(10), color: "#8aa" }}>{t.due_date ?? ""}</span>
          </div>
        ))}
      <HubBtn onClick={() => setOpen(!open)}>{open ? "Cancel" : "+ Add task"}</HubBtn>
      {open ? (
        <HubForm title="New task" onSubmit={addTask}>
          <HubField label="Title"><input required value={title} onChange={(e) => setTitle(e.target.value)} /></HubField>
          <HubField label="Priority">
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              {PRIORITY_LEVELS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </HubField>
          <HubField label="Due date"><input type="date" value={due} onChange={(e) => setDue(e.target.value)} /></HubField>
        </HubForm>
      ) : null}
    </HubSection>
  );
}

/* -------------------------------- Invoices -------------------------------- */

function InvoicesTab({ data, run }: { data: BusinessDashboard; run: RunFn }) {
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [clientId, setClientId] = useState("");
  const [due, setDue] = useState("");
  const clientName = (id: string | null) => (id ? (data.clients.find((c) => c.id === id)?.company ?? data.clients.find((c) => c.id === id)?.name ?? "—") : "—");

  const addInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    await run(async () => {
      await mutate("/api/os/business/invoices", "POST", {
        invoice_number: number || null, amount: amount ? Number(amount) : null,
        client_id: clientId || null, due_date: due || null, status: "draft",
      });
      setNumber(""); setAmount(""); setClientId(""); setDue(""); setOpen(false);
    });
  };

  return (
    <HubSection label="Invoices">
      {data.invoices.length === 0 ? <HubMuted>No invoices.</HubMuted> :
        data.invoices.map((inv) => (
          <div key={inv.id} style={row}>
            <span style={{ minWidth: 0 }}>
              <span style={mono()}>{inv.invoice_number ?? "(no #)"}</span>
              <span style={{ ...mono(10), color: "#8aa" }}> {clientName(inv.client_id)} · {money(inv.amount, inv.currency)}</span>
            </span>
            <span style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              <select value={inv.status} aria-label="Invoice status" style={miniBtn}
                onChange={(e) => run(() => mutate("/api/os/business/invoices", "PATCH", { id: inv.id, status: e.target.value, ...(e.target.value === "paid" ? { paid_date: new Date().toISOString().slice(0, 10) } : {}) }))}>
                {INVOICE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="button" style={miniBtn} title="Delete invoice" aria-label="Delete invoice"
                onClick={() => run(() => mutate(`/api/os/business/invoices?id=${inv.id}`, "DELETE"))}>✕</button>
            </span>
          </div>
        ))}
      <HubBtn onClick={() => setOpen(!open)}>{open ? "Cancel" : "+ Add invoice"}</HubBtn>
      {open ? (
        <HubForm title="New invoice" onSubmit={addInvoice}>
          <HubField label="Invoice #"><input value={number} onChange={(e) => setNumber(e.target.value)} /></HubField>
          <HubField label="Amount"><input value={amount} onChange={(e) => setAmount(e.target.value)} /></HubField>
          <HubField label="Client">
            <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">(none)</option>
              {data.clients.map((c) => <option key={c.id} value={c.id}>{c.company ?? c.name}</option>)}
            </select>
          </HubField>
          <HubField label="Due date"><input type="date" value={due} onChange={(e) => setDue(e.target.value)} /></HubField>
        </HubForm>
      ) : null}
    </HubSection>
  );
}

/* --------------------------------- Revenue -------------------------------- */

function RevenueTab({ data }: { data: BusinessDashboard }) {
  const received = data.revenue.filter((r) => r.status === "received").reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const pending = data.revenue.filter((r) => r.status === "pending").reduce((s, r) => s + Number(r.amount ?? 0), 0);

  return (
    <>
      <HubSection label="Overview">
        <HubStats items={[
          { label: "Received", value: money(received) },
          { label: "Pending", value: money(pending), warn: pending > 0 },
          { label: "Entries", value: String(data.revenue.length) },
        ]} />
      </HubSection>

      <HubSection label="Monthly Totals">
        {data.monthlyRevenue.length === 0 ? <HubMuted>No received revenue yet.</HubMuted> :
          data.monthlyRevenue.map((m) => (
            <div key={m.month} style={row}>
              <span style={mono()}>{m.month}</span>
              <span style={mono()}>{money(m.total)}</span>
            </div>
          ))}
      </HubSection>

      <HubSection label="Revenue History">
        {data.revenue.length === 0 ? <HubMuted>No revenue records.</HubMuted> :
          data.revenue.slice(0, 12).map((r) => (
            <div key={r.id} style={row}>
              <span style={mono()}>{r.label}<span style={badge}>{r.status}</span></span>
              <span style={mono()}>{money(Number(r.amount), r.currency)}</span>
            </div>
          ))}
      </HubSection>
    </>
  );
}
