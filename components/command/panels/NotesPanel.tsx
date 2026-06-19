"use client";

import {
  HubBtn,
  HubField,
  HubForm,
  HubListItem,
  HubMuted,
  HubSection,
  ModuleHubShell,
  useHubFetch,
} from "@/components/command/ModuleHubShell";
import type { NotesDashboard } from "@/types/forgeonix-os";
import { useState } from "react";

type NotesPanelProps = { onClose?: () => void };

export function NotesPanel({ onClose }: NotesPanelProps) {
  const { data, loading, error, reload, setError } = useHubFetch<NotesDashboard>("/api/os/notes");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [noteType, setNoteType] = useState<"note" | "documentation">("note");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/os/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body: body || null, note_type: noteType }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed.");
      setFormOpen(false);
      setTitle("");
      setBody("");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModuleHubShell
      label="// AI OPERATIONS"
      title="Notes & Docs"
      subtitle="Agent memory · notes · documentation"
      onClose={onClose}
      loading={loading}
      error={error}
    >
      {data ? (
        <>
          <HubSection label="Notes / Documentation">
            {data.notes.length === 0 ? (
              <HubMuted>No notes yet.</HubMuted>
            ) : (
              data.notes.map((n) => (
                <div key={n.id} className="command-hub-note">
                  <HubListItem title={n.title} badge={n.note_type} />
                  {n.body ? <p className="command-hub-note__body">{n.body}</p> : null}
                </div>
              ))
            )}
            <HubBtn onClick={() => setFormOpen(!formOpen)}>
              {formOpen ? "Cancel" : "+ Add note"}
            </HubBtn>
            {formOpen ? (
              <HubForm title="New note" onSubmit={handleSubmit} saving={saving}>
                <HubField label="Title">
                  <input required value={title} onChange={(e) => setTitle(e.target.value)} />
                </HubField>
                <HubField label="Type">
                  <select value={noteType} onChange={(e) => setNoteType(e.target.value as "note" | "documentation")}>
                    <option value="note">Note</option>
                    <option value="documentation">Documentation</option>
                  </select>
                </HubField>
                <HubField label="Body">
                  <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
                </HubField>
              </HubForm>
            ) : null}
          </HubSection>
        </>
      ) : null}
    </ModuleHubShell>
  );
}
