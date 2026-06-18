"use client";

import { useCallback, useMemo, useState } from "react";
import { PanelCorners } from "@/components/PanelCorners";

export type HomelabStatus = "Online" | "Internal" | "Planned";

export type HomelabNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  purpose: string;
  status: HomelabStatus;
  description: string;
  tier: "edge" | "access" | "host" | "service";
};

const NODES: HomelabNode[] = [
  {
    id: "internet",
    label: "Internet",
    x: 500,
    y: 70,
    purpose: "Network edge",
    status: "Online",
    description: "Public ingress path for remote access and outbound service traffic.",
    tier: "edge",
  },
  {
    id: "tailscale",
    label: "Tailscale",
    x: 500,
    y: 165,
    purpose: "Secure remote access",
    status: "Online",
    description: "Mesh VPN for encrypted admin paths without exposing management ports publicly.",
    tier: "access",
  },
  {
    id: "proxmox",
    label: "Proxmox Host",
    x: 500,
    y: 290,
    purpose: "Virtualization layer",
    status: "Online",
    description: "Type-1 hypervisor hosting VMs and LXC containers for lab workloads and Docker stacks.",
    tier: "host",
  },
  {
    id: "home-assistant",
    label: "Home Assistant",
    x: 110,
    y: 520,
    purpose: "Automation hub",
    status: "Online",
    description: "Local-first home automation with device integrations and reliable automations.",
    tier: "service",
  },
  {
    id: "portainer",
    label: "Portainer",
    x: 240,
    y: 520,
    purpose: "Container management",
    status: "Internal",
    description: "Web UI for Docker endpoint control, stack visibility, and container operations.",
    tier: "service",
  },
  {
    id: "homepage",
    label: "Homepage",
    x: 370,
    y: 520,
    purpose: "Internal dashboard",
    status: "Online",
    description: "Single pane of glass for internal service links and homelab navigation.",
    tier: "service",
  },
  {
    id: "adguard",
    label: "AdGuard",
    x: 500,
    y: 520,
    purpose: "DNS filtering",
    status: "Online",
    description: "Recursive DNS with policy-based filtering and local network query visibility.",
    tier: "service",
  },
  {
    id: "uptime-kuma",
    label: "Uptime Kuma",
    x: 630,
    y: 520,
    purpose: "Uptime monitoring",
    status: "Online",
    description: "Synthetic heartbeat checks, status history, and alert paths for internal services.",
    tier: "service",
  },
  {
    id: "netdata",
    label: "Netdata",
    x: 760,
    y: 520,
    purpose: "Live metrics",
    status: "Online",
    description: "Real-time resource metrics and performance signals across hosts and containers.",
    tier: "service",
  },
  {
    id: "n8n",
    label: "n8n",
    x: 890,
    y: 520,
    purpose: "Workflow automation",
    status: "Planned",
    description: "Integration workflows between APIs, webhooks, and internal automation hooks.",
    tier: "service",
  },
];

const EDGES: { from: string; to: string }[] = [
  { from: "internet", to: "tailscale" },
  { from: "tailscale", to: "proxmox" },
  { from: "proxmox", to: "home-assistant" },
  { from: "proxmox", to: "portainer" },
  { from: "proxmox", to: "homepage" },
  { from: "proxmox", to: "adguard" },
  { from: "proxmox", to: "uptime-kuma" },
  { from: "proxmox", to: "netdata" },
  { from: "proxmox", to: "n8n" },
];

const STATUS_CLASS: Record<HomelabStatus, string> = {
  Online: "homelab-status homelab-status--online",
  Internal: "homelab-status homelab-status--internal",
  Planned: "homelab-status homelab-status--planned",
};

function nodeById(id: string) {
  return NODES.find((node) => node.id === id)!;
}

function nodeRadius(tier: HomelabNode["tier"]) {
  if (tier === "host") return 38;
  if (tier === "edge" || tier === "access") return 32;
  return 26;
}

type HomelabTopologyProps = {
  className?: string;
};

