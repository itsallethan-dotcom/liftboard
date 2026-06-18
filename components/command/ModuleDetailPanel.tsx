import { HudPanel } from "@/components/command/HudPanel";
import type { CommandModule } from "@/types/command";

const STATUS_LABEL: Record<CommandModule["status"], string> = {
  online: "ONLINE",
  standby: "STANDBY",
  dev: "IN DEV",
  offline: "OFFLINE",
};

type ModuleDetailPanelProps = {
  module: CommandModule;
  onClose: () => void;
};

export function ModuleDetailPanel({ module, onClose }: ModuleDetailPanelProps) {
  return (
    <aside className="command-module-detail" aria-label={`${module.label} module details`}>
      <HudPanel label="// MODULE DETAIL" title={module.label} className="command-module-detail__panel">
        <div className="command-module-detail__header">
          <span className={`command-module__status command-module__status--${module.status}`}>
            {STATUS_LABEL[module.status]}
          </span>
          <button type="button" className="command-module-detail__close" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="command-module-detail__subtitle">{module.subtitle}</p>
        <dl className="command-module-detail__fields">
          {module.detail.map((field) => (
            <div key={field.label}>
              <dt>{field.label}</dt>
              <dd
                className={
                  field.tone ? `command-module-detail__value--${field.tone}` : undefined
                }
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </HudPanel>
    </aside>
  );
}
