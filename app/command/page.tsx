import { CommandShell } from "@/components/command/CommandShell";
import { commandMockData } from "@/data/commandMockData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Command Center | Forgeonix OS",
  description: "Forgeonix Command Center — systems bridge console (visual shell preview).",
};

export default function CommandPage() {
  return <CommandShell data={commandMockData} />;
}
