"use client";

import { useEffect, useRef, useState } from "react";
import type { SearchResult } from "@/types/command-core";

const ACCENT = "#ff7a36";
const PANEL_BG = "rgba(8, 14, 20, 0.96)";
const BORDER = "rgba(255, 122, 54, 0.25)";

const TYPE_LABEL: Record<string, string> = {
  lead: "Lead",
  client: "Client",
  project: "Project",
  note: "Note",
  memory: "Memory",
  record: "Record",
  task: "Task",
  service: "Service",
};

/** Global cross-module search bar. Queries /api/os/search and shows matches. */
export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = setTimeout(() => {
      void fetch(`/api/os/search?q=${encodeURIComponent(term)}`)
        .then((r) => r.json())
        .then((json) => {
          setResults((json.results as SearchResult[]) ?? []);
          setOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 220);
    return () => clearTimeout(handle);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={boxRef} style={{ position: "relative", width: "min(320px, 40vw)" }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Search OS — leads, projects, notes…"
        aria-label="Search command center"
        style={{
          width: "100%",
          background: "rgba(8, 14, 20, 0.85)",
          border: `1px solid ${BORDER}`,
          borderRadius: 4,
          color: "#dffaff",
          font: "12px/1.4 ui-monospace, monospace",
          padding: "7px 10px",
          outline: "none",
        }}
      />
      {open ? (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            maxHeight: 340,
            overflowY: "auto",
            background: PANEL_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 6,
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            zIndex: 60,
          }}
        >
          {loading ? (
            <p style={{ padding: 12, color: "#7aa", font: "11px ui-monospace, monospace" }}>
              Searching…
            </p>
          ) : results.length === 0 ? (
            <p style={{ padding: 12, color: "#7aa", font: "11px ui-monospace, monospace" }}>
              No matches.
            </p>
          ) : (
            results.map((r) => (
              <div
                key={`${r.type}-${r.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "8px 12px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span style={{ color: "#e6feff", font: "12px ui-monospace, monospace" }}>
                  {r.title}
                  {r.subtitle ? (
                    <span style={{ color: "#6a8a90", marginLeft: 6 }}>· {r.subtitle}</span>
                  ) : null}
                </span>
                <span
                  style={{
                    color: ACCENT,
                    font: "9px ui-monospace, monospace",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 3,
                    padding: "2px 5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {TYPE_LABEL[r.type] ?? r.type}
                </span>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
