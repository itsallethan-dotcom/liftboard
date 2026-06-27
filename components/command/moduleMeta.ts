export type ModuleMeta = {
  load: string;
  sparkline: number[];
};

/**
 * Per-module telemetry (load % + sparkline).
 *
 * These were previously hardcoded, fabricated values. They have been removed
 * rather than shown as if real — the command center does not yet collect true
 * per-module load/throughput history. ModuleNode and ModuleBusPanel both guard
 * on a missing entry and simply render no telemetry strip.
 *
 * When real telemetry exists (e.g. activity counts over time from command_logs),
 * populate this map by module key and the strip will reappear automatically.
 */
export const MODULE_META: Record<string, ModuleMeta> = {};
