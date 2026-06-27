"use client";

/**
 * Forgeonix OS — Visual Overhaul Phase 7: press feedback on command controls.
 *
 * Decorative only. Adds weighted press feedback (quick dip on press, overshoot
 * settle on release) to the primary controls via event delegation. The safelist
 * is restricted to controls confirmed to have NO transform state in CSS
 * (nav links, quick-launch tiles), so the GSAP scale never collides with an
 * existing hover/active transform.
 *
 * Desktop-friendly, reduced-motion gated, auto-cleaned. No behavior change.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";

const PRESS_SELECTOR = ".command-nav__link, .command-stage-hud__launch-btn";

export function CommandPressFX() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = document.querySelector<HTMLElement>(".forgeonix-os");
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const hit = (e: Event) =>
          e.target instanceof Element ? e.target.closest<HTMLElement>(PRESS_SELECTOR) : null;

        const onDown = (e: PointerEvent) => {
          const el = hit(e);
          if (el) gsap.to(el, { scale: 0.95, duration: 0.1, ease: "power2.out", overwrite: true });
        };
        const onUp = (e: PointerEvent) => {
          const el = hit(e);
          if (el) gsap.to(el, { scale: 1, duration: 0.45, ease: "forge-overshoot", overwrite: true });
        };

        root.addEventListener("pointerdown", onDown);
        root.addEventListener("pointerup", onUp);
        root.addEventListener("pointercancel", onUp);

        return () => {
          root.removeEventListener("pointerdown", onDown);
          root.removeEventListener("pointerup", onUp);
          root.removeEventListener("pointercancel", onUp);
          gsap.set(PRESS_SELECTOR, { clearProps: "transform" });
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref} aria-hidden style={{ display: "contents" }} />;
}
