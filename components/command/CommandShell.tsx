"use client";

import "@/components/command/command-interactive.css";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiChatPanel } from "@/components/command/AiChatPanel";
import { BootOverlay } from "@/components/command/BootOverlay";
import { getModulePanel, DB_BACKED_MODULE_IDS } from "@/components/command/modulePanelRegistry";
import { CommandCardMotion } from "@/components/command/CommandCardMotion";
import { CommandCursor } from "@/components/command/CommandCursor";
import { CommandParallax } from "@/components/command/CommandParallax";
import { CommandPressFX } from "@/components/command/CommandPressFX";
import { CommandReactor } from "@/components/command/CommandReactor";
import { CommandStage } from "@/components/command/CommandStage";
import { CommandView, type CommandViewId } from "@/components/command/CommandView";
import { GlobalSearch } from "@/components/command/GlobalSearch";
import { ModuleBusPanel } from "@/components/command/ModuleBusPanel";
import { NetworkMapPanel } from "@/components/command/NetworkMapPanel";
import { NotificationCenter } from "@/components/command/NotificationCenter";
import { QuickActionsPanel } from "@/components/command/QuickActionsPanel";
import { StageHudPanels } from "@/components/command/StageHudPanels";
import { SystemDock } from "@/components/command/SystemDock";
import { TerminalFeed } from "@/components/command/TerminalFeed";
import type { CommandModule, CommandShellData, ModuleDetailField, TerminalEntry } from "@/types/command";
import type { CommandLogRow, LogLevel } from "@/types/command-core";

