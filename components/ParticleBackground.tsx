"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, {
  ParticlesProvider,
  useParticlesProvider,
} from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function ParticleCanvas() {
  const { loaded } = useParticlesProvider();
  const isDesktop = useIsDesktop();

  const options = useMemo<ISourceOptions>(
    () => ({
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      particles: {
        number: { value: isDesktop ? 100 : 60 },
        color: { value: isDesktop ? "#b8e8ff" : "#e8e8e8" },
        opacity: {
          value: isDesktop ? { min: 0.28, max: 0.45 } : { min: 0.15, max: 0.25 },
        },
        size: { value: { min: isDesktop ? 1.5 : 1, max: isDesktop ? 3 : 2 } },
        move: {
          enable: true,
          speed: isDesktop ? 0.55 : 0.4,
          direction: "none",
          random: true,
          outModes: { default: "bounce" },
        },
        links: {
          enable: true,
          color: isDesktop ? "#67e8f9" : "#ffffff",
          opacity: isDesktop ? 0.12 : 0.05,
          distance: 130,
          width: 1,
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          repulse: { distance: 90, duration: 0.4 },
          push: { quantity: 4 },
        },
      },
      detectRetina: true,
    }),
    [isDesktop],
  );

  if (!loaded) return null;

  return (
    <Particles
      id="forgeonix-particles"
      className="pointer-events-auto absolute inset-0 z-[1]"
      options={options}
    />
  );
}

export function ParticleBackground() {
  return (
    <ParticlesProvider init={async (engine) => loadSlim(engine)}>
      <ParticleCanvas />
    </ParticlesProvider>
  );
}
