/**
 * Forgeonix OS — Motion grammar (Phase 0 foundation).
 *
 * Pure constants only: no GSAP import, safe to use in any module (client or
 * server). These define the *vocabulary* of motion for the whole command
 * center so every animation shares the same timing, easing, and stagger feel.
 *
 * Nothing here is wired into components yet — this is the shared language that
 * the cinematic phases (depth, reactor, bays, navigation, boot) will speak.
 */

/** Standard durations (seconds). Keep the set small and intentional. */
export const DURATION = {
  /** micro state flips — toggles, tiny acknowledgements */
  instant: 0.12,
  /** hovers, small reveals */
  fast: 0.24,
  /** the default move — most transitions */
  base: 0.4,
  /** weighted panel / bay moves */
  slow: 0.7,
  /** camera repositions, room responses */
  cinematic: 1.1,
  /** the boot / wake-up master timeline */
  boot: 2.4,
} as const;

/** Stagger grammar (seconds between successive elements). */
export const STAGGER = {
  tight: 0.04,
  base: 0.07,
  loose: 0.12,
} as const;

/**
 * Easing vocabulary. `smooth` and `overshoot` are registered as CustomEases in
 * forgeonix-motion.ts; the rest are GSAP built-ins (no plugin required).
 * Anticipation/overshoot give motion weight per the directive.
 */
export const EASE = {
  /** premium decel — the house ease-out (CustomEase) */
  smooth: "forge-smooth",
  /** settle with a slight overshoot — for things arriving (CustomEase) */
  overshoot: "forge-overshoot",
  /** wind-up before moving — for deliberate, weighted starts (built-in) */
  anticipate: "back.in(1.5)",
  /** symmetric, controlled — for camera / room moves (built-in) */
  glide: "power3.inOut",
  /** linear — for continuous ambient loops only */
  linear: "none",

  /* ——— V3: the prototype's signature curves (registered in forgeonix-motion) ——— */
  /** strong expo-out — entrances */
  forge: "forge",
  /** smooth cinematic in-out — the default voice */
  cinema: "cinema",
  /** anticipation + overshoot — hovers / presents */
  antic: "antic",
  /** soft settle — returns */
  glass: "glass",
} as const;

/**
 * Named depth planes. The cinematic camera model layers everything onto three
 * planes; parallax strength scales with distance from the lens.
 */
export const DEPTH = {
  background: { z: 0, parallax: 0.15 },
  midground: { z: 10, parallax: 0.5 },
  foreground: { z: 40, parallax: 1 },
} as const;

export type DurationToken = keyof typeof DURATION;
export type StaggerToken = keyof typeof STAGGER;
export type EaseToken = keyof typeof EASE;
