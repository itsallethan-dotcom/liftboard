import type { HubConnection } from "@/components/command/hubGeometry";

const PARTICLE_OFFSETS = [0.12, 0.28, 0.44, 0.6, 0.76, 0.9] as const;

type ConnectionLinesProps = {
  connections: HubConnection[];
  selectedModuleId?: string | null;
  hoveredModuleId?: string | null;
};

export function ConnectionLines({
  connections,
  selectedModuleId,
  hoveredModuleId,
}: ConnectionLinesProps) {
  return (
    <svg
      className="command-stage__connections"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="command-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(103, 232, 249, 0.55)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.35)" />
        </linearGradient>
        <filter id="command-line-glow">
          <feGaussianBlur stdDeviation="0.35" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map((connection, index) => {
        const selected = selectedModuleId === connection.id;
        const hovered = hoveredModuleId === connection.id;
        const active = selected || hovered;

        return (
          <g
            key={connection.id}
            className={`command-connection command-connection--${connection.id} ${selected ? "command-connection--active" : ""} ${hovered && !selected ? "command-connection--hovered" : ""}`}
          >
            <line
              x1={connection.x1}
              y1={connection.y1}
              x2={connection.x2}
              y2={connection.y2}
              className="command-connection__stream"
              vectorEffect="non-scaling-stroke"
            />
            {PARTICLE_OFFSETS.map((offset, particleIndex) => (
              <circle
                key={particleIndex}
                cx={connection.x1 + (connection.x2 - connection.x1) * offset}
                cy={connection.y1 + (connection.y2 - connection.y1) * offset}
                r={active ? "0.34" : "0.26"}
                className="command-connection__particle"
                style={{
                  animationDelay: `${index * 0.4 + particleIndex * 0.28}s`,
                }}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
