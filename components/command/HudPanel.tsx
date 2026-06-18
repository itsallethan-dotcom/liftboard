import type { ReactNode } from "react";

type HudPanelProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  label?: string;
  glow?: boolean;
};

export function HudPanel({
  children,
  className = "",
  title,
  label,
  glow = false,
}: HudPanelProps) {
  return (
    <div
      className={`command-hud-panel ${glow ? "command-hud-panel--glow" : ""} ${className}`.trim()}
    >
      <span className="command-hud-corner command-hud-corner--tl" aria-hidden />
      <span className="command-hud-corner command-hud-corner--tr" aria-hidden />
      <span className="command-hud-corner command-hud-corner--bl" aria-hidden />
      <span className="command-hud-corner command-hud-corner--br" aria-hidden />
      {label ? <p className="command-hud-panel__label">{label}</p> : null}
      {title ? <h3 className="command-hud-panel__title">{title}</h3> : null}
      {children}
    </div>
  );
}
