"use client";

import "@/components/command/command-interactive.css";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiChatPanel } from "@/components/command/AiChatPanel";
import { BootOverlay } from "@/components/command/BootOverlay";
import { getModulePanel, DB_BACKED_MODULE_IDS } from "@/components/command/modulePanelRegistry";
import { CommandStage } from "@/components/command/CommandStage";
import { ModuleBusPanel } from "@/components/command/ModuleBusPanel";
import { NetworkMapPanel } from "@/components/command/NetworkMapPanel";
import { StageHudPanels } from "@/components/command/StageHudPanels";
import { SystemDock } from "@/components/command/SystemDock";
import { TerminalFeed } from "@/components/command/TerminalFeed";
import type { CommandModule, CommandShellData, ModuleDetailField, TerminalEntry } from "@/types/command";

function formatTimestamp(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

type CommandShellProps = {
  data: CommandShellData;
};

export function CommandShell({ data }: CommandShellProps) {
  const [bootComplete, setBootComplete] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>(data.terminal);
  const [moduleDetails, setModuleDetails] = useState<Record<string, ModuleDetailField[]>>({});

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

  return (
    <div className={`forgeonix-os ${bootComplete ? "forgeonix-os--ready" : "forgeonix-os--booting"}`}>
      {!bootComplete ? (
        <BootOverlay boot={data.boot} onComplete={() => setBootComplete(true)} />
      ) : null}

      <div className="command-bg" aria-hidden>
        <div className="command-bg__grid" />
        <div className="command-bg__radial" />
        <div className="command-bg__scanlines" />
        <div className="command-bg__vignette" />
      </div>

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
                className={`command-nav__link ${link.active ? "command-nav__link--active" : ""}`}
              >
                {link.label}
              </button>
            ),
          )}
        </nav>

        <div className="command-nav__status">
          <span className="command-nav__pulse" aria-hidden />
          <span className="command-nav__status-text">BRIDGE ONLINE</span>
          <span className="command-nav__clock">SYS 14:02:40 UTC</span>
        </div>
      </header>

      <main
        className={`command-main command-main--bridge command-boot-item ${bootComplete ? "command-main--visible" : ""}`}
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
            <AiChatPanel />
            <NetworkMapPanel />
          </div>

          <CommandStage
            modules={modules}
            core={data.core}
            selectedModuleId={selectedModuleId}
            selectedModule={selectedModule}
            onModuleSelect={handleModuleSelect}
          />

          {ActivePanel ? (
            <ActivePanel onClose={() => setSelectedModuleId(null)} />
          ) : null}
        </div>

        <StageHudPanels metrics={data.metrics} />
      </main>

      <SystemDock items={data.dock} metrics={data.metrics} />
    </div>
  );
}
