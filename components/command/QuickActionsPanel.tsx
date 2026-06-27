"use client";

import { HudPanel } from "@/components/command/HudPanel";
import { useCallback, useEffect, useState } from "react";
import type { CommandTaskRow } from "@/types/command-core";

const BORDER = "rgba(255, 122, 54, 0.25)";
const ACCENT = "#ff7a36";

type ActionKey = "task" | "lead" | "note";

const ACTIONS: { key: ActionKey; label: string; placeholder: string; endpoint: string; field: string }[] = [
  { key: "task", label: "+ Task", placeholder: "New task title…", endpoint: "/api/os/tasks", field: "title" },
  { key: "lead", label: "+ Lead", placeholder: "Lead name…", endpoint: "/api/os/leads", field: "name" },
  { key: "note", label: "+ Note", placeholder: "Note title…", endpoint: "/api/os/notes", field: "title" },
];

const btnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? "rgba(255, 122, 54, 0.15)" : "rgba(8, 14, 20, 0.85)",
  border: `1px solid ${BORDER}`,
  borderRadius: 4,
  color: active ? ACCENT : "#cfeff5",
  cursor: "pointer",
  font: "11px ui-monospace, monospace",
  padding: "6px 9px",
});

export function QuickActionsPanel() {
  const [active, setActive] = useState<ActionKey | null>(null);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [tasks, setTasks] = useState<CommandTaskRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/os/tasks");
      const json = await res.json();
      if (res.ok) setTasks((json.tasks as CommandTaskRow[]) ?? []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const submit = async () => {
    const action = ACTIONS.find((a) => a.key === active);
    if (!action || !value.trim()) return;
    setSaving(true);
    setMsg(null);
    try {
      const body: Record<string, unknown> = { [action.field]: value.trim() };
      if (action.key === "lead") body.source = "manual";
      const res = await fetch(action.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed.");
      setValue("");
      setActive(null);
      setMsg(`${action.label.replace("+ ", "")} added.`);
      if (action.key === "task") await loadTasks();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (task: CommandTaskRow) => {
    const next = task.status === "done" ? "open" : "done";
    await fetch("/api/os/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, status: next }),
    }).catch(() => {});
    await loadTasks();
  };

  return (
    <HudPanel label="// QUICK ACTIONS" title="Quick Actions" className="command-quick-actions">
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {ACTIONS.map((a) => (
          <button
            key={a.key}
            type="button"
            style={btnStyle(active === a.key)}
            onClick={() => {
              setActive(active === a.key ? null : a.key);
              setValue("");
              setMsg(null);
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {active ? (
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={ACTIONS.find((a) => a.key === active)?.placeholder}
            style={{
              flex: 1,
              background: "rgba(8, 14, 20, 0.85)",
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              color: "#dffaff",
              font: "12px ui-monospace, monospace",
              padding: "6px 9px",
              outline: "none",
            }}
          />
          <button type="button" style={btnStyle(true)} disabled={saving} onClick={submit}>
            {saving ? "…" : "Save"}
          </button>
        </div>
      ) : null}

      {msg ? (
        <p style={{ color: "#8ab", font: "10px ui-monospace, monospace", margin: "0 0 8px" }}>{msg}</p>
      ) : null}

      <div>
        <p
          style={{
            color: "#9ad",
            font: "9px ui-monospace, monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: "0 0 6px",
          }}
        >
          Open tasks
        </p>
        {tasks.length === 0 ? (
          <p style={{ color: "#7aa", font: "11px ui-monospace, monospace", margin: 0 }}>
            No open tasks.
          </p>
        ) : (
          tasks.slice(0, 6).map((t) => (
            <label
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 0",
                color: "#dadfe2",
                font: "12px ui-monospace, monospace",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={t.status === "done"}
                onChange={() => toggleTask(t)}
              />
              <span style={{ textDecoration: t.status === "done" ? "line-through" : "none" }}>
                {t.title}
              </span>
            </label>
          ))
        )}
      </div>
    </HudPanel>
  );
}
