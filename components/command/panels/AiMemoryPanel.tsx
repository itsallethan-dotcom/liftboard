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
import {
  MEMORY_TYPES,
  type MemoryDashboard,
  type MemoryItem,
  type MemoryType,
} from "@/types/memory";
import type { NotesDashboard, RecordsDashboard } from "@/types/forgeonix-os";
import { useEffect, useMemo, useState } from "react";

type AiMemoryPanelProps = { onClose?: () => void };

const MODULE_OPTIONS = [
  "",
  "infrastructure",
  "business",
  "liftboard",
  "career",
  "projects",
  "ai-memory",
  "automations",
  "finance",
  "health",
];

const SCALE = [1, 2, 3, 4, 5];

const ACCENT = "#ff7a36";
const BORDER = "rgba(255, 122, 54, 0.25)";

type FormState = {
  title: string;
  content: string;
  category_id: string;
  module_key: string;
  type: MemoryType;
  source: string;
  importance: number;
  confidence: number;
  tags: string;
  pinned: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  content: "",
  category_id: "",
  module_key: "",
  type: "fact",
  source: "manual",
  importance: 3,
  confidence: 3,
  tags: "",
  pinned: false,
};

const badge = (): React.CSSProperties => ({
  display: "inline-block",
  color: ACCENT,
  font: "9px ui-monospace, monospace",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  border: `1px solid ${BORDER}`,
  borderRadius: 3,
  padding: "1px 5px",
  marginRight: 4,
});

