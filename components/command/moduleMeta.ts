export type ModuleMeta = {
  load: string;
  sparkline: number[];
};

export const MODULE_META: Record<string, ModuleMeta> = {
  infrastructure: { load: "8%", sparkline: [38, 42, 40, 45, 43, 48, 44, 50, 47] },
  business: { load: "11%", sparkline: [52, 50, 55, 53, 58, 54, 60, 57, 62] },
  leads: { load: "4%", sparkline: [22, 24, 20, 26, 23, 28, 25, 27, 24] },
  career: { load: "6%", sparkline: [30, 32, 35, 33, 36, 34, 38, 35, 37] },
  "ai-ops": { load: "3%", sparkline: [18, 20, 19, 22, 21, 24, 22, 25, 23] },
  liftboard: { load: "14%", sparkline: [60, 58, 62, 65, 63, 68, 64, 70, 66] },
};
