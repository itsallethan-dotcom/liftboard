import { ModuleIcon } from "@/components/command/ModuleIcon";
import type { ConnectorSide, ExpansionOffset } from "@/components/command/hubGeometry";
import { MODULE_META } from "@/components/command/moduleMeta";
import { ModuleSparkline } from "@/components/command/ModuleSparkline";
import type { CommandModule } from "@/types/command";
import type { ModulePosition } from "@/components/command/hubGeometry";

const STATUS_LABEL: Record<CommandModule["status"], string> = {
  online: "ONLINE",
  standby: "STANDBY",
  dev: "IN DEV",
  offline: "OFFLINE",
};

type ModuleNodeProps = {
  module: CommandModule;
  position?: ModulePosition;
  connectorSide: ConnectorSide;
  expansion?: ExpansionOffset;
  expanded?: boolean;
  delay?: string;
  selected?: boolean;
  onSelect?: (module: CommandModule) => void;
  onHoverChange?: (hovered: boolean) => void;
  visible?: boolean;
};

export function ModuleNode({
  module,
  position,
  connectorSide,
  expansion = { dx: 0, dy: 0 },
  expanded = false,
  delay = "0s",
  selected = false,
  onSelect,
  onHoverChange,
  visible = true,
}: ModuleNodeProps) {
  const meta = MODULE_META[module.id];

  return (
    <button
      type="button"
      data-module-id={module.id}
      className={`command-module command-module--positioned command-boot-item ${selected ? "command-module--selected" : ""} ${expanded ? "command-module--expanded" : ""}`}
      style={{
        animationDelay: delay,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        zIndex: expanded ? 12 : 4,
        transform: `translate(${expansion.dx}px, ${expansion.dy}px)`,
        ...(position
          ? { left: `${position.left}px`, top: `${position.top}px` }
          : undefined),
      }}
      aria-label={`${module.label} module — ${STATUS_LABEL[module.status]}`}
      aria-pressed={selected}
      onClick={() => onSelect?.(module)}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
    >
      <span
        className={`command-module__node command-module__node--${connectorSide}`}
        data-connection-node
        aria-hidden
      />
      <div className="command-module__body">
        <div className="command-module__head">
          <span className="command-module__icon-wrap">
            <ModuleIcon moduleId={module.id} />
          </span>
          <span className={`command-module__status command-module__status--${module.status}`}>
            {STATUS_LABEL[module.status]}
          </span>
        </div>
        <span className="command-module__label">{module.label}</span>
        <span className="command-module__subtitle">{module.subtitle}</span>
        {meta ? (
          <div className="command-module__telemetry">
            <span className="command-module__load">LOAD {meta.load}</span>
            <ModuleSparkline points={meta.sparkline} />
          </div>
        ) : null}
      </div>
    </button>
  );
}
