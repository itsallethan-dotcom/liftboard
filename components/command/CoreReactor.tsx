import type { CSSProperties } from "react";
import type { CoreNodeData } from "@/types/command";

const SPHERE_PARTICLES = [
  { x: 28, y: 22, delay: "0s", size: 1.5 },
  { x: 68, y: 30, delay: "1.4s", size: 1 },
  { x: 22, y: 62, delay: "0.7s", size: 1 },
  { x: 74, y: 68, delay: "2.2s", size: 1.5 },
  { x: 48, y: 18, delay: "1.1s", size: 1 },
  { x: 52, y: 78, delay: "2.8s", size: 1 },
  { x: 38, y: 48, delay: "0.3s", size: 1 },
  { x: 62, y: 52, delay: "1.9s", size: 1 },
] as const;

type CoreReactorProps = {
  data: CoreNodeData;
  statusLine?: string;
};

export function CoreReactor({
  data,
  statusLine = "CORE SYSTEM: ONLINE",
}: CoreReactorProps) {
  return (
    <div className="command-reactor" aria-label={`${data.title} — ${statusLine}`}>
      <div className="command-reactor__halo" aria-hidden />

      <div className="command-reactor__orbital-system" aria-hidden>
        <div className="command-reactor__orbit command-reactor__orbit--1" />
        <div className="command-reactor__orbit command-reactor__orbit--2" />
        <div className="command-reactor__orbit command-reactor__orbit--3" />
      </div>

      <div className="command-reactor__sphere-wrap" aria-hidden>
        <div className="command-reactor__sphere">
          <div className="command-reactor__sphere-glass" />
          <div className="command-reactor__inner-orb" />
          <div className="command-reactor__sphere-highlight" />
          {SPHERE_PARTICLES.map((particle, index) => (
            <span
              key={index}
              className="command-reactor__particle"
              style={
                {
                  "--px": `${particle.x}%`,
                  "--py": `${particle.y}%`,
                  "--ps": `${particle.size}px`,
                  animationDelay: particle.delay,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div className="command-reactor__platform" aria-hidden />

      <div className="command-reactor__hud">
        <p className="command-reactor__status">
          <span className="command-reactor__status-dot" aria-hidden />
          {statusLine}
        </p>
        <p className="command-reactor__title">{data.title}</p>
        <p className="command-reactor__subtitle">{data.subtitle}</p>
        <dl className="command-reactor__metrics">
          <div>
            <dt>Version</dt>
            <dd>{data.version}</dd>
          </div>
          <div>
            <dt>Uptime</dt>
            <dd>{data.uptime}</dd>
          </div>
          <div>
            <dt>Load</dt>
            <dd>{data.load}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
