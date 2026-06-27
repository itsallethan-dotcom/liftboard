import { forwardRef } from "react";
import { HudPanel } from "@/components/command/HudPanel";
import type { CommandModule, CoreNodeData } from "@/types/command";

const STATUS_LABEL: Record<CommandModule["status"], string> = {
  online: "ONLINE",
  standby: "STANDBY",
  dev: "IN DEV",
  offline: "OFFLINE",
};

type CoreNodeProps = {
  data: CoreNodeData;
  selectedModule?: CommandModule | null;
};

export const CoreNode = forwardRef<HTMLDivElement, CoreNodeProps>(function CoreNode(
  { data, selectedModule },
  ref,
) {
  const focused = Boolean(selectedModule);

  return (
    <div
      ref={ref}
      className={`command-core command-boot-item ${focused ? "command-core--focused" : ""}`}
      style={{ animationDelay: "0.35s" }}
    >
      <div className="command-core__halo" aria-hidden />
      <div className="command-core__sphere" aria-hidden />
      <div className="command-core__depth" aria-hidden />
      <div className="command-core__depth command-core__depth--mid" aria-hidden />
      <div className="command-core__ring command-core__ring--outer" aria-hidden />
      <div className="command-core__ring command-core__ring--inner" aria-hidden />
      <div className="command-core__ring command-core__ring--accent" aria-hidden />
      <span className="command-core__link-node" data-connection-node aria-hidden />
      <HudPanel className="command-core__panel" glow>
        <p className="command-core__eyebrow">{focused ? "// MODULE LINK" : "// CORE SYSTEM"}</p>
        <p className="command-core__live">
          <span className="command-core__live-dot" aria-hidden />
          {focused ? `MODULE: ${STATUS_LABEL[selectedModule!.status]}` : "CORE SYSTEM: ONLINE"}
        </p>
        <h2 className="command-core__title">
          {selectedModule ? selectedModule.label : data.title}
        </h2>
        <p className="command-core__subtitle">
          {selectedModule ? selectedModule.subtitle : data.subtitle}
        </p>
        <dl className="command-core__stats">
          {selectedModule
            ? (selectedModule.detail ?? []).slice(0, 4).map((field) => (
                <div key={field.label}>
                  <dt>{field.label}</dt>
                  <dd>{field.value}</dd>
                </div>
              ))
            : (
              <>
                <div>
                  <dt>Version</dt>
                  <dd>{data.version}</dd>
                </div>
                <div>
                  <dt>Uptime (sim)</dt>
                  <dd>{data.uptime}</dd>
                </div>
                <div>
                  <dt>Load (sim)</dt>
                  <dd>{data.load}</dd>
                </div>
                <div>
                  <dt>Nodes</dt>
                  <dd>{data.nodes ?? "—"}</dd>
                </div>
              </>
            )}
        </dl>
        <p className="command-core__bridge">
          {focused
            ? `ROUTED TO CORE · ${selectedModule!.label.toUpperCase()} · ACTIVE`
            : "BRIDGE SYNC · NOMINAL"}
        </p>
      </HudPanel>
    </div>
  );
});
