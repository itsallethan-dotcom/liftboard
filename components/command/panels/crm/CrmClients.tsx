"use client";

/** CRM Phase 4 — client management: add / view / edit / status / archive. */
import { useState } from "react";
import {
  HubBtn,
  HubField,
  HubForm,
  HubListItem,
  HubMuted,
  HubSection,
} from "@/components/command/ModuleHubShell";
import { useCrmSection } from "@/components/command/panels/crm/crm-hooks";
import { crmApi } from "@/lib/crm/client";
import { CLIENT_STATUSES, type Client } from "@/lib/crm/types";

const blank = { name: "", company: "", email: "", status: "prospect" as Client["status"], notes: "" };

export function CrmClients() {
  const { rows, loading, error, saving, run } = useCrmSection<Client>("clients");
  const [form, setForm] = useState(blank);
  const [openId, setOpenId] = useState<string | null>(null);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    void run(async () => {
      await crmApi.create("clients", {
        name: form.name.trim(),
        company: form.company || null,
        email: form.email || null,
        status: form.status,
        notes: form.notes || null,
      });
      setForm(blank);
    });
  };

  if (loading) return <HubMuted>Loading clients…</HubMuted>;

  const active = rows.filter((c) => c.status !== "archived");
  const archived = rows.filter((c) => c.status === "archived");

  return (
    <>
      {error ? <p className="command-hub-panel__error">{error}</p> : null}

      <HubSection label={`Clients · ${active.length}`}>
        {active.length === 0 ? <HubMuted>No active clients.</HubMuted> : null}
        {active.map((c) => (
          <div key={c.id}>
            <HubListItem
              title={c.name}
              meta={c.company ?? c.email ?? "—"}
              badge={c.status}
              onClick={() => setOpenId(openId === c.id ? null : c.id)}
            />
            {openId === c.id ? (
              <ClientEditor client={c} saving={saving} run={run} />
            ) : null}
          </div>
        ))}
      </HubSection>

      {archived.length > 0 ? (
        <HubSection label={`Archived · ${archived.length}`}>
          {archived.map((c) => (
            <HubListItem
              key={c.id}
              title={c.name}
              meta={c.company ?? "—"}
              badge="archived"
              onClick={() => run(async () => void (await crmApi.update("clients", c.id, { status: "prospect" })))}
            />
          ))}
        </HubSection>
      ) : null}

      <HubForm title="Add Client" onSubmit={add} saving={saving} submitLabel="Add Client">
        <HubField label="Name">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </HubField>
        <HubField label="Company">
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </HubField>
        <HubField label="Email">
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </HubField>
        <HubField label="Status">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Client["status"] })}
          >
            {CLIENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </HubField>
        <HubField label="Notes">
          <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </HubField>
      </HubForm>
    </>
  );
}

function ClientEditor({
  client,
  saving,
  run,
}: {
  client: Client;
  saving: boolean;
  run: (fn: () => Promise<void>) => Promise<void>;
}) {
  const [edit, setEdit] = useState({
    name: client.name,
    company: client.company ?? "",
    email: client.email ?? "",
    status: client.status,
    notes: client.notes ?? "",
  });

  const save = () =>
    run(async () => {
      await crmApi.update("clients", client.id, {
        name: edit.name.trim() || client.name,
        company: edit.company || null,
        email: edit.email || null,
        status: edit.status,
        notes: edit.notes || null,
      });
    });

  return (
    <div style={{ padding: "6px 2px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
      <HubField label="Name">
        <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
      </HubField>
      <HubField label="Company">
        <input value={edit.company} onChange={(e) => setEdit({ ...edit, company: e.target.value })} />
      </HubField>
      <HubField label="Email">
        <input value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} />
      </HubField>
      <HubField label="Status">
        <select
          value={edit.status}
          onChange={(e) => setEdit({ ...edit, status: e.target.value as Client["status"] })}
        >
          {CLIENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </HubField>
      <HubField label="Notes">
        <textarea rows={2} value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} />
      </HubField>
      <div style={{ display: "flex", gap: 6 }}>
        <HubBtn primary onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </HubBtn>
        <HubBtn
          onClick={() => run(async () => void (await crmApi.update("clients", client.id, { status: "archived" })))}
          disabled={saving}
        >
          Archive
        </HubBtn>
      </div>
    </div>
  );
}
