import type { CommandShellData } from "@/types/command";

/** Layout-only shell data. Module detail stats load from Supabase via /api/os/summary. */
export const commandMockData: CommandShellData = {
  core: {
    title: "FORGEONIX CORE",
    subtitle: "Command Center · Systems Bridge",
    version: "OS 0.9.1-preview",
    // uptime/load are simulated (shown as "(sim)" in the core readout). The
    // Nodes value is replaced at runtime with the real online/total count.
    uptime: "14d 06h 22m",
    load: "12%",
  },
  boot: {
    version: "FORGEONIX OS v0.9.1",
    durationMs: 3200,
    lines: [
      "Initializing command shell...",
      "Loading module bus...",
      "Mounting Supabase memory layer...",
      "Syncing infrastructure relay...",
      "Checking lead generation pipeline...",
      "Loading career memory...",
      "Establishing terminal feed...",
      "Core online.",
    ],
  },
  // Layout-only fallback. The live 9-card structure is read from the
  // module_status table in app/command/page.tsx; this is used only if that
  // query returns nothing (e.g. migration not yet applied).
  modules: [
    {
      id: "infrastructure",
      label: "Infrastructure",
      subtitle: "Homelab · Proxmox · Docker",
      status: "online",
      slot: "s1",
    },
    {
      id: "business",
      label: "Forgeonix Business",
      subtitle: "Brand · CRM · Leads · Services",
      status: "online",
      slot: "s2",
    },
    {
      id: "liftboard",
      label: "Liftboard",
      subtitle: "Fitness · Leaderboards · Teams",
      status: "online",
      slot: "s3",
    },
    {
      id: "career",
      label: "Career",
      subtitle: "Applications · Skills · Certs",
      status: "dev",
      slot: "s4",
    },
    {
      id: "projects",
      label: "Projects",
      subtitle: "Builds · Status · Stack",
      status: "online",
      slot: "s5",
    },
    {
      id: "ai-memory",
      label: "AI Memory",
      subtitle: "Notes · Docs · Second Brain",
      status: "standby",
      slot: "s6",
    },
    {
      id: "automations",
      label: "Automations",
      subtitle: "n8n · Workflows (Phase 9)",
      status: "dev",
      slot: "s7",
    },
    {
      id: "finance",
      label: "Finance",
      subtitle: "Revenue · Offers · Cashflow",
      status: "standby",
      slot: "s8",
    },
    {
      id: "health",
      label: "Health & Fitness",
      subtitle: "Weight · Calories · Bloodwork",
      status: "dev",
      slot: "s9",
    },
  ],
  // Cosmetic boot-time fallback feed. Replaced by real command_logs after boot
  // (see CommandShell's /api/os/logs effect).
  terminal: [
    {
      id: "t1",
      timestamp: "14:02:08",
      level: "system",
      message: "FORGEONIX OS bridge initialized — Supabase memory online",
    },
    {
      id: "t2",
      timestamp: "14:02:09",
      level: "success",
      message: "Core node online · 6 modules registered",
    },
    {
      id: "t3",
      timestamp: "14:02:11",
      level: "info",
      message: "Infrastructure module reading from database",
    },
    {
      id: "t4",
      timestamp: "14:02:14",
      level: "info",
      message: "LiftBoard relay connected",
    },
    {
      id: "t5",
      timestamp: "14:02:18",
      level: "info",
      message: "Lead Generation pipeline ready for writes",
    },
    {
      id: "t6",
      timestamp: "14:02:22",
      level: "info",
      message: "Career Tracker memory channel active",
    },
    {
      id: "t7",
      timestamp: "14:02:27",
      level: "system",
      message: "AI Operations · notes layer ready for agents",
    },
    {
      id: "t8",
      timestamp: "14:02:31",
      level: "success",
      message: "Forgeonix Business hub synced from Supabase",
    },
    {
      id: "t9",
      timestamp: "14:02:35",
      level: "info",
      message: "HUD render complete · awaiting operator input",
    },
    {
      id: "t10",
      timestamp: "14:02:40",
      level: "system",
      message: "— end of boot sequence —",
    },
  ],
  dock: [
    { id: "home", label: "Bridge Home", shortLabel: "HOME", active: true },
    { id: "modules", label: "Module Grid", shortLabel: "MOD" },
    { id: "terminal", label: "Terminal", shortLabel: "TERM" },
    { id: "network", label: "Network Map", shortLabel: "NET" },
    { id: "settings", label: "System Config", shortLabel: "CFG" },
    { id: "exit", label: "Exit to Site", shortLabel: "EXIT", href: "/" },
  ],
  nav: [
    { id: "bridge", label: "Bridge", active: true },
    { id: "modules", label: "Modules" },
    { id: "telemetry", label: "Telemetry" },
    { id: "logs", label: "Logs" },
    { id: "site", label: "Forgeonix.dev", href: "/" },
  ],
  // CPU/MEM/NET are simulated (a serverless app can't read host metrics) and are
  // labelled "(sim)". NODES is overwritten at runtime with the real online/total
  // module count in CommandShell.
  metrics: [
    { id: "cpu", label: "CPU", value: "12% (sim)" },
    { id: "mem", label: "MEM", value: "4.2 GB (sim)" },
    { id: "net", label: "NET", value: "↑ 24k ↓ 18k (sim)" },
    { id: "nodes", label: "NODES", value: "—" },
  ],
};
