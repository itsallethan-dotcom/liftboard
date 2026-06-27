"use client";

import { useRef } from "react";
import { ModuleIcon } from "@/components/command/ModuleIcon";
import { gsap, useGSAP } from "@/lib/motion";
import type { CommandModule, SystemMetric } from "@/types/command";

export type CommandViewId =
  | "bridge"
  | "modules"
  | "telemetry"
  | "logs"
  | "network"
  | "terminal"
  | "config";

const ACCENT = "#ff7a36";
const BORDER = "rgba(255, 122, 54, 0.25)";

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 30,
  display: "flex",
  flexDirection: "column",
  background: "rgba(6, 7, 12, 0.92)",
  backdropFilter: "blur(2px)",
  padding: "14px 16px",
  overflowY: "auto",
};
const mono = (size = 12, color = "#dfeaee"): React.CSSProperties => ({
  color,
  font: `${size}px ui-monospace, monospace`,
});
const plannedBadge: React.CSSProperties = {
  display: "inline-block",
  border: "1px solid rgba(251, 191, 36, 0.4)",
  color: "#fbbf24",
  borderRadius: 4,
  padding: "2px 8px",
  font: "10px ui-monospace, monospace",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

const NETWORK_NODES = [
  "Forgeonix OS",
  "Liftboard",
  "Blackgate Studios",
  "Solea Nails",
  "Supabase",
  "Vercel",
  "Cloudinary",
  "Zoho Mail",
  "n8n",
  "Home Assistant",
  "Portainer",
  "Uptime Kuma",
  "Tailscale",
  "AdGuard",
  "Homelab nodes",
];

const LOG_TYPES = [
  "module opens",
  "quick launch clicks",
  "lead changes",
  "project changes",
  "infrastructure changes",
  "job application changes",
  "errors",
  "automation runs",
  "AI actions",
];

const CONFIG_ITEMS = [
  "Owner access (FORGEONIX_OWNER_EMAIL)",
  "Theme / accent color",
  "Sound (mute toggle)",
  "Reduced motion",
  "Boot sequence",
];

const TITLES: Record<Exclude<CommandViewId, "bridge">, string> = {
  modules: "Module Directory",
  telemetry: "System Telemetry",
  logs: "Command Log",
  network: "Network Map",
  terminal: "Terminal",
  config: "System Config",
};

type CommandViewProps = {
  view: CommandViewId;
  modules: CommandModule[];
  metrics: SystemMetric[];
  onClose: () => void;
  onSelectModule: (id: string) => void;
};

export function CommandView({ view, modules, metrics, onClose, onSelectModule }: CommandViewProps) {
  const ref = useRef<HTMLElement>(null);

  // Phase 5 — the view "arrives" like a camera settling onto a new console.
  // Replays on each sub-view change; reduced-motion users get an instant swap.
  useGSAP(
    () => {
      if (view === "bridge" || !ref.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          autoAlpha: 0,
          scale: 1.04,
          duration: 0.5,
          ease: "forge-smooth",
        });
      });
      return () => mm.revert();
    },
    { dependencies: [view], scope: ref },
  );

  if (view === "bridge") return null;

  return (
    <section ref={ref} className="command-view" style={overlay} aria-label={`${TITLES[view]} view`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ ...mono(11, ACCENT), letterSpacing: "0.16em", textTransform: "uppercase" }}>
          // {TITLES[view]}
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "rgba(8,14,20,0.85)",
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            color: "#cfeff5",
            cursor: "pointer",
            font: "11px ui-monospace, monospace",
            padding: "5px 10px",
          }}
        >
          ← Bridge
        </button>
      </div>

      {view === "modules" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
          {modules.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectModule(m.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                textAlign: "left",
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                background: "rgba(12,16,22,0.7)",
                color: "#e6eef0",
                cursor: "pointer",
                padding: "10px 9px",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: ACCENT, lineHeight: 0 }}>
                  <ModuleIcon moduleId={m.id} />
                </span>
                <span style={{ ...mono(9, "#8aa0a8"), textTransform: "uppercase" }}>{m.status}</span>
              </span>
              <span style={mono(12)}>{m.label}</span>
              <span style={mono(10, "#8aa0a8")}>{m.subtitle}</span>
            </button>
          ))}
        </div>
      ) : null}

      {view === "telemetry" ? (
        <div>
          <span style={plannedBadge}>Live telemetry not connected yet</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 8, marginTop: 12 }}>
            {metrics.map((mt) => (
              <div key={mt.id} style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 11px", background: "rgba(12,16,22,0.7)" }}>
                <div style={mono(10, "#8aa0a8")}>{mt.label}</div>
                <div style={mono(16)}>{mt.value}</div>
              </div>
            ))}
          </div>
          <p style={{ ...mono(11, "#9bb"), marginTop: 12, lineHeight: 1.6 }}>
            NODES is a real count from the module registry. CPU / MEM / NET are simulated
            placeholders (marked “sim”). A real telemetry stream is planned.
          </p>
        </div>
      ) : null}

      {view === "logs" ? (
        <div>
          <span style={plannedBadge}>Not connected yet</span>
          <p style={{ ...mono(12, "#9bb"), marginTop: 12, lineHeight: 1.6 }}>
            The command log is not persisted yet — no log data exists. When the logging
            system is built, this view will record meaningful events:
          </p>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
            {LOG_TYPES.map((t) => (
              <li key={t} style={{ ...mono(12, "#cfeff5"), padding: "2px 0" }}>{t}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {view === "network" ? (
        <div>
          <span style={plannedBadge}>Planned — not the final map</span>
          <p style={{ ...mono(12, "#9bb"), marginTop: 12, lineHeight: 1.6 }}>
            The interactive network map is planned. It will connect homelab infrastructure
            and project services. Nodes it will eventually include:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 6, marginTop: 10 }}>
            {NETWORK_NODES.map((n) => (
              <span key={n} style={{ ...mono(11, "#cfeff5"), border: `1px solid ${BORDER}`, borderRadius: 6, padding: "6px 8px", background: "rgba(12,16,22,0.6)" }}>
                {n}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {view === "terminal" ? (
        <div>
          <span style={plannedBadge}>Not connected yet</span>
          <div style={{ marginTop: 12, border: `1px solid ${BORDER}`, borderRadius: 8, background: "#04060a", padding: 12, minHeight: 160 }}>
            <p style={{ ...mono(12, "#7fe7c4"), margin: 0 }}>forgeonix@os:~$ <span style={{ color: "#9bb" }}>status</span></p>
            <p style={{ ...mono(12, "#9bb"), margin: "6px 0 0", lineHeight: 1.6 }}>
              Terminal interface is not connected yet. This is a placeholder console — no
              commands are executed.
            </p>
            <p style={{ ...mono(12, "#7fe7c4"), margin: "10px 0 0" }}>
              forgeonix@os:~$ <span style={{ borderLeft: "6px solid #7fe7c4", marginLeft: 2 }} />
            </p>
          </div>
        </div>
      ) : null}

      {view === "config" ? (
        <div>
          <span style={plannedBadge}>Not connected yet</span>
          <p style={{ ...mono(12, "#9bb"), marginTop: 12, lineHeight: 1.6 }}>
            Settings are not wired yet. Planned configuration:
          </p>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
            {CONFIG_ITEMS.map((c) => (
              <li key={c} style={{ ...mono(12, "#cfeff5"), padding: "2px 0" }}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
