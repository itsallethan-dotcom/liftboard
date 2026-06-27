"use client";

/**
 * Forgeonix OS — Visual Overhaul Phase 4: instrument-bay activation feel.
 *
 * Decorative only. Adds physical "weight" to the module bays via GSAP, applied to
 * each card's icon badge (`.command-module__icon-wrap`) — a deliberately
 * conflict-free target: the icon has no CSS transform state, so animating its
 * scale never collides with the card's selected/expanded transforms or with the
 * connection-line geometry (which is measured from the card root, untouched here).
 *
 * Uses event delegation on the stage, so it survives re-renders without
 * per-card listeners. Desktop + fine-pointer + motion-allowed only.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";

export function CommandCardMotion() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = document.querySelector<HTMLElement>(".command-stage");
      if (!stage) return;

      const mm = gsap.matchMedia();

      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const iconOf = (el: EventTarget | null) =>
          el instanceof Element
            ? el
                .closest(".command-module")
                ?.querySelector<HTMLElement>(".command-module__icon-wrap") ?? null
            : null;

        // True only when the pointer crosses into a card from outside it.
        const crossedCard = (e: PointerEvent) => {
          const card = e.target instanceof Element ? e.target.closest(".command-module") : null;
          if (!card) return null;
          const related = e.relatedTarget as Node | null;
          if (related && card.contains(related)) return null;
          return card;
        };

        const onOver = (e: PointerEvent) => {
          const icon = crossedCard(e)?.querySelector<HTMLElement>(".command-module__icon-wrap");
          if (icon) gsap.to(icon, { scale: 1.12, duration: 0.4, ease: "forge-overshoot", overwrite: true });
        };
        const onOut = (e: PointerEvent) => {
          const icon = crossedCard(e)?.querySelector<HTMLElement>(".command-module__icon-wrap");
          if (icon) gsap.to(icon, { scale: 1, duration: 0.5, ease: "forge-smooth", overwrite: true });
        };
        const onDown = (e: PointerEvent) => {
          const icon = iconOf(e.target);
          if (icon) gsap.to(icon, { scale: 0.88, duration: 0.12, ease: "power2.out", overwrite: true });
        };
        const onUp = (e: PointerEvent) => {
          const icon = iconOf(e.target);
          if (icon) gsap.to(icon, { scale: 1.12, duration: 0.55, ease: "forge-overshoot", overwrite: true });
        };

        stage.addEventListener("pointerover", onOver);
        stage.addEventListener("pointerout", onOut);
        stage.addEventListener("pointerdown", onDown);
        stage.addEventListener("pointerup", onUp);

        return () => {
          stage.removeEventListener("pointerover", onOver);
          stage.removeEventListener("pointerout", onOut);
          stage.removeEventListener("pointerdown", onDown);
          stage.removeEventListener("pointerup", onUp);
          gsap.set(".command-module__icon-wrap", { clearProps: "transform" });
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref} aria-hidden style={{ display: "contents" }} />;
}
