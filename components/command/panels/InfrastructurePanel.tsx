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
import { buildTopology } from "@/lib/os/topology";
import Link from "next/link";
import {
  ASSET_KINDS,
  BACKUP_HEALTHS,
  CONTAINER_STATUSES,
  INCIDENT_SEVERITIES,
  SERVICE_STATUSES,
  UPGRADE_STATUSES,
  type InfrastructureAsset,
  type InfrastructureDashboard,
  type TopologyNode,
} from "@/types/forgeonix-os";
import { useState } from "react";

type InfrastructurePanelProps = { onClose?: () => void };

const ACCENT = "#ff7a36";
const BORDER = "rgba(255, 122, 54, 0.25)";
const TABS = ["Topology", "Services", "Containers", "Backups", "Incidents", "Roadmap"] as const;
type Tab = (typeof TABS)[number];

const STATUS_COLOR: Record<string, string> = {
  online: "#4ade80",
  running: "#4ade80",
  ok: "#4ade80",
  degraded: "#fbbf24",
  standby: "#fbbf24",
  stale: "#fbbf24",
  paused: "#fbbf24",
  restarting: "#fbbf24",
  offline: "#f87171",
  stopped: "#f87171",
  exited: "#f87171",
  failing: "#f87171",
};

function dot(status: string) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: STATUS_COLOR[status] ?? "#8aa",
        marginRight: 6,
        flexShrink: 0,
      }}
    />
  );
}

const badge: React.CSSProperties = {
  display: "inline-block",
  color: ACCENT,
  font: "9px ui-monospace, monospace",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  border: `1px solid ${BORDER}`,
  borderRadius: 3,
  padding: "1px 5px",
  marginRight: 4,
};

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
  padding: "5px 0",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const miniBtn: React.CSSProperties = {
  background: "rgba(8,14,20,0.85)",
  border: `1px solid ${BORDER}`,
  borderRadius: 3,
  color: "#cfeff5",
  cursor: "pointer",
  font: "10px ui-monospace, monospace",
  padding: "2px 6px",
};

const mono = (size = 12): React.CSSProperties => ({
  color: "#dadfe2",
  font: `${size}px ui-monospace, monospace`,
});

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

export function InfrastructurePanel({ onClose }: InfrastructurePanelProps) {
  const { data, loading, error, reload, setError } =
    useHubFetch<InfrastructureDashboard>("/api/os/infrastructure");
  const [tab, setTab] = useState<Tab>("Topology");

  const run = async (fn: () => Promise<void>) => {
    setError(null);
    try {
      await fn();
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    }
  };

  const openIncidents =
    data?.incidents.filter((i) => i.status === "open" || i.status === "investigating").length ?? 0;

  return (
    <ModuleHubShell
      label="// INFRASTRUCTURE"
      title="Homelab Source of Truth"
      subtitle="Topology · services · containers · backups"
      onClose={onClose}
      loading={loading}
      error={error}
    >
      {data ? (
        <>
          <HubSection label="Overview">
            <HubStats
              items={[
                { label: "Assets", value: String(data.assets.length) },
                { label: "Containers", value: String(data.containers.length) },
                { label: "Services", value: String(data.services.length) },
                { label: "Incidents", value: String(openIncidents), warn: openIncidents > 0 },
              ]}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Link href="/command/infrastructure/assets" style={{ ...mono(11), color: ACCENT }}>
                Assets →
              </Link>
              <Link href="/command/infrastructure/roadmap" style={{ ...mono(11), color: ACCENT }}>
                Roadmap →
              </Link>
              <Link href="/command/infrastructure/docs" style={{ ...mono(11), color: ACCENT }}>
                Docs →
              </Link>
            </div>
          </HubSection>

          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "8px 0" }}>
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  ...miniBtn,
                  background: tab === t ? "rgba(255,122,54,0.15)" : "rgba(8,14,20,0.85)",
                  color: tab === t ? ACCENT : "#cfeff5",
                  font: "11px ui-monospace, monospace",
                  padding: "5px 9px",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Topology" ? <TopologyTab data={data} run={run} /> : null}
          {tab === "Services" ? <ServicesTab data={data} run={run} /> : null}
          {tab === "Containers" ? <ContainersTab data={data} run={run} /> : null}
          {tab === "Backups" ? <BackupsTab data={data} run={run} /> : null}
          {tab === "Incidents" ? <IncidentsTab data={data} run={run} /> : null}
          {tab === "Roadmap" ? <RoadmapTab data={data} run={run} /> : null}
        </>
      ) : null}
    </ModuleHubShell>
  );
}

/* --------------------------------- Tabs ----------------------------------- */