export function HomelabTopology({ className = "" }: HomelabTopologyProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const nodeMap = useMemo(() => new Map(NODES.map((node) => [node.id, node])), []);

  const hoveredNode = hoveredId ? nodeMap.get(hoveredId) : null;
  const selectedNode = selectedId ? nodeMap.get(selectedId) : null;

  const handleNodeClick = useCallback((id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  return (
    <div className={`grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] ${className}`}>
      <div className="forgeonix-card forgeonix-panel relative overflow-hidden rounded-sm bg-[#1c1c1c]/90 p-3 backdrop-blur-sm sm:p-4">
        <PanelCorners />
        <div className="forgeonix-panel-accent-line" />
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox="0 0 1000 620"
            className="homelab-topology-svg mx-auto block min-w-[640px] w-full max-w-full"
            role="img"
            aria-label="Animated homelab topology map"
          >
            <defs>
              <filter id="homelab-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="homelab-link-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(220,38,38,0.15)" />
                <stop offset="50%" stopColor="rgba(239,68,68,0.55)" />
                <stop offset="100%" stopColor="rgba(220,38,38,0.15)" />
              </linearGradient>
            </defs>

            {EDGES.map(({ from, to }) => {
              const a = nodeById(from);
              const b = nodeById(to);
              const pathId = `path-${from}-${to}`;
              const d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
              return (
                <g key={pathId}>
                  <path
                    id={pathId}
                    d={d}
                    fill="none"
                    stroke="url(#homelab-link-gradient)"
                    strokeWidth={2}
                    className="homelab-link-pulse"
                    opacity={0.85}
                  />
                  <circle r={3.5} className="homelab-packet" fill="#ef4444">
                    <animateMotion dur="2.8s" repeatCount="indefinite" path={d} />
                  </circle>
                  <circle r={2.5} className="homelab-packet homelab-packet--delayed" fill="#fbbf24">
                    <animateMotion
                      dur="3.6s"
                      repeatCount="indefinite"
                      path={d}
                      begin="1.2s"
                    />
                  </circle>
                </g>
              );
            })}

            {NODES.map((node) => {
              const r = nodeRadius(node.tier);
              const isHovered = hoveredId === node.id;
              const isSelected = selectedId === node.id;
              const isActive = isHovered || isSelected;

              return (
                <g
                  key={node.id}
                  className="homelab-node-group cursor-pointer"
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleNodeClick(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleNodeClick(node.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label}: ${node.purpose}`}
                  aria-pressed={isSelected}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r + 10}
                    className={`homelab-node-halo ${isActive ? "homelab-node-halo--active" : ""}`}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r}
                    className={`homelab-node-core ${isActive ? "homelab-node-core--active" : ""}`}
                    filter={isActive ? "url(#homelab-glow)" : undefined}
                  />
                  <text
                    x={node.x}
                    y={node.y + r + 18}
                    textAnchor="middle"
                    className="homelab-node-label fill-[#e8e8e8] text-[11px] font-semibold sm:text-[12px]"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {hoveredNode && !selectedNode ? (
            <div
              className="homelab-tooltip pointer-events-none absolute z-20 max-w-[220px] rounded-sm border border-[#ef4444]/30 bg-[#141414]/95 px-3 py-2 shadow-lg backdrop-blur-sm"
              style={{
                left: `${(hoveredNode.x / 1000) * 100}%`,
                top: `${(hoveredNode.y / 620) * 100}%`,
                transform: "translate(-50%, calc(-100% - 12px))",
              }}
            >
              <p className="font-mono text-[10px] tracking-widest text-[#ef4444]/90 uppercase">
                {hoveredNode.purpose}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{hoveredNode.label}</p>
            </div>
          ) : null}
        </div>

        <p className="mt-3 text-center font-mono text-[10px] tracking-widest text-[#a0a0a0] uppercase sm:text-xs">
          Hover for quick info · Click a node for details
        </p>
      </div>

      <aside className="min-h-[280px]">
        {selectedNode ? (
          <div className="forgeonix-card forgeonix-panel relative h-full overflow-hidden rounded-sm bg-[#1c1c1c]/90 p-5 backdrop-blur-sm sm:p-6">
            <PanelCorners />
            <div className="forgeonix-panel-accent-line" />
            <p className="font-mono text-[10px] tracking-widest text-[#a0a0a0] uppercase">
              // NODE DETAIL
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">{selectedNode.label}</h3>
            <p className="mt-1 text-sm text-[#a0a0a0]">{selectedNode.purpose}</p>
            <span className={`${STATUS_CLASS[selectedNode.status]} mt-4 inline-flex`}>
              {selectedNode.status}
            </span>
            <p className="mt-4 text-sm leading-relaxed text-[#e0e0e0]">
              {selectedNode.description}
            </p>
            <div className="mt-5 rounded-sm border border-dashed border-white/15 bg-[#141414]/70 p-3">
              <p className="font-mono text-[10px] tracking-widest text-[#6b7280] uppercase">
                Future live data integration
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#a0a0a0]">
                Placeholder for uptime, latency, and resource metrics pulled from monitoring
                endpoints.
              </p>
            </div>
            <button
              type="button"
              className="mt-4 text-xs font-semibold tracking-wide text-[#ef4444]/80 transition hover:text-[#ef4444]"
              onClick={() => setSelectedId(null)}
            >
              Close panel
            </button>
          </div>
        ) : (
          <div className="forgeonix-card forgeonix-panel relative flex h-full min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-sm border border-dashed border-white/10 bg-[#1c1c1c]/60 p-6 text-center backdrop-blur-sm">
            <PanelCorners />
            <p className="font-mono text-xs tracking-widest text-[#a0a0a0] uppercase">
              // SELECT NODE
            </p>
            <p className="mt-3 max-w-xs text-sm text-[#a0a0a0]">
              Click any service in the topology map to inspect purpose, status, and notes.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
