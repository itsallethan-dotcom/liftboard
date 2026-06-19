import type { ComponentType } from "react";
import { CareerTrackerPanel } from "@/components/command/CareerTrackerPanel";
import { BusinessPanel } from "@/components/command/panels/BusinessPanel";
import { InfrastructurePanel } from "@/components/command/panels/InfrastructurePanel";
import { LeadsPanel } from "@/components/command/panels/LeadsPanel";
import { LiftboardPanel } from "@/components/command/panels/LiftboardPanel";
import { NotesPanel } from "@/components/command/panels/NotesPanel";

type ModulePanelProps = { onClose?: () => void };

/** Maps hero module ids to database-backed hub panels. */
export const MODULE_PANELS: Record<string, ComponentType<ModulePanelProps>> = {
  infrastructure: InfrastructurePanel,
  business: BusinessPanel,
  leads: LeadsPanel,
  career: CareerTrackerPanel,
  "ai-ops": NotesPanel,
  liftboard: LiftboardPanel,
};

export const DB_BACKED_MODULE_IDS = Object.keys(MODULE_PANELS);

export function getModulePanel(moduleId: string | null): ComponentType<ModulePanelProps> | null {
  if (!moduleId) return null;
  return MODULE_PANELS[moduleId] ?? null;
}
