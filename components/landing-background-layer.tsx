"use client";

import { useEffect, useRef } from "react";

export function LandingBackgroundLayer() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (reduceMotion || coarsePointer) {
      layer.style.setProperty("--px", "0px");
      layer.style.setProperty("--py", "0px");
      return;
    }

    let rafId = 0;
    const maxShift = 12;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      layer.style.setProperty("--px", `${currentX.toFixed(2)}px`);
      layer.style.setProperty("--py", `${currentY.toFixed(2)}px`);
      rafId = window.requestAnimationFrame(animate);
    };

    const onMove = (event: MouseEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      targetX = nx * (maxShift * 2);
      targetY = ny * (maxShift * 2);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    layer.style.setProperty("--px", "0px");
    layer.style.setProperty("--py", "0px");
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <img
        src="/branding/honeycomb1.png"
        alt=""
        className="absolute left-[2%] top-[5%] w-[210px] pointer-events-none select-none opacity-[0.18] md:w-[300px] md:opacity-[0.24] md:brightness-125 md:contrast-125"
        style={{
          transform: "translate3d(calc(var(--px, 0px) * 0.45), calc(var(--py, 0px) * 0.45), 0) rotate(-10deg)",
        }}
      />
      <img
        src="/branding/honeycomb2.png"
        alt=""
        className="absolute right-[5%] top-[10%] hidden w-[182px] pointer-events-none select-none opacity-[0.18] md:block md:w-[260px] md:opacity-[0.24] md:brightness-125 md:contrast-125"
        style={{
          transform: "translate3d(calc(var(--px, 0px) * -0.5), calc(var(--py, 0px) * 0.42), 0) rotate(8deg)",
        }}
      />
      <img
        src="/branding/honeycomb3.png"
        alt=""
        className="absolute bottom-[10%] right-[5%] hidden w-[224px] pointer-events-none select-none opacity-[0.18] md:block md:w-[320px] md:opacity-[0.24] md:brightness-125 md:contrast-125"
        style={{
          transform: "translate3d(calc(var(--px, 0px) * -0.56), calc(var(--py, 0px) * -0.52), 0) rotate(-6deg)",
        }}
      />
      <img
        src="/branding/tech1.png"
        alt=""
        className="absolute bottom-0 left-0 w-[350px] pointer-events-none select-none opacity-[0.14] md:w-[500px] md:opacity-[0.20] md:brightness-125 md:contrast-125"
        style={{
          transform: "translate3d(calc(var(--px, 0px) * 0.6), calc(var(--py, 0px) * -0.3), 0)",
        }}
      />
      <img
        src="/branding/tech2.png"
        alt=""
        className="absolute right-0 top-[45%] hidden w-[280px] pointer-events-none select-none opacity-[0.14] md:block md:w-[400px] md:opacity-[0.20] md:brightness-125 md:contrast-125"
        style={{
          transform: "translate3d(calc(var(--px, 0px) * -0.66), calc(var(--py, 0px) * 0.32), 0)",
        }}
      />
      <img
        src="/branding/tech3.png"
        alt=""
        className="absolute bottom-[5%] left-[5%] hidden w-[294px] pointer-events-none select-none opacity-[0.14] md:block md:w-[420px] md:opacity-[0.20] md:brightness-125 md:contrast-125"
        style={{
          transform: "translate3d(calc(var(--px, 0px) * 0.62), calc(var(--py, 0px) * -0.45), 0)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none select-none"
        style={{
          transform: "translate3d(calc(-50% + var(--px, 0px) * 0.28), calc(-50% + var(--py, 0px) * 0.28), 0)",
        }}
      >
        <img
          src="/branding/techcenter.png"
          alt=""
          className="w-[420px] animate-slow-spin pointer-events-none select-none opacity-[0.14] md:w-[600px] md:opacity-[0.20] md:brightness-125 md:contrast-125"
        />
      </div>
      <img
        src="/branding/techcenter2.png"
        alt=""
        className="absolute left-1/2 top-[72%] hidden w-[350px] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.10] md:block md:w-[500px] md:opacity-[0.16] md:brightness-125 md:contrast-125"
        style={{
          transform:
            "translate3d(calc(-50% + var(--px, 0px) * 0.26), calc(-50% + var(--py, 0px) * 0.22), 0)",
        }}
      />
    </div>
  );
}
