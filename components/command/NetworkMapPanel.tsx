import { HudPanel } from "@/components/command/HudPanel";

const NODES = [
  { id: "core", x: 50, y: 50, tone: "core" },
  { id: "n1", x: 22, y: 28, tone: "online" },
  { id: "n2", x: 78, y: 30, tone: "online" },
  { id: "n3", x: 80, y: 72, tone: "standby" },
  { id: "n4", x: 50, y: 82, tone: "dev" },
  { id: "n5", x: 20, y: 70, tone: "standby" },
  { id: "n6", x: 24, y: 48, tone: "online" },
] as const;

export function NetworkMapPanel() {
  return (
    <aside className="command-network command-boot-item" style={{ animationDelay: "0.6s" }}>
      <HudPanel label="// TOPOLOGY" title="Network Map" className="command-network__panel">
        <p className="command-network__meta">RELAY · 6 nodes · static preview</p>
        <svg className="command-network__map" viewBox="0 0 100 100" aria-hidden>
          <line x1="50" y1="50" x2="22" y2="28" className="command-network__link" />
          <line x1="50" y1="50" x2="78" y2="30" className="command-network__link" />
          <line x1="50" y1="50" x2="80" y2="72" className="command-network__link" />
          <line x1="50" y1="50" x2="50" y2="82" className="command-network__link" />
          <line x1="50" y1="50" x2="20" y2="70" className="command-network__link" />
          <line x1="50" y1="50" x2="24" y2="48" className="command-network__link" />
          {NODES.map((node) => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.tone === "core" ? 3.2 : 2.2}
              className={`command-network__node command-network__node--${node.tone}`}
            />
          ))}
        </svg>
      </HudPanel>
    </aside>
  );
}