function TopologyTab({ data, run }: { data: InfrastructureDashboard; run: RunFn }) {
  const tree = buildTopology(data);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<string>("host");
  const [parentId, setParentId] = useState("");
  const [ip, setIp] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await run(async () => {
      await mutate("/api/os/infrastructure/assets", "POST", {
        name,
        kind,
        parent_id: parentId || null,
        ip_address: ip || null,
      });
      setName(""); setKind("host"); setParentId(""); setIp(""); setOpen(false);
    });
  };

  return (
    <HubSection label="Host → VM → Container / Service">
      {tree.length === 0 ? (
        <HubMuted>No assets yet — add a host below.</HubMuted>
      ) : (
        tree.map((node) => <TopologyNodeView key={node.asset.id} node={node} depth={0} />)
      )}
      <HubBtn onClick={() => setOpen(!open)}>{open ? "Cancel" : "+ Add host / VM"}</HubBtn>
      {open ? (
        <HubForm title="New asset" onSubmit={submit}>
          <HubField label="Name"><input required value={name} onChange={(e) => setName(e.target.value)} /></HubField>
          <HubField label="Kind">
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              {ASSET_KINDS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </HubField>
          <HubField label="Parent (for VMs/containers' host)">
            <AssetSelect assets={data.assets} value={parentId} onChange={setParentId} />
          </HubField>
          <HubField label="IP"><input value={ip} onChange={(e) => setIp(e.target.value)} /></HubField>
        </HubForm>
      ) : null}
    </HubSection>
  );
}

