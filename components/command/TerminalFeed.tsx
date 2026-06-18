import { HudPanel } from "@/components/command/HudPanel";
import type { TerminalEntry } from "@/types/command";

type TerminalFeedProps = {
  entries: TerminalEntry[];
};

const LEVEL_CLASS: Record<TerminalEntry["level"], string> = {
  info: "command-terminal__level--info",
  warn: "command-terminal__level--warn",
  success: "command-terminal__level--success",
  system: "command-terminal__level--system",
};

export function TerminalFeed({ entries }: TerminalFeedProps) {
  return (
    <aside
      className="command-terminal command-boot-item"
      style={{ animationDelay: "0.55s" }}
      aria-label="System activity feed"
    >
      <HudPanel label="// ACTIVITY FEED" title="Terminal" className="command-terminal__panel">
        <ul className="command-terminal__list">
          {entries.map((entry) => (
            <li key={entry.id} className="command-terminal__line">
              <span className="command-terminal__time">[{entry.timestamp}]</span>
              <span className={`command-terminal__level ${LEVEL_CLASS[entry.level]}`}>
                {entry.level.toUpperCase()}
              </span>
              <span className="command-terminal__message">{entry.message}</span>
            </li>
          ))}
        </ul>
        <p className="command-terminal__cursor" aria-hidden>
          <span className="command-terminal__prompt">&gt;</span>
          awaiting input
          <span className="command-terminal__blink">_</span>
        </p>
      </HudPanel>
    </aside>
  );
}
