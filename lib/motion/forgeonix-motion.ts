/**
 * Forgeonix OS — Central motion system (Phase 0 foundation).
 *
 * One place that registers GSAP + all approved plugins, defines the house
 * CustomEases, and sets project-wide tween defaults. Every client component
 * that animates should import `gsap` (and helpers) FROM THIS MODULE rather than
 * from "gsap" directly, which guarantees plugins + eases are registered first.
 *
 * Plugins approved for Forgeonix (all ship in the public `gsap` package):
 *   - useGSAP   → React-safe lifecycle + automatic cleanup (@gsap/react)
 *   - Flip      → shared-element / "card becomes panel" transitions
 *   - CustomEase→ anticipation / overshoot curves
 *   - SplitText → cinematic typographic reveals
 *   - ScrollTrigger → scroll-driven motion (only where a surface scrolls)
 *
 * SSR-safe: registration is a no-op on the server (GSAP runs in the browser).
 * Nothing here is wired into the UI yet — this is the engine the cinematic
 * phases will drive.
 */
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { DURATION, EASE } from "./tokens";

let registered = false;

/**
 * Idempotent, browser-only registration. Called once automatically on import,
 * and exported so a client entry point can call it explicitly if desired.
 */
export function registerForgeonixMotion(): void {
  if (registered || typeof window === "undefined") return;
  registered = true;

  gsap.registerPlugin(useGSAP, Flip, CustomEase, SplitText, ScrollTrigger);

  // House eases. Single-segment cubic-beziers (valid, predictable curves):
  //   forge-smooth   → premium ease-out (expo-like decel)
  //   forge-overshoot→ settle with a slight overshoot past the target
  CustomEase.create("forge-smooth", "0.22,1,0.36,1");
  CustomEase.create("forge-overshoot", "0.34,1.56,0.64,1");

  // V3 — the prototype's signature eases (gives every motion physical weight):
  //   forge  → strong expo-out (entrances)        cinema → smooth cinematic in-out (default)
  //   antic  → anticipation + overshoot (hovers)  glass  → soft settle (returns)
  CustomEase.create("forge", "M0,0 C0.12,0 0.05,1 1,1");
  CustomEase.create("cinema", "M0,0 C0.7,0 0.2,1 1,1");
  CustomEase.create("antic", "M0,0 C0.3,-0.18 0.1,1.12 1,1");
  CustomEase.create("glass", "M0,0 C0.16,1 0.3,1 1,1");

  gsap.defaults({ duration: DURATION.base, ease: EASE.cinema });
}

registerForgeonixMotion();

/** True when the user has asked for reduced motion. Gate ambient/camera motion on this. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export { gsap, useGSAP, Flip, CustomEase, SplitText, ScrollTrigger };
export { DURATION, STAGGER, EASE, DEPTH } from "./tokens";
export type { DurationToken, StaggerToken, EaseToken } from "./tokens";
