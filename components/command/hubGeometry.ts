import type { CommandModuleSlot } from "@/types/command";

/**
 * Radial angle per slot (degrees, 0 = east, −90 = north).
 * Nine slots evenly spaced 40° apart, starting at the top and going clockwise.
 */
export const SLOT_ANGLES: Record<CommandModuleSlot, number> = {
  s1: -90,
  s2: -50,
  s3: -10,
  s4: 30,
  s5: 70,
  s6: 110,
  s7: 150,
  s8: -170,
  s9: -130,
};

/** Slots in render order — index a module list against this to place 9 cards. */
export const RADIAL_SLOTS: CommandModuleSlot[] = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
];

export type ConnectorSide = "left" | "right" | "top" | "bottom";

export type ModulePosition = {
  left: number;
  top: number;
};

export type ExpansionOffset = {
  dx: number;
  dy: number;
};

export type HubConnection = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export const MODULE_CARD_WIDTH = 176;
export const MODULE_CARD_HEIGHT_ESTIMATE = 104;

/** Base ring radius as a fraction of the smaller stage half-axis. */
export const RING_RADIUS_RATIO = 0.5;

/** Push default orbit outward ~42% vs the base ratio. */
export const ORBIT_RADIUS_SCALE = 1.42;

/** Minimum clear space between Core card edge and module card edge. */
export const CORE_PROTECTION_PADDING = 40;

/** Outward slide on hover (px). */
export const ORBIT_HOVER_OFFSET = 56;

/** Outward slide when selected (px). */
export const ORBIT_SELECTED_OFFSET = 64;

export function getConnectorSide(slot: CommandModuleSlot): ConnectorSide {
  // Pick the card edge that faces the core, derived from the slot's ring angle.
  const rad = (SLOT_ANGLES[slot] * Math.PI) / 180;
  const cx = Math.cos(rad);
  const cy = Math.sin(rad);
  if (Math.abs(cx) >= Math.abs(cy)) {
    return cx >= 0 ? "left" : "right";
  }
  return cy >= 0 ? "top" : "bottom";
}

