import { CommandShell } from "@/components/command/CommandShell";
import { RADIAL_SLOTS } from "@/components/command/hubGeometry";
import { commandMockData } from "@/data/commandMockData";
import { requireOwnerPage } from "@/lib/auth/owner";
import { fetchModuleStatus } from "@/lib/os/command-core";
import type { CommandModule } from "@/types/command";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Command Center | Forgeonix OS",
  description: "Forgeonix Command Center — modular operating system console.",
};

// Always render fresh module state from the database.
export const dynamic = "force-dynamic";

export default async function CommandPage() {
  // Owner-only gate. Redirects non-owners before any data renders.
  await requireOwnerPage();

  // Drive the card grid from the module_status table (no hardcoded module list).
  let modules: CommandModule[] = commandMockData.modules;
  try {
    const rows = await fetchModuleStatus();
    const enabled = rows.filter((row) => row.enabled);
    if (enabled.length > 0) {
      modules = enabled.map((row, index) => ({
        id: row.key,
        label: row.label,
        subtitle: row.subtitle ?? "",
        status: row.status,
        slot: RADIAL_SLOTS[index] ?? RADIAL_SLOTS[RADIAL_SLOTS.length - 1]!,
      }));
    }
  } catch {
    // Fall back to the layout-only module list if the table isn't ready.
  }

  return <CommandShell data={{ ...commandMockData, modules }} />;
}
