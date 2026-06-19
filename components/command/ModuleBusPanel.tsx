import { ModuleIcon } from "@/components/command/ModuleIcon";
import { MODULE_META } from "@/components/command/moduleMeta";
import { ModuleSparkline } from "@/components/command/ModuleSparkline";
import { HudPanel } from "@/components/command/HudPanel";
import type { CommandModule } from "@/types/command";

const STATUS_LABEL: Record<CommandModule["status"], string> = {
  online: "ONLINE",
  standby: "STANDBY",
  dev: "IN DEV",
  offline: "OFFLINE",
};

type ModuleBusPanelProps = {
  modules: CommandModule[];
  selectedModuleId: string | null;
  selectedModule: CommandModule | null;
  dbBackedModuleIds?: string[];
  onSelect: (module: CommandModule) => void;
};

export function ModuleBusPanel({
  modules,
  selectedModuleId,
  selectedModule,
  dbBackedModuleIds = [],
  onSelect,
}: ModuleBusPanelProps) {
  const isDbBacked = selectedModule && dbBackedModuleIds.includes(selectedModule.id);
  return (
    <aside className="command-module-bus command-boot-item" style={{ animationDelay: "0.3s" }}>
      <HudPanel label="// MODULE BUS" title="Active Nodes" className="command-module-bus__panel">
        <ul className="command-module-bus__list">
          {modules.map((module) => {
            const meta = MODULE_META[module.id];
            const selected = module.id === selectedModuleId;

            return (
              <li key={module.id}>
                <button
                  type="button"
                  className={`command-module-bus__item ${selected ? "command-module-bus__item--selected" : ""}`}
                  onClick={() => onSelect(module)}
                  aria-pressed={selected}
                >
                  <span className="command-module-bus__icon">
                    <ModuleIcon moduleId={module.id} />
                  </span>
                  <span className="command-module-bus__copy">
                    <span className="command-module-bus__label">{module.label}</span>
                    <span className="command-module-bus__subtitle">{module.subtitle}</span>
                  </span>
                  <span
                    className={`command-module-bus__status command-module__status command-module__status--${module.status}`}
                  >
                    {STATUS_LABEL[module.status]}
                  </span>
                  {meta ? (
                    <span className="command-module-bus__spark">
                      <ModuleSparkline points={meta.sparkline} />
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        {selectedModule && !isDbBacked ? (
          <div className="command-module-bus__detail">
            <p className="command-module-bus__detail-title">{selectedModule.label}</p>
            <dl className="command-module-bus__detail-fields">
              {(selectedModule.detail ?? []).map((field) => (
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
          </div>
        ) : selectedModule && isDbBacked ? (
          <div className="command-module-bus__detail">
            <p className="command-module-bus__detail-title">{selectedModule.label}</p>
            <dl className="command-module-bus__detail-fields">
              {selectedModule.detail?.slice(0, 4).map((field) => (
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
            <p className="command-module-bus__career-hint">
              Live hub open — data from Supabase memory.
            </p>
          </div>
        ) : null}
      </HudPanel>
    </aside>
  );
}