export function getSlotUnitVector(slot: CommandModuleSlot): { x: number; y: number } {
  const rad = (SLOT_ANGLES[slot] * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

export function getExpansionOffset(
  slot: CommandModuleSlot,
  pixels: number,
): ExpansionOffset {
  const unit = getSlotUnitVector(slot);
  return { dx: unit.x * pixels, dy: unit.y * pixels };
}

/** Smallest orbit radius that respects core clearance and angular card spacing. */
export function computeMinOrbitRadius(
  coreWidth: number,
  coreHeight: number,
  cardWidth: number,
  cardHeight: number,
): number {
  const coreRadius = Math.hypot(coreWidth, coreHeight) / 2;
  const cardRadius = Math.hypot(cardWidth, cardHeight) / 2;
  const fromCoreProtection = coreRadius + cardRadius + CORE_PROTECTION_PADDING;

  const slotList = Object.keys(SLOT_ANGLES) as CommandModuleSlot[];
  let minSpacingRadius = 0;

  for (let i = 0; i < slotList.length; i++) {
    for (let j = i + 1; j < slotList.length; j++) {
      const a = (SLOT_ANGLES[slotList[i]!] * Math.PI) / 180;
      const b = (SLOT_ANGLES[slotList[j]!] * Math.PI) / 180;
      let delta = Math.abs(a - b);
      if (delta > Math.PI) {
        delta = 2 * Math.PI - delta;
      }
      if (delta < 0.01) {
        continue;
      }
      const needed = cardWidth / (2 * Math.sin(delta / 2)) + cardHeight * 0.12;
      minSpacingRadius = Math.max(minSpacingRadius, needed);
    }
  }

  return Math.max(fromCoreProtection, minSpacingRadius);
}

/**
 * Place module card centers on a ring around the stage center (50% / 50%).
 */
export function computeModulePositions(
  stageWidth: number,
  stageHeight: number,
  cardWidth: number,
  cardHeight: number,
  coreWidth = 280,
  coreHeight = 200,
  centerX = stageWidth / 2,
  centerY = stageHeight / 2,
): Record<CommandModuleSlot, ModulePosition> {
  const halfAxis = Math.min(stageWidth, stageHeight) / 2;
  const cardMaxHalf = Math.max(cardWidth, cardHeight) / 2;
  const scaledRadius = halfAxis * RING_RADIUS_RATIO * ORBIT_RADIUS_SCALE;
  const minRadius = computeMinOrbitRadius(coreWidth, coreHeight, cardWidth, cardHeight);
  const maxRadius = Math.max(minRadius, halfAxis - cardMaxHalf - 12);
  const radius = Math.min(Math.max(scaledRadius, minRadius), maxRadius);

  const positions = {} as Record<CommandModuleSlot, ModulePosition>;

  for (const [slot, angleDeg] of Object.entries(SLOT_ANGLES) as [
    CommandModuleSlot,
    number,
  ][]) {
    const rad = (angleDeg * Math.PI) / 180;
    const ringX = centerX + radius * Math.cos(rad);
    const ringY = centerY + radius * Math.sin(rad);

    positions[slot] = {
      left: ringX - cardWidth / 2,
      top: ringY - cardHeight / 2,
    };
  }

  return positions;
}

function centerOf(rect: DOMRect): { x: number; y: number } {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/** Ray from rectangle center toward target — intersection with rectangle edge. */
export function getEdgeAnchorOnRect(
  rect: DOMRect,
  targetX: number,
  targetY: number,
): { x: number; y: number } {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = targetX - cx;
  const dy = targetY - cy;
  const hw = rect.width / 2;
  const hh = rect.height / 2;
  const t = Math.min(
    Math.abs(hw / (Math.abs(dx) || 1e-6)),
    Math.abs(hh / (Math.abs(dy) || 1e-6)),
  );

  return {
    x: cx + dx * t,
    y: cy + dy * t,
  };
}

export function pointToStagePercent(
  x: number,
  y: number,
  stageRect: DOMRect,
): { x: number; y: number } {
  return {
    x: ((x - stageRect.left) / stageRect.width) * 100,
    y: ((y - stageRect.top) / stageRect.height) * 100,
  };
}

export function measureHubConnections(
  stage: HTMLElement,
  moduleIds: string[],
  coreRoot: HTMLElement | null,
): HubConnection[] {
  const stageRect = stage.getBoundingClientRect();
  if (stageRect.width <= 0 || stageRect.height <= 0 || !coreRoot) {
    return [];
  }

  const coreRect = coreRoot.getBoundingClientRect();
  const coreCenter = centerOf(coreRect);

  return moduleIds.flatMap((id) => {
    const moduleEl = stage.querySelector(`[data-module-id="${id}"]`) as HTMLElement | null;
    if (!moduleEl) {
      return [];
    }

    const cardRect = moduleEl.getBoundingClientRect();
    if (cardRect.width <= 0 || cardRect.height <= 0) {
      return [];
    }

    const cardAnchor = getEdgeAnchorOnRect(cardRect, coreCenter.x, coreCenter.y);
    const coreAnchor = getEdgeAnchorOnRect(coreRect, cardAnchor.x, cardAnchor.y);
    const start = pointToStagePercent(cardAnchor.x, cardAnchor.y, stageRect);
    const end = pointToStagePercent(coreAnchor.x, coreAnchor.y, stageRect);

    return [
      {
        id,
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
      },
    ];
  });
}

/** @deprecated Use getEdgeAnchorOnRect */
export const getEdgeAnchorOnCard = getEdgeAnchorOnRect;

/** @deprecated Use pointToStagePercent */
export const pointToHubPercent = pointToStagePercent;