function formatTimestamp(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

/** command_logs levels → terminal display levels. */
function mapLogLevel(level: LogLevel): TerminalEntry["level"] {
  switch (level) {
    case "success":
      return "success";
    case "warn":
    case "error":
      return "warn";
    case "system":
      return "system";
    default:
      return "info";
  }
}

type CommandShellProps = {
  data: CommandShellData;
};

export function CommandShell({ data }: CommandShellProps) {
  const [bootComplete, setBootComplete] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>(data.terminal);
  const [moduleDetails, setModuleDetails] = useState<Record<string, ModuleDetailField[]>>({});
  const [clock, setClock] = useState("SYS --:--:-- UTC");
  const [view, setView] = useState<CommandViewId>("bridge");

  // Stable identity so BootOverlay's run-once timer is never restarted.
  const handleBootComplete = useCallback(() => setBootComplete(true), []);

  useEffect(() => {
    if (!bootComplete) return;
    void fetch("/api/os/summary")
      .then((res) => res.json())
      .then((json) => {
        if (json.modules) setModuleDetails(json.modules as Record<string, ModuleDetailField[]>);
      })
      .catch(() => {
        /* keep layout-only fallbacks */
      });
  }, [bootComplete]);

  // Real terminal feed from command_logs (replaces hardcoded boot text once live).
  useEffect(() => {
    if (!bootComplete) return;
    void fetch("/api/os/logs?limit=20")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json.logs) && json.logs.length > 0) {
          setTerminalEntries(
            (json.logs as CommandLogRow[]).map((log) => ({
              id: log.id,
              timestamp: new Date(log.created_at).toLocaleTimeString("en-GB", { hour12: false }),
              level: mapLogLevel(log.level),
              message: log.message,
            })),
          );
        }
      })
      .catch(() => {
        /* keep boot fallback lines */
      });
  }, [bootComplete]);

  // Live UTC clock (was a hardcoded timestamp). Only runs after boot so it can't
  // re-render the shell during the boot sequence.
  useEffect(() => {
    if (!bootComplete) return;
    const tick = () => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      setClock(`SYS ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [bootComplete]);

  const modules = useMemo(
    () =>
      data.modules.map((module) => ({
        ...module,
        detail:
          moduleDetails[module.id] ??
          module.detail ??
          [{ label: "Memory", value: "Syncing…", tone: "neutral" as const }],
      })),
    [data.modules, moduleDetails],
  );

  // Real node count for the core readout (online vs total) — no longer hardcoded.
  const coreData = useMemo(() => {
    const online = modules.filter((m) => m.status === "online").length;
    return { ...data.core, nodes: `${online}/${modules.length}` };
  }, [data.core, modules]);

  // Inject the real node count into the dock/HUD metrics (NODES is the one real value).
  const metrics = useMemo(
    () =>
      data.metrics.map((m) =>
        m.id === "nodes" ? { ...m, value: coreData.nodes ?? m.value } : m,
      ),
    [data.metrics, coreData],
  );

  const selectedModule =
    modules.find((module) => module.id === selectedModuleId) ?? null;

  const ActivePanel = getModulePanel(selectedModuleId);

  const handleModuleSelect = useCallback((module: CommandModule) => {
    setSelectedModuleId(module.id);
    setTerminalEntries((entries) => [
      ...entries,
      {
        id: `sel-${module.id}-${Date.now()}`,
        timestamp: formatTimestamp(),
        level: "info",
        message: `[MODULE] ${module.label} selected`,
      },
    ]);
  }, []);

  // Open a module from the directory view → show its panel on the bridge.
  const openModuleFromDirectory = useCallback((id: string) => {
    setSelectedModuleId(id);
    setView("bridge");
  }, []);

  // Quick Launch tiles (StageHudPanels).
  const handleLaunch = useCallback((id: string) => {
    if (id === "infra") {
      setView("bridge");
      setSelectedModuleId("infrastructure");
    } else if (id === "term") {
      setView("terminal");
    } else if (id === "net") {
      setView("network");
    } else if (id === "cfg") {
      setView("config");
    }
  }, []);

  // System dock items.
  const handleDock = useCallback((id: string) => {
    const map: Record<string, CommandViewId> = {
      home: "bridge",
      modules: "modules",
      terminal: "terminal",
      network: "network",
      settings: "config",
    };
    if (map[id]) setView(map[id]);
  }, []);

  return (
    <div
      className={`forgeonix-os ${bootComplete ? "forgeonix-os--ready" : "forgeonix-os--booting"}`}
      data-view={view}
    >
      {!bootComplete ? (
        <BootOverlay boot={data.boot} onComplete={handleBootComplete} />
      ) : null}

      <div className="command-bg" aria-hidden>
        <div className="command-bg__aurora" />
        <div className="command-bg__grid" />
        <div className="command-bg__radial" />
        <div className="command-bg__sweep" />
        <div className="command-bg__scanlines" />
        <div className="command-bg__vignette" />
      </div>

      {/* V2-A — carried specular light (the room reacts; cursor-tracked, motion-allowed only). */}
      <div className="command-bg__specular" aria-hidden />

      {/* Phase 2 — decorative cursor parallax (desktop, motion-allowed only). */}
      <CommandParallax />
      {/* Phase 3 — reactor heartbeat + travelling light (motion-allowed only). */}
      <CommandReactor />
      {/* Phase 4 — instrument-bay activation feel (desktop, motion-allowed only). */}
      <CommandCardMotion />
      {/* Phase 7 — press feedback on primary controls (motion-allowed only). */}
      <CommandPressFX />
      {/* V3-5 — magnetic reticle cursor (desktop, motion-allowed, input-safe). */}
      <CommandCursor />

      <header className="command-nav command-boot-item" style={{ animationDelay: "0.1s" }}>
        <div className="command-nav__brand">
          <Image
            src="/forgeonix-logo-transparent.png"
            alt=""
            width={28}
            height={28}
            className="command-nav__logo"
            priority
          />
          <div>
            <p className="command-nav__title">FORGEONIX OS</p>
            <p className="command-nav__subtitle">Command Center · Zone Alpha</p>
          </div>
        </div>

        <nav className="command-nav__links" aria-label="Bridge navigation">
          {data.nav.map((link) =>
            link.href ? (
              <Link
                key={link.id}
                href={link.href}
                className={`command-nav__link ${link.active ? "command-nav__link--active" : ""}`}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.id}
                type="button"
                className={`command-nav__link ${view === link.id ? "command-nav__link--active" : ""}`}
                onClick={() => setView(link.id as CommandViewId)}
              >
                {link.label}
              </button>
            ),
          )}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <GlobalSearch />
          <NotificationCenter />
          <div className="command-nav__status">
            <span className="command-nav__pulse" aria-hidden />
            <span className="command-nav__status-text">BRIDGE ONLINE</span>
            <span className="command-nav__clock">{clock}</span>
          </div>
        </div>
      </header>

      <main
        className={`command-main command-main--bridge command-boot-item ${bootComplete ? "command-main--visible" : ""} ${view !== "bridge" ? "command-main--viewing" : ""}`}
        style={{ animationDelay: "0.2s" }}
      >
        <div className="command-workspace">
          <ModuleBusPanel
            modules={modules}
            selectedModuleId={selectedModuleId}
            selectedModule={selectedModule}
            dbBackedModuleIds={DB_BACKED_MODULE_IDS}
            onSelect={handleModuleSelect}
          />

          <div className="command-rail command-workspace__rail">
            <TerminalFeed entries={terminalEntries} />
            <QuickActionsPanel />
            <AiChatPanel />
            <NetworkMapPanel />
          </div>

          <CommandStage
            modules={modules}
            core={coreData}
            selectedModuleId={selectedModuleId}
            selectedModule={selectedModule}
            onModuleSelect={handleModuleSelect}
          />

          {ActivePanel ? (
            <ActivePanel onClose={() => setSelectedModuleId(null)} />
          ) : null}
        </div>

        <StageHudPanels metrics={metrics} onLaunch={handleLaunch} />

        {view !== "bridge" ? (
          <CommandView
            view={view}
            modules={modules}
            metrics={metrics}
            onClose={() => setView("bridge")}
            onSelectModule={openModuleFromDirectory}
          />
        ) : null}
      </main>

      <SystemDock items={data.dock} metrics={metrics} onSelect={handleDock} />
    </div>
  );
}