export function AiMemoryPanel({ onClose }: AiMemoryPanelProps) {
  const { data, loading, error, reload, setError } =
    useHubFetch<MemoryDashboard>("/api/os/memory");

  const [categoryFilter, setCategoryFilter] = useState("");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Legacy data sources (kept as secondary sections).
  const [notes, setNotes] = useState<NotesDashboard | null>(null);
  const [records, setRecords] = useState<RecordsDashboard | null>(null);
  useEffect(() => {
    void fetch("/api/os/notes").then((r) => r.json()).then(setNotes).catch(() => setNotes(null));
    void fetch("/api/os/records").then((r) => r.json()).then(setRecords).catch(() => setRecords(null));
  }, []);

  const categories = data?.categories ?? [];
  const categoryLabel = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.label]));
    return (id: string | null) => (id ? map.get(id) ?? "—" : "—");
  }, [categories]);

  const items = useMemo(() => {
    const all = data?.items ?? [];
    const q = query.trim().toLowerCase();
    return all.filter((it) => {
      if (categoryFilter && it.category_id !== categoryFilter) return false;
      if (q) {
        const hay = `${it.title} ${it.content ?? ""} ${it.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data?.items, categoryFilter, query]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(false);
  };

  const startEdit = (item: MemoryItem) => {
    setEditingId(item.id);
    setFormOpen(true);
    setForm({
      title: item.title,
      content: item.content ?? "",
      category_id: item.category_id ?? "",
      module_key: item.module_key ?? "",
      type: item.type,
      source: item.source,
      importance: item.importance,
      confidence: item.confidence,
      tags: item.tags.join(", "),
      pinned: item.pinned,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      title: form.title,
      content: form.content || null,
      category_id: form.category_id || null,
      module_key: form.module_key || null,
      type: form.type,
      source: form.source || "manual",
      importance: form.importance,
      confidence: form.confidence,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      pinned: form.pinned,
    };
    try {
      const url = editingId ? `/api/os/memory/${editingId}` : "/api/os/memory";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed.");
      resetForm();
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const archive = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/os/memory/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Delete failed.");
      }
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  const togglePin = async (item: MemoryItem) => {
    try {
      await fetch(`/api/os/memory/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !item.pinned }),
      });
      await reload();
    } catch {
      /* ignore */
    }
  };

  return (
    <ModuleHubShell
      label="// AI MEMORY"
      title="Second Brain"
      subtitle="Structured memory · category · type · importance"
      onClose={onClose}
      loading={loading}
      error={error}
    >
      {data ? (
        <>
          <HubSection label="Overview">
            <HubStats
              items={[
                { label: "Memories", value: String(data.stats.total) },
                { label: "Pinned", value: String(data.stats.pinned) },
                { label: "High Importance", value: String(data.stats.highImportance) },
                { label: "Categories", value: String(data.stats.categories) },
              ]}
            />
          </HubSection>

          <HubSection label="Memory">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search memory…"
                style={{
                  flex: 1,
                  minWidth: 140,
                  background: "rgba(8,14,20,0.85)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  color: "#dffaff",
                  font: "12px ui-monospace, monospace",
                  padding: "6px 9px",
                  outline: "none",
                }}
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  background: "rgba(8,14,20,0.85)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  color: "#dffaff",
                  font: "12px ui-monospace, monospace",
                  padding: "6px 9px",
                }}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.parent_id ? `— ${c.label}` : c.label}
                  </option>
                ))}
              </select>
            </div>

            {items.length === 0 ? (
              <HubMuted>No memories match.</HubMuted>
            ) : (
              items.map((it) => (
                <div
                  key={it.id}
                  style={{
                    borderLeft: `3px solid ${it.pinned ? ACCENT : "rgba(255,255,255,0.1)"}`,
                    padding: "6px 0 6px 8px",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ color: "#e6feff", font: "12px ui-monospace, monospace", fontWeight: 600 }}>
                      {it.title}
                    </span>
                    <span style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <button type="button" onClick={() => togglePin(it)} style={miniBtn} title="Pin">
                        {it.pinned ? "★" : "☆"}
                      </button>
                      <button type="button" onClick={() => startEdit(it)} style={miniBtn} title="Edit">
                        ✎
                      </button>
                      <button type="button" onClick={() => archive(it.id)} style={miniBtn} title="Archive">
                        ✕
                      </button>
                    </span>
                  </div>
                  {it.content ? (
                    <p style={{ color: "#9bb", font: "11px ui-monospace, monospace", margin: "3px 0" }}>
                      {it.content}
                    </p>
                  ) : null}
                  <div style={{ marginTop: 3 }}>
                    <span style={badge()}>{it.type}</span>
                    <span style={badge()}>{categoryLabel(it.category_id)}</span>
                    {it.module_key ? <span style={badge()}>{it.module_key}</span> : null}
                    <span style={badge()}>I{it.importance}·C{it.confidence}</span>
                    {it.tags.map((t) => (
                      <span key={t} style={{ ...badge(), color: "#8aa", borderColor: "rgba(255,255,255,0.12)" }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}

            <HubBtn onClick={() => (formOpen ? resetForm() : setFormOpen(true))}>
              {formOpen ? "Cancel" : "+ Add memory"}
            </HubBtn>

            {formOpen ? (
              <HubForm
                title={editingId ? "Edit memory" : "New memory"}
                onSubmit={submit}
                saving={saving}
                submitLabel={editingId ? "Update" : "Save"}
              >
                <HubField label="Title">
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </HubField>
                <HubField label="Content">
                  <textarea
                    rows={3}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  />
                </HubField>
                <HubField label="Category">
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  >
                    <option value="">(none)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.parent_id ? `— ${c.label}` : c.label}
                      </option>
                    ))}
                  </select>
                </HubField>
                <HubField label="Linked module">
                  <select
                    value={form.module_key}
                    onChange={(e) => setForm({ ...form, module_key: e.target.value })}
                  >
                    {MODULE_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m === "" ? "(none)" : m}
                      </option>
                    ))}
                  </select>
                </HubField>
                <HubField label="Type">
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as MemoryType })}
                  >
                    {MEMORY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </HubField>
                <HubField label="Source">
                  <input
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                  />
                </HubField>
                <HubField label="Importance (1–5)">
                  <select
                    value={form.importance}
                    onChange={(e) => setForm({ ...form, importance: Number(e.target.value) })}
                  >
                    {SCALE.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </HubField>
                <HubField label="Confidence (1–5)">
                  <select
                    value={form.confidence}
                    onChange={(e) => setForm({ ...form, confidence: Number(e.target.value) })}
                  >
                    {SCALE.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </HubField>
                <HubField label="Tags (comma-separated)">
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                </HubField>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#cfeff5",
                    font: "12px ui-monospace, monospace",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.pinned}
                    onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                  />
                  Pinned
                </label>
              </HubForm>
            ) : null}
          </HubSection>

          {/* Legacy data sources — kept secondary now that structured memory is primary. */}
          <HubSection label="Legacy · Notes">
            {!notes?.notes.length ? (
              <HubMuted>No notes.</HubMuted>
            ) : (
              notes.notes.slice(0, 5).map((n) => (
                <HubListItem key={n.id} title={n.title} badge={n.note_type} />
              ))
            )}
          </HubSection>

          <HubSection label="Legacy · Records">
            {!records?.records.length ? (
              <HubMuted>No records.</HubMuted>
            ) : (
              records.records.slice(0, 5).map((r) => (
                <HubListItem key={r.id} title={r.title} meta={r.project ?? undefined} badge={r.record_type} />
              ))
            )}
          </HubSection>
        </>
      ) : null}
    </ModuleHubShell>
  );
}

const miniBtn: React.CSSProperties = {
  background: "rgba(8,14,20,0.85)",
  border: `1px solid ${BORDER}`,
  borderRadius: 3,
  color: "#cfeff5",
  cursor: "pointer",
  font: "11px ui-monospace, monospace",
  lineHeight: 1,
  padding: "3px 6px",
};
