import type { CoreNodeData } from "@/types/command";
import { CoreReactor } from "@/components/command/CoreReactor";

type ReactorChamberProps = {
  core: CoreNodeData;
};

export function ReactorChamber({ core }: ReactorChamberProps) {
  return (
    <div className="reactor-chamber" aria-label="Reactor chamber">
      <div className="reactor-chamber__ambient" aria-hidden />
      <CoreReactor data={core} />
    </div>
  );
}
