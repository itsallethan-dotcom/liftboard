export type CommandModuleStatus = "online" | "standby" | "dev" | "offline";

/** Stage positions around the core — left column, right column, top anchor. */
export type CommandModuleSlot =
  | "top"
  | "left-upper"
  | "left-lower"
  | "right-upper"
  | "right-middle"
  | "right-lower";

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
  detail: ModuleDetailField[];
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
