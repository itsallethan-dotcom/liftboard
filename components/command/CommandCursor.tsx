"use client";

/**
 * Forgeonix OS — V3-5: the magnetic reticle cursor.
 *
 * Translates the prototype's custom cursor into the OS: a two-speed reticle
 * (fast dot + lagged rotating ring) that brackets and scales over interactive
 * targets and magnetically pulls toward marked controls. The native cursor is
 * hidden — except over text inputs/areas/selects, where the caret returns so
 * data entry is never harmed ("input-safe").
 *
 * Desktop + fine-pointer + motion-allowed only (gsap.matchMedia); everyone else
 * keeps the normal cursor. Decorative; no data/behavior change.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";

const HOVER_TARGETS =
  "a,button,[data-magnetic],.command-module,.command-nav__link,.command-stage-hud__launch-btn,.command-dock__item,.command-hud-panel";
const MAGNETIC_TARGETS =
  ".command-nav__link,.command-stage-hud__launch-btn,.command-dock__item,[data-magnetic]";

export function CommandCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = document.querySelector<HTMLElement>(".forgeonix-os");
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        root.classList.add("forgeonix-cursor-on");

        const cur = document.createElement("div");
        cur.className = "forgeonix-cursor";
        cur.setAttribute("aria-hidden", "true");
        cur.innerHTML = `<svg viewBox="-32 -32 64 64">
          <circle class="fc-ring" r="13"/>
          <circle class="fc-core" r="2"/>
          <g class="fc-brk">
            <path d="M-20,-12 L-20,-20 L-12,-20"/><path d="M12,-20 L20,-20 L20,-12"/>
            <path d="M20,12 L20,20 L12,20"/><path d="M-12,20 L-20,20 L-20,12"/>
          </g></svg>`;

        const dot = document.createElement("div");
        dot.className = "forgeonix-cursor-dot";
        dot.setAttribute("aria-hidden", "true");

        root.appendChild(cur);
        root.appendChild(dot);

        const svg = cur.querySelector("svg");
        const ring = cur.querySelector(".fc-ring");
        const brk = cur.querySelector(".fc-brk");

        const xTo = gsap.quickTo(cur, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(cur, "y", { duration: 0.5, ease: "power3" });
        const dxTo = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
        const dyTo = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

        const onMove = (e: PointerEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
          dxTo(e.clientX);
          dyTo(e.clientY);
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        const spin = svg
          ? gsap.to(svg, { rotation: 360, duration: 8, repeat: -1, ease: "none", transformOrigin: "center" })
          : null;

        const onOver = (e: Event) => {
          const t = e.target instanceof Element ? e.target.closest(HOVER_TARGETS) : null;
          if (!t) return;
          gsap.to(cur, { scale: 1.7, duration: 0.4, ease: "antic" });
          if (brk) gsap.to(brk, { opacity: 1, duration: 0.3 });
          if (ring) gsap.to(ring, { opacity: 0, duration: 0.2 });
        };
        const onOut = (e: Event) => {
          const t = e.target instanceof Element ? e.target.closest(HOVER_TARGETS) : null;
          if (!t) return;
          gsap.to(cur, { scale: 1, duration: 0.4, ease: "glass" });
          if (brk) gsap.to(brk, { opacity: 0, duration: 0.3 });
          if (ring) gsap.to(ring, { opacity: 1, duration: 0.2 });
        };
        root.addEventListener("pointerover", onOver);
        root.addEventListener("pointerout", onOut);

        // Magnetic pull on marked controls.
        const magnets = Array.from(root.querySelectorAll<HTMLElement>(MAGNETIC_TARGETS));
        const cleanups: Array<() => void> = [];
        magnets.forEach((el) => {
          const qx = gsap.quickTo(el, "x", { duration: 0.6, ease: "glass" });
          const qy = gsap.quickTo(el, "y", { duration: 0.6, ease: "glass" });
          const m = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            qx((e.clientX - (r.left + r.width / 2)) * 0.35);
            qy((e.clientY - (r.top + r.height / 2)) * 0.35);
          };
          const leave = () => {
            qx(0);
            qy(0);
          };
          el.addEventListener("pointermove", m);
          el.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            el.removeEventListener("pointermove", m);
            el.removeEventListener("pointerleave", leave);
          });
        });

        return () => {
          window.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerover", onOver);
          root.removeEventListener("pointerout", onOut);
          cleanups.forEach((c) => c());
          spin?.kill();
          cur.remove();
          dot.remove();
          root.classList.remove("forgeonix-cursor-on");
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref} aria-hidden style={{ display: "contents" }} />;
}
