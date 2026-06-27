export type CommandModuleStatus = "online" | "standby" | "dev" | "offline";

/**
 * Radial stage positions around the core. The OS runs a 9-card structure, so
 * slots are evenly distributed points on the ring (s1 = top, clockwise).
 */
export type CommandModuleSlot =
  | "s1"
  | "s2"
  | "s3"
  | "s4"
  | "s5"
  | "s6"
  | "s7"
  | "s8"
  | "s9";

export type ModuleDetailField = {
  label: string;
  value: string;
  tone?: "ok" | "warn" | "neutral" | "dev";
};

export type CommandModule = {
  id: string;
  label: string;
  subtitle: string;
  status: CommandModuleStatus;
  slot: CommandModuleSlot;
  /** Populated at runtime from /api/os/summary — not hardcoded in mock data. */
  detail?: ModuleDetailField[];
};

export type TerminalLevel = "info" | "warn" | "success" | "system";

export type TerminalEntry = {
  id: string;
  timestamp: string;
  level: TerminalLevel;
  message: string;
};

export type DockItem = {
  id: string;
  label: string;
  shortLabel: string;
  active?: boolean;
  href?: string;
};

export type CommandNavLink = {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
};

export type CoreNodeData = {
  title: string;
  subtitle: string;
  version: string;
  uptime: string;
  load: string;
  /** Real "online/total" node count, injected at runtime from module_status. */
  nodes?: string;
};

export type SystemMetric = {
  id: string;
  label: string;
  value: string;
};

export type BootSequenceData = {
  version: string;
  lines: string[];
  durationMs: number;
};

export type CommandShellData = {
  core: CoreNodeData;
  modules: CommandModule[];
  terminal: TerminalEntry[];
  dock: DockItem[];
  nav: CommandNavLink[];
  metrics: SystemMetric[];
  boot: BootSequenceData;
};
