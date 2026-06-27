"use client";

/**
 * Forgeonix OS — V2-A: the room reacts, the reactor does not.
 *
 * The command center is a place. The reactor is a massive, calm object — it no
 * longer translates with the cursor (the old "magnetic" feel is gone). Instead
 * the *environment* acknowledges the operator:
 *   - the chamber backdrop drifts gently (atmospheric depth), and
 *   - a soft specular light glides across the chamber surfaces toward the cursor,
 *     as if the operator carries a light through the room.
 *
 * Transform/opacity only. Desktop + fine-pointer + motion-allowed only (gsap.matchMedia);
 * reduced-motion / touch get a completely still, correctly-lit room. No data,
 * layout, or behavior change. The stage (reactor + bays + connection lines) is
 * never transformed, so its geometry is untouched.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";

export function CommandParallax() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const bg = document.querySelector<HTMLElement>(".command-bg");
          const spec = document.querySelector<HTMLElement>(".command-bg__specular");
          if (!bg && !spec) return;

          // Backdrop overscan so a few px of atmospheric drift never reveals an edge.
          if (bg) gsap.set(bg, { scale: 1.06, transformOrigin: "50% 50%" });
          const bgX = bg ? gsap.quickTo(bg, "x", { duration: 1.1, ease: "power3.out" }) : null;
          const bgY = bg ? gsap.quickTo(bg, "y", { duration: 1.1, ease: "power3.out" }) : null;

          // Carried light: a soft highlight that lags toward the cursor position.
          let specX: ((v: number) => void) | null = null;
          let specY: ((v: number) => void) | null = null;
          if (spec) {
            gsap.set(spec, { autoAlpha: 1, xPercent: -50, yPercent: -50 });
            specX = gsap.quickTo(spec, "x", { duration: 0.9, ease: "power2.out" });
            specY = gsap.quickTo(spec, "y", { duration: 0.9, ease: "power2.out" });
          }

          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
            const ny = e.clientY / window.innerHeight - 0.5;
            // Gentle atmospheric drift of the chamber behind the still reactor.
            bgX?.(-nx * 10);
            bgY?.(-ny * 10);
            // The carried light tracks the operator across the room.
            specX?.(e.clientX);
            specY?.(e.clientY);
          };

          window.addEventListener("pointermove", onMove, { passive: true });
          return () => window.removeEventListener("pointermove", onMove);
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref} aria-hidden style={{ display: "contents" }} />;
}
