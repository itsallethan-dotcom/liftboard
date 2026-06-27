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
import type { OsProject } from "@/types/forgeonix-os";
import Link from "next/link";
import { useState } from "react";

type ProjectsPanelProps = { onClose?: () => void };
type ProjectsResponse = { projects: OsProject[] };

export function ProjectsPanel({ onClose }: ProjectsPanelProps) {
  const { data, loading, error, reload, setError } =
    useHubFetch<ProjectsResponse>("/api/os/projects");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [url, setUrl] = useState("");

  const projects = data?.projects ?? [];
  const live = projects.filter((p) => p.status === "live").length;
  const inDev = projects.filter((p) => p.status === "in_development").length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/os/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, stack: stack || null, url: url || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed.");
      setFormOpen(false);
      setName("");
      setStack("");
      setUrl("");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModuleHubShell
      label="// PROJECTS"
      title="Project Registry"
      subtitle="Builds · status · stack"
      onClose={onClose}
      loading={loading}
      error={error}
    >
      {data ? (
        <>
          <HubSection label="Overview">
            <HubStats
              items={[
                { label: "Total", value: String(projects.length) },
                { label: "Live", value: String(live) },
                { label: "In Dev", value: String(inDev) },
              ]}
            />
          </HubSection>

          <HubSection label="Projects">
            {projects.length === 0 ? (
              <HubMuted>No projects yet — add one below.</HubMuted>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="command-hub-row-wrap">
                  <HubListItem
                    title={p.name}
                    meta={p.stack ?? undefined}
                    badge={p.status.replace(/_/g, " ")}
                  />
                  {p.url ? (
                    <Link
                      href={p.url}
                      className="command-hub-link"
                      target={p.url.startsWith("http") ? "_blank" : undefined}
                    >
                      Open →
                    </Link>
                  ) : null}
                </div>
              ))
            )}
            <HubBtn onClick={() => setFormOpen(!formOpen)}>
              {formOpen ? "Cancel" : "+ Add project"}
            </HubBtn>
            {formOpen ? (
              <HubForm title="New project" onSubmit={handleSubmit} saving={saving}>
                <HubField label="Name">
                  <input required value={name} onChange={(e) => setName(e.target.value)} />
                </HubField>
                <HubField label="Stack">
                  <input value={stack} onChange={(e) => setStack(e.target.value)} />
                </HubField>
                <HubField label="URL">
                  <input value={url} onChange={(e) => setUrl(e.target.value)} />
                </HubField>
              </HubForm>
            ) : null}
          </HubSection>
        </>
      ) : null}
    </ModuleHubShell>
  );
}
