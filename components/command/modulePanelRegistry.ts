import type { ComponentType } from "react";
import { CareerTrackerPanel } from "@/components/command/CareerTrackerPanel";
import { AiMemoryPanel } from "@/components/command/panels/AiMemoryPanel";
import { AutomationsPanel } from "@/components/command/panels/AutomationsPanel";
import { BusinessPanel } from "@/components/command/panels/BusinessPanel";
import { FinancePanel } from "@/components/command/panels/FinancePanel";
import { HealthPanel } from "@/components/command/panels/HealthPanel";
import { InfrastructurePanel } from "@/components/command/panels/InfrastructurePanel";
import { LiftboardPanel } from "@/components/command/panels/LiftboardPanel";
import { ProjectsPanel } from "@/components/command/panels/ProjectsPanel";

type ModulePanelProps = { onClose?: () => void };

/** Maps the 9 OS module ids to their database-backed hub panels. */
export const MODULE_PANELS: Record<string, ComponentType<ModulePanelProps>> = {
  infrastructure: InfrastructurePanel,
  business: BusinessPanel, // CRM + Leads folded in
  liftboard: LiftboardPanel,
  career: CareerTrackerPanel,
  projects: ProjectsPanel,
  "ai-memory": AiMemoryPanel,
  automations: AutomationsPanel,
  finance: FinancePanel,
  health: HealthPanel,
};

export const DB_BACKED_MODULE_IDS = Object.keys(MODULE_PANELS);

export function getModulePanel(moduleId: string | null): ComponentType<ModulePanelProps> | null {
  if (!moduleId) return null;
  return MODULE_PANELS[moduleId] ?? null;
}
