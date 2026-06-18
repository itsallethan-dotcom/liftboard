import Link from "next/link";
import type { DockItem, SystemMetric } from "@/types/command";

type SystemDockProps = {
  items: DockItem[];
  metrics: SystemMetric[];
};

export function SystemDock({ items, metrics }: SystemDockProps) {
  return (
    <footer
      className="command-dock command-boot-item"
      style={{ animationDelay: "0.7s" }}
      aria-label="System dock"
    >
      <div className="command-dock__metrics">
        {metrics.map((metric) => (
          <div key={metric.id} className="command-dock__metric">
            <span className="command-dock__metric-label">{metric.label}</span>
            <span className="command-dock__metric-value">{metric.value}</span>
          </div>
        ))}
      </div>

      <nav className="command-dock__nav">
        {items.map((item) => {
          const className = `command-dock__item ${item.active ? "command-dock__item--active" : ""}`;

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className={className}>
                <span className="command-dock__item-short">{item.shortLabel}</span>
                <span className="command-dock__item-label">{item.label}</span>
              </Link>
            );
          }

          return (
            <button key={item.id} type="button" className={className}>
              <span className="command-dock__item-short">{item.shortLabel}</span>
              <span className="command-dock__item-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
}
