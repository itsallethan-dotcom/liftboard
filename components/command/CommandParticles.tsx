"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, {
  ParticlesProvider,
  useParticlesProvider,
} from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

// Stable module-level reference — ParticlesProvider requires the init callback to be
// stable across the app lifecycle (a new inline arrow per render throws at runtime).
async function initParticlesEngine(engine: Engine): Promise<void> {
  await loadSlim(engine);
}

/**
 * Command-center ambient particle field.
 *
 * Deliberately separate from the site-wide ParticleBackground (which is interactive
 * and used on the public marketing site). This one is non-interactive, capped, slow,
 * desktop-only, and disabled under prefers-reduced-motion for performance + comfort.
 */
function useAmbientEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(desktop.matches && !reduce.matches);

    // Defer the first enable so the particle engine doesn't initialize during the
    // boot sequence (keeps startup light). Media changes after that update immediately.
    const deferred = window.setTimeout(update, 1200);
    desktop.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      window.clearTimeout(deferred);
      desktop.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}

function AmbientField() {
  const { loaded } = useParticlesProvider();

  const options = useMemo<ISourceOptions>(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 30,
      particles: {
        number: { value: 45 },
        color: { value: ["#ff7a36", "#2d7dff"] },
        opacity: { value: { min: 0.08, max: 0.32 } },
        size: { value: { min: 1, max: 2 } },
        move: {
          enable: true,
          speed: 0.25,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" },
        },
        links: { enable: false },
      },
      interactivity: {
        events: { onHover: { enable: false }, onClick: { enable: false } },
      },
      detectRetina: true,
    }),
    [],
  );

  if (!loaded) return null;

  return <Particles id="command-particles" className="command-particles" options={options} />;
}

export function CommandParticles() {
  const enabled = useAmbientEnabled();
  if (!enabled) return null;

  return (
    <ParticlesProvider init={initParticlesEngine}>
      <AmbientField />
    </ParticlesProvider>
  );
}
