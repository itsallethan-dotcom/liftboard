"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";
import type { BootSequenceData } from "@/types/command";

type BootOverlayProps = {
  boot: BootSequenceData;
  onComplete: () => void;
};

export function BootOverlay({ boot, onComplete }: BootOverlayProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const finishedRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const ignitionRef = useRef<HTMLDivElement>(null);

  // Hold the latest onComplete in a ref so the boot timer never restarts when the
  // parent re-renders (e.g. the live clock). The sequence must run once on mount.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const finish = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    setExiting(true);
    window.setTimeout(() => onCompleteRef.current(), 480);
  }, []);

  // Run the boot sequence exactly once on mount. Empty deps are intentional:
  // boot timing is fixed for the session and the timer must not be restarted.
  useEffect(() => {
    const lineInterval = window.setInterval(() => {
      setVisibleCount((count) => {
        if (count >= boot.lines.length) {
          window.clearInterval(lineInterval);
          return count;
        }
        return count + 1;
      });
    }, boot.durationMs / (boot.lines.length + 1));

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      if (finishedRef.current) {
        return;
      }
      const ratio = Math.min((now - start) / boot.durationMs, 1);
      setProgress(Math.round(ratio * 100));
      if (ratio < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.clearInterval(lineInterval);
      window.cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Phase 6 — cinematic boot: the console assembles on mount. Visual only; this
  // does not touch the timer/onComplete above. Skipped under reduced motion.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "forge-smooth" } });
        tl.from(".command-boot-overlay__panel", { autoAlpha: 0, y: 14, scale: 1.03, duration: 0.55 })
          .from(".command-boot-overlay__version", { autoAlpha: 0, y: 6, duration: 0.3 }, "-=0.2")
          .from(".command-boot-overlay__progress-wrap", { autoAlpha: 0, duration: 0.3 }, "-=0.15");
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  // Phase 6 — ignition: as the boot hands off, a light bloom "powers on" the room
  // while the overlay dissolves (its fade is the existing CSS exit). Reduced-motion
  // users skip the bloom. Fire-and-forget; the overlay unmounts shortly after.
  useEffect(() => {
    if (!exiting || !ignitionRef.current || prefersReducedMotion()) return;
    const tl = gsap.timeline();
    tl.fromTo(
      ignitionRef.current,
      { autoAlpha: 0, scale: 0.6 },
      { autoAlpha: 0.9, scale: 1.25, duration: 0.22, ease: "power2.out" },
    ).to(ignitionRef.current, { autoAlpha: 0, duration: 0.32, ease: "power2.in" });
    return () => {
      tl.kill();
    };
  }, [exiting]);

  return (
    <div
      ref={rootRef}
      className={`command-boot-overlay ${exiting ? "command-boot-overlay--exit" : ""}`}
      role="dialog"
      aria-label="Forgeonix OS boot sequence"
      aria-live="polite"
    >
      <div className="command-boot-overlay__scanlines" aria-hidden />
      <div className="command-boot-overlay__vignette" aria-hidden />
      <div ref={ignitionRef} className="command-boot-overlay__ignition" aria-hidden />

      <button type="button" className="command-boot-overlay__skip" onClick={finish}>
        Skip Boot
      </button>

      <div className="command-boot-overlay__panel">
        <p className="command-boot-overlay__version">{boot.version}</p>
        <ul className="command-boot-overlay__lines">
          {boot.lines.slice(0, visibleCount).map((line, index) => (
            <li
              key={line}
              className="command-boot-overlay__line"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <span className="command-boot-overlay__prompt">&gt;</span>
              {line}
            </li>
          ))}
        </ul>

        <div className="command-boot-overlay__progress-wrap">
          <div className="command-boot-overlay__progress-meta">
            <span>INITIALIZING</span>
            <span>{progress}%</span>
          </div>
          <div className="command-boot-overlay__progress-track">
            <div
              className="command-boot-overlay__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="command-boot-overlay__code" aria-hidden>
          {`build:${Math.min(progress, 99).toString().padStart(2, "0")} // mem_ok // bridge_pending`}
        </p>
      </div>
    </div>
  );
}
