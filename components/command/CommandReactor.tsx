"use client";

/**
 * Forgeonix OS — Visual Overhaul Phase 3: the living reactor + environment light.
 *
 * Decorative only. One GSAP heartbeat is the single source of truth for the
 * chamber's light: it animates the root CSS variable `--fx-reactor-pulse` (0..1),
 * and the reactor's spill glow + core halo read that variable in CSS, so the
 * core and the room breathe as one — the core appears to light the chamber.
 *
 * A second tween drifts a soft light band across the walls (`.command-bg__sweep`).
 *
 * Opacity/transform only. Fully disabled for prefers-reduced-motion via
 * gsap.matchMedia — those users get a calm, static, correctly-lit scene.
 * No data, layout, or behavior change.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";

export function CommandReactor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = document.querySelector<HTMLElement>(".forgeonix-os");
      const sweep = document.querySelector<HTMLElement>(".command-bg__sweep");
      const mm = gsap.matchMedia();

      // Full motion: breathing heartbeat + travelling light sweep.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tweens: gsap.core.Tween[] = [];

        if (root) {
          const pulse = { v: 0.78 };
          tweens.push(
            gsap.fromTo(
              pulse,
              { v: 0.6 },
              {
                v: 1,
                duration: 2.1,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                onUpdate: () =>
                  root.style.setProperty("--fx-reactor-pulse", pulse.v.toFixed(3)),
              },
            ),
          );
        }

        if (sweep) {
          gsap.set(sweep, { autoAlpha: 0.6 });
          tweens.push(
            gsap.fromTo(
              sweep,
              { xPercent: -60 },
              { xPercent: 320, duration: 17, ease: "none", repeat: -1 },
            ),
          );
        }

        return () => {
          tweens.forEach((t) => t.kill());
          if (root) root.style.removeProperty("--fx-reactor-pulse");
        };
      });

      // Reduced motion: hold a calm, well-lit static value; no sweep.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (root) root.style.setProperty("--fx-reactor-pulse", "0.82");
        return () => {
          if (root) root.style.removeProperty("--fx-reactor-pulse");
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref} aria-hidden style={{ display: "contents" }} />;
}
