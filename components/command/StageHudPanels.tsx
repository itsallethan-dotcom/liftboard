import type { SystemMetric } from "@/types/command";
import { HudPanel } from "@/components/command/HudPanel";

// NOTE: The panels below are decorative "bridge" visuals. A serverless app can't
// read true host CPU/MEM/NET/uptime, so these are simulated and labelled "· SIM".
const HEALTH_ITEMS = [
  { label: "Core", value: "NOMINAL", tone: "ok" },
  { label: "Network", value: "STABLE", tone: "ok" },
  { label: "Relay", value: "SYNCED", tone: "ok" },
] as const;

const RESOURCE_ITEMS = [
  { label: "CPU", value: "12%" },
  { label: "Memory", value: "4.2 GB" },
  { label: "Disk", value: "38%" },
  { label: "Network", value: "↑ 24k ↓ 18k" },
] as const;

const QUICK_LAUNCH = [
  { id: "infra", label: "Infrastructure" },
  { id: "term", label: "Terminal" },
  { id: "net", label: "Network Map" },
  { id: "cfg", label: "System Config" },
] as const;

const BRIDGE_OVERVIEW = [
  { label: "Active Modules", value: "9" },
  { label: "Bridge Status", value: "ONLINE" },
  { label: "Sync Mode", value: "LIVE" },
] as const;

const TELEMETRY_BARS = [42, 68, 35, 82, 55, 48, 72, 40] as const;

type StageHudPanelsProps = {
  metrics: SystemMetric[];
  onLaunch?: (id: string) => void;
};

export function StageHudPanels({ metrics, onLaunch }: StageHudPanelsProps) {
  return (
    <div className="command-stage-hud command-boot-item" style={{ animationDelay: "0.5s" }}>
      <HudPanel label="// HEALTH · SIM" title="System Health" className="command-stage-hud__panel">
        <ul className="command-stage-hud__health">
          {HEALTH_ITEMS.map((item) => (
            <li key={item.label} className="command-stage-hud__health-row">
              <span>{item.label}</span>
              <span className={`command-stage-hud__health-val command-stage-hud__health-val--${item.tone}`}>
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </HudPanel>

      <HudPanel label="// RESOURCES · SIM" title="Resource Monitor" className="command-stage-hud__panel">
        <dl className="command-stage-hud__metrics">
          {RESOURCE_ITEMS.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </HudPanel>

      <HudPanel label="// LAUNCH" title="Quick Launch" className="command-stage-hud__panel">
        <div className="command-stage-hud__launch">
          {QUICK_LAUNCH.map((item) => (
            <button
              key={item.id}
              type="button"
              className="command-stage-hud__launch-btn"
              onClick={() => onLaunch?.(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </HudPanel>

      <HudPanel label="// BRIDGE" title="Bridge Overview" className="command-stage-hud__panel">
        <dl className="command-stage-hud__metrics">
          {BRIDGE_OVERVIEW.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </HudPanel>

      <HudPanel label="// TELEMETRY · SIM" title="Bridge Telemetry" className="command-stage-hud__panel">
        <div className="command-stage-hud__bars" aria-hidden>
          {TELEMETRY_BARS.map((height, index) => (
            <span
              key={index}
              className="command-stage-hud__bar"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <dl className="command-stage-hud__metrics command-stage-hud__metrics--compact">
          {metrics.slice(0, 2).map((metric) => (
            <div key={metric.id}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </HudPanel>
    </div>
  );
}
