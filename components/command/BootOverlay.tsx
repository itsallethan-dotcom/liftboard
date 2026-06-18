"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

  const finish = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    setExiting(true);
    window.setTimeout(onComplete, 480);
  }, [onComplete]);

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
  }, [boot.durationMs, boot.lines.length, finish]);

  return (
    <div
      className={`command-boot-overlay ${exiting ? "command-boot-overlay--exit" : ""}`}
      role="dialog"
      aria-label="Forgeonix OS boot sequence"
      aria-live="polite"
    >
      <div className="command-boot-overlay__scanlines" aria-hidden />
      <div className="command-boot-overlay__vignette" aria-hidden />

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