function TopologyNodeView({ node, depth }: { node: TopologyNode; depth: number }) {
  const a = node.asset;
  return (
    <div style={{ marginLeft: depth * 12, marginTop: 6 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {dot(a.status)}
        <span style={{ ...mono(12), fontWeight: 600, color: "#e6feff" }}>{a.name}</span>
        <span style={{ ...badge, marginLeft: 6 }}>{a.kind}</span>
        {a.ip_address ? <span style={mono(10)}>&nbsp;{a.ip_address}</span> : null}
        {a.cpu_cores || a.ram_mb ? (
          <span style={{ ...mono(10), color: "#8aa" }}>
            &nbsp;· {a.cpu_cores ?? "?"}c/{a.ram_mb ? Math.round(a.ram_mb / 1024) : "?"}GB
          </span>
        ) : null}
      </div>

      {node.containers.map((c) => (
        <div key={c.id} style={{ marginLeft: 18, display: "flex", alignItems: "center" }}>
          {dot(c.status)}
          <span style={mono(11)}>{c.name}</span>
          {c.image ? <span style={{ ...mono(9), color: "#8aa" }}>&nbsp;{c.image}</span> : null}
          {c.ports ? <span style={{ ...badge, marginLeft: 6 }}>{c.ports}</span> : null}
        </div>
      ))}

      {node.services.map((s) => (
        <div key={s.id} style={{ marginLeft: 18, display: "flex", alignItems: "center" }}>
          {dot(s.status)}
          <span style={mono(11)}>{s.name}</span>
          {s.ip_address || s.port ? (
            <span style={{ ...mono(9), color: "#8aa" }}>
              &nbsp;{s.ip_address ?? ""}{s.port ? `:${s.port}` : ""}
            </span>
          ) : null}
        </div>
      ))}

      {node.children.map((child) => (
        <TopologyNodeView key={child.asset.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

type RunFn = (fn: () => Promise<void>) => Promise<void>;

function AssetSelect({
  assets,
  value,
  onChange,
}: {
  assets: InfrastructureAsset[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">(no host/VM)</option>
      {assets.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name} ({a.kind})
        </option>
      ))}
    </select>
  );
}

function ServicesTab({ data, run }: { data: InfrastructureDashboard; run: RunFn }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [assetId, setAssetId] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [url, setUrl] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await run(async () => {
      await mutate("/api/os/infrastructure/services", "POST", {
        name,
        asset_id: assetId || null,
        ip_address: ip || null,
        port: port ? Number(port) : null,
        url: url || null,
      });
      setName(""); setAssetId(""); setIp(""); setPort(""); setUrl(""); setOpen(false);
    });
  };

  return (
    <HubSection label="Services">
      {data.services.length === 0 ? (
        <HubMuted>No services.</HubMuted>
      ) : (
        data.services.map((s) => (
          <div key={s.id} style={row}>
            <span style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
              {dot(s.status)}
              <span style={mono()}>{s.name}</span>
              <span style={{ ...mono(10), color: "#8aa" }}>
                &nbsp;{s.ip_address ?? ""}{s.port ? `:${s.port}` : ""}
              </span>
            </span>
            <span style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              <select
                value={s.status}
                onChange={(e) =>
                  run(() =>
                    mutate("/api/os/infrastructure/services", "PATCH", { id: s.id, status: e.target.value }),
                  )
                }
                aria-label="Service status"
                style={miniBtn}
              >
                {SERVICE_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <button
                type="button"
                style={miniBtn}
                title="Delete service"
                aria-label={`Delete service ${s.name}`}
                onClick={() => run(() => mutate(`/api/os/infrastructure/services?id=${s.id}`, "DELETE"))}
              >
                ✕
              </button>
            </span>
          </div>
        ))
      )}
      <HubBtn onClick={() => setOpen(!open)}>{open ? "Cancel" : "+ Add service"}</HubBtn>
      {open ? (
        <HubForm title="New service" onSubmit={submit}>
          <HubField label="Name"><input required value={name} onChange={(e) => setName(e.target.value)} /></HubField>
          <HubField label="Runs on"><AssetSelect assets={data.assets} value={assetId} onChange={setAssetId} /></HubField>
          <HubField label="IP"><input value={ip} onChange={(e) => setIp(e.target.value)} /></HubField>
          <HubField label="Port"><input value={port} onChange={(e) => setPort(e.target.value)} /></HubField>
          <HubField label="URL"><input value={url} onChange={(e) => setUrl(e.target.value)} /></HubField>
        </HubForm>
      ) : null}
    </HubSection>
  );
}

function ContainersTab({ data, run }: { data: InfrastructureDashboard; run: RunFn }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [assetId, setAssetId] = useState("");
  const [image, setImage] = useState("");
  const [ports, setPorts] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await run(async () => {
      await mutate("/api/os/infrastructure/containers", "POST", {
        name,
        asset_id: assetId || null,
        image: image || null,
        ports: ports || null,
      });
      setName(""); setAssetId(""); setImage(""); setPorts(""); setOpen(false);
    });
  };

  return (
    <HubSection label="Containers">
      {data.containers.length === 0 ? (
        <HubMuted>No containers.</HubMuted>
      ) : (
        data.containers.map((c) => (
          <div key={c.id} style={row}>
            <span style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
              {dot(c.status)}
              <span style={mono()}>{c.name}</span>
              {c.image ? <span style={{ ...mono(10), color: "#8aa" }}>&nbsp;{c.image}</span> : null}
            </span>
            <span style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              <select
                value={c.status}
                onChange={(e) =>
                  run(() =>
                    mutate("/api/os/infrastructure/containers", "PATCH", { id: c.id, status: e.target.value }),
                  )
                }
                aria-label="Container status"
                style={miniBtn}
              >
                {CONTAINER_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <button
                type="button"
                style={miniBtn}
                title="Delete container"
                aria-label={`Delete container ${c.name}`}
                onClick={() => run(() => mutate(`/api/os/infrastructure/containers?id=${c.id}`, "DELETE"))}
              >
                ✕
              </button>
            </span>
          </div>
        ))
      )}
      <HubBtn onClick={() => setOpen(!open)}>{open ? "Cancel" : "+ Add container"}</HubBtn>
      {open ? (
        <HubForm title="New container" onSubmit={submit}>
          <HubField label="Name"><input required value={name} onChange={(e) => setName(e.target.value)} /></HubField>
          <HubField label="Runs on"><AssetSelect assets={data.assets} value={assetId} onChange={setAssetId} /></HubField>
          <HubField label="Image"><input value={image} onChange={(e) => setImage(e.target.value)} /></HubField>
          <HubField label="Ports (e.g. 8080:80)"><input value={ports} onChange={(e) => setPorts(e.target.value)} /></HubField>
        </HubForm>
      ) : null}
    </HubSection>
  );
}

function BackupsTab({ data, run }: { data: InfrastructureDashboard; run: RunFn }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [method, setMethod] = useState("");
  const [schedule, setSchedule] = useState("");
  const [health, setHealth] = useState<string>("none");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await run(async () => {
      await mutate("/api/os/infrastructure/backups", "POST", {
        name,
        method: method || null,
        schedule: schedule || null,
        health,
      });
      setName(""); setMethod(""); setSchedule(""); setHealth("none"); setOpen(false);
    });
  };

  return (
    <HubSection label="Backups">
      {data.backups.length === 0 ? (
        <HubMuted>No backups configured.</HubMuted>
      ) : (
        data.backups.map((b) => (
          <div key={b.id} style={row}>
            <span style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
              {dot(b.health)}
              <span style={mono()}>{b.name}</span>
              <span style={{ ...mono(10), color: "#8aa" }}>
                &nbsp;{b.method ?? ""} {b.schedule ?? ""}
              </span>
            </span>
            <button
              type="button"
              style={miniBtn}
              title="Delete backup"
              aria-label={`Delete backup ${b.name}`}
              onClick={() => run(() => mutate(`/api/os/infrastructure/backups?id=${b.id}`, "DELETE"))}
            >
              ✕
            </button>
          </div>
        ))
      )}
      <HubBtn onClick={() => setOpen(!open)}>{open ? "Cancel" : "+ Add backup"}</HubBtn>
      {open ? (
        <HubForm title="New backup" onSubmit={submit}>
          <HubField label="Name"><input required value={name} onChange={(e) => setName(e.target.value)} /></HubField>
          <HubField label="Method"><input value={method} onChange={(e) => setMethod(e.target.value)} /></HubField>
          <HubField label="Schedule"><input value={schedule} onChange={(e) => setSchedule(e.target.value)} /></HubField>
          <HubField label="Health">
            <select value={health} onChange={(e) => setHealth(e.target.value)}>
              {BACKUP_HEALTHS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </HubField>
        </HubForm>
      ) : null}
    </HubSection>
  );
}

function IncidentsTab({ data, run }: { data: InfrastructureDashboard; run: RunFn }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<string>("low");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await run(async () => {
      await mutate("/api/os/infrastructure/incidents", "POST", { title, severity });
      setTitle(""); setSeverity("low"); setOpen(false);
    });
  };

  return (
    <>
      <HubSection label="Incidents">
        {data.incidents.length === 0 ? (
          <HubMuted>No incidents.</HubMuted>
        ) : (
          data.incidents.map((i) => (
            <div key={i.id} style={row}>
              <span style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                {dot(i.status === "resolved" || i.status === "closed" ? "online" : "offline")}
                <span style={mono()}>{i.title}</span>
                <span style={{ ...badge, marginLeft: 6 }}>{i.severity}</span>
              </span>
              {i.status !== "resolved" && i.status !== "closed" ? (
                <button
                  type="button"
                  style={miniBtn}
                  onClick={() => run(() => mutate("/api/os/infrastructure/incidents", "PATCH", { id: i.id }))}
                >
                  Resolve
                </button>
              ) : (
                <span style={{ ...badge, color: "#4ade80" }}>{i.status}</span>
              )}
            </div>
          ))
        )}
        <HubBtn onClick={() => setOpen(!open)}>{open ? "Cancel" : "+ Log incident"}</HubBtn>
        {open ? (
          <HubForm title="New incident" onSubmit={submit}>
            <HubField label="Title"><input required value={title} onChange={(e) => setTitle(e.target.value)} /></HubField>
            <HubField label="Severity">
              <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                {INCIDENT_SEVERITIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </HubField>
          </HubForm>
        ) : null}
      </HubSection>

      <HubSection label="Status History">
        {data.statusEvents.length === 0 ? (
          <HubMuted>No status events recorded.</HubMuted>
        ) : (
          data.statusEvents.slice(0, 12).map((ev) => (
            <div key={ev.id} style={{ ...mono(10), color: "#9bb", padding: "2px 0" }}>
              {new Date(ev.created_at).toLocaleString("en-GB", { hour12: false })} ·{" "}
              {ev.target_type} → {ev.status}
            </div>
          ))
        )}
      </HubSection>
    </>
  );
}

function RoadmapTab({ data, run }: { data: InfrastructureDashboard; run: RunFn }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<string>("planned");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await run(async () => {
      await mutate("/api/os/infrastructure/upgrades", "POST", { title, status });
      setTitle(""); setStatus("planned"); setOpen(false);
    });
  };

  return (
    <HubSection label="Planned Upgrades">
      {data.upgrades.length === 0 ? (
        <HubMuted>No planned upgrades.</HubMuted>
      ) : (
        data.upgrades.map((u) => (
          <div key={u.id} style={row}>
            <span style={mono()}>{u.title}</span>
            <span style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
              <span style={badge}>{u.status.replace(/_/g, " ")}</span>
              <button
                type="button"
                style={miniBtn}
                title="Delete upgrade"
                aria-label={`Delete upgrade ${u.title}`}
                onClick={() => run(() => mutate(`/api/os/infrastructure/upgrades?id=${u.id}`, "DELETE"))}
              >
                ✕
              </button>
            </span>
          </div>
        ))
      )}
      <HubBtn onClick={() => setOpen(!open)}>{open ? "Cancel" : "+ Add upgrade"}</HubBtn>
      {open ? (
        <HubForm title="New upgrade" onSubmit={submit}>
          <HubField label="Title"><input required value={title} onChange={(e) => setTitle(e.target.value)} /></HubField>
          <HubField label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {UPGRADE_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </HubField>
        </HubForm>
      ) : null}
    </HubSection>
  );
}
