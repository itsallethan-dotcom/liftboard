"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CommandHudOverlay } from "@/components/command/CommandHudOverlay";
import { CommandParticles } from "@/components/command/CommandParticles";
import { ConnectionLines } from "@/components/command/ConnectionLines";
import { CoreNode } from "@/components/command/CoreNode";
import { ModuleNode } from "@/components/command/ModuleNode";
import {
  computeModulePositions,
  CORE_PROTECTION_PADDING,
  getConnectorSide,
  getExpansionOffset,
  measureHubConnections,
  MODULE_CARD_HEIGHT_ESTIMATE,
  MODULE_CARD_WIDTH,
  ORBIT_HOVER_OFFSET,
  ORBIT_SELECTED_OFFSET,
  type HubConnection,
  type ModulePosition,
} from "@/components/command/hubGeometry";
import type { CommandModule, CommandModuleSlot, CoreNodeData } from "@/types/command";

const MODULE_DELAYS = [
  "0.45s",
  "0.5s",
  "0.55s",
  "0.6s",
  "0.65s",
  "0.7s",
] as const;

type CommandStageProps = {
  modules: CommandModule[];
  core: CoreNodeData;
  selectedModuleId: string | null;
  selectedModule: CommandModule | null;
  onModuleSelect: (module: CommandModule) => void;
};

export function CommandStage({
  modules,
  core,
  selectedModuleId,
  selectedModule,
  onModuleSelect,
}: CommandStageProps) {
  const stageRef = useRef<HTMLElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [cardSize, setCardSize] = useState({
    width: MODULE_CARD_WIDTH,
    height: MODULE_CARD_HEIGHT_ESTIMATE,
  });
  const [coreSize, setCoreSize] = useState({ width: 280, height: 200 });
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);
  const [connections, setConnections] = useState<HubConnection[]>([]);

  const modulePositions = useMemo(() => {
    if (stageSize.width <= 0 || stageSize.height <= 0) {
      return null;
    }
    return computeModulePositions(
      stageSize.width,
      stageSize.height,
      cardSize.width,
      cardSize.height,
      coreSize.width,
      coreSize.height,
    );
  }, [stageSize, cardSize, coreSize]);

  const syncConnections = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }
    setConnections(
      measureHubConnections(
        stage,
        modules.map((module) => module.id),
        coreRef.current,
      ),
    );
  }, [modules]);

  const syncLayout = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    setStageSize({ width: stageRect.width, height: stageRect.height });

    if (coreRef.current) {
      const coreRect = coreRef.current.getBoundingClientRect();
      if (coreRect.width > 0 && coreRect.height > 0) {
        setCoreSize({ width: coreRect.width, height: coreRect.height });
      }
    }

    const sampleCard = stage.querySelector(".command-module") as HTMLElement | null;
    if (sampleCard) {
      const cardRect = sampleCard.getBoundingClientRect();
      if (cardRect.width > 0 && cardRect.height > 0) {
        setCardSize({ width: cardRect.width, height: cardRect.height });
      }
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(syncConnections);
    });
  }, [syncConnections]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    syncLayout();

    const observer = new ResizeObserver(syncLayout);
    observer.observe(stage);
    if (coreRef.current) {
      observer.observe(coreRef.current);
    }
    window.addEventListener("resize", syncLayout);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncLayout);
    };
  }, [syncLayout]);

  useLayoutEffect(() => {
    syncConnections();
    const afterMotion = window.setTimeout(syncConnections, 400);
    return () => window.clearTimeout(afterMotion);
  }, [
    syncConnections,
    modulePositions,
    selectedModuleId,
    selectedModule,
    hoveredModuleId,
  ]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || connections.length === 0) {
      return;
    }

    const stageRect = stage.getBoundingClientRect();

    for (const connection of connections) {
      const moduleEl = stage.querySelector(
        `[data-module-id="${connection.id}"]`,
      ) as HTMLElement | null;
      const nodeEl = moduleEl?.querySelector(
        "[data-connection-node]",
      ) as HTMLElement | null;
      if (!moduleEl || !nodeEl) {
        continue;
      }

      const cardRect = moduleEl.getBoundingClientRect();
      const anchorX = stageRect.left + (connection.x1 / 100) * stageRect.width;
      const anchorY = stageRect.top + (connection.y1 / 100) * stageRect.height;

      nodeEl.style.left = `${anchorX - cardRect.left}px`;
      nodeEl.style.top = `${anchorY - cardRect.top}px`;
      nodeEl.style.right = "auto";
      nodeEl.style.bottom = "auto";
      nodeEl.style.transform = "translate(-50%, -50%)";
    }
  }, [connections, modulePositions, selectedModuleId, hoveredModuleId]);

  const getPosition = (slot: CommandModuleSlot): ModulePosition | undefined =>
    modulePositions?.[slot];

  const getExpandOffset = (module: CommandModule) => {
    const isSelected = module.id === selectedModuleId;
    const isHovered = module.id === hoveredModuleId;
    if (!isSelected && !isHovered) {
      return { dx: 0, dy: 0 };
    }
    const amount = isSelected ? ORBIT_SELECTED_OFFSET : ORBIT_HOVER_OFFSET;
    return getExpansionOffset(module.slot, amount);
  };

  const isExpanded = (moduleId: string) =>
    moduleId === selectedModuleId || moduleId === hoveredModuleId;

  return (
    <section
      ref={stageRef}
      className="command-stage"
      aria-label="Systems bridge"
      data-selected-module={selectedModuleId ?? undefined}
      data-hovered-module={hoveredModuleId ?? undefined}
    >
      <CommandParticles />
      <CommandHudOverlay />

      <ConnectionLines
        connections={connections}
        selectedModuleId={selectedModuleId}
        hoveredModuleId={hoveredModuleId}
      />

      <div
        className="command-stage__core-shield"
        style={{
          width: coreSize.width + CORE_PROTECTION_PADDING * 2,
          height: coreSize.height + CORE_PROTECTION_PADDING * 2,
        }}
        aria-hidden
      />

      <div className="command-stage__anchor">
        <div className="command-stage__depth" aria-hidden />
        <div className="command-stage__spokes" aria-hidden />
        <div className="command-stage__glow" aria-hidden />
        <CoreNode ref={coreRef} data={core} selectedModule={selectedModule} />
      </div>

      {modules.map((module, index) => (
        <ModuleNode
          key={module.id}
          module={module}
          position={getPosition(module.slot)}
          connectorSide={getConnectorSide(module.slot)}
          expansion={getExpandOffset(module)}
          expanded={isExpanded(module.id)}
          delay={MODULE_DELAYS[index] ?? "0.5s"}
          selected={module.id === selectedModuleId}
          onSelect={onModuleSelect}
          onHoverChange={(hovered) =>
            setHoveredModuleId(hovered ? module.id : null)
          }
          visible={Boolean(getPosition(module.slot))}
        />
      ))}
    </section>
  );
}

/** @deprecated Use CommandStage */
export const CommandHub = CommandStage;
