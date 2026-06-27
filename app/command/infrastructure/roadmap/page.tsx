import { requireOwnerPage } from "@/lib/auth/owner";
import { fetchInfrastructureDashboard } from "@/lib/os/infrastructure";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Infrastructure · Roadmap | Forgeonix OS" };
export const dynamic = "force-dynamic";

const wrap = "min-h-screen bg-[#0a0e12] px-6 py-8 text-[#dce8ec] font-mono";

export default async function InfraRoadmapPage() {
  await requireOwnerPage();
  const data = await fetchInfrastructureDashboard();
  const assetName = (id: string | null) =>
    id ? (data.assets.find((a) => a.id === id)?.name ?? null) : null;

  // Group upgrades by status for a simple timeline/board.
  const groups: Record<string, typeof data.upgrades> = {};
  for (const u of data.upgrades) {
    (groups[u.status] ??= []).push(u);
  }

  return (
    <main className={wrap}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Infrastructure · Roadmap</h1>
        <Link href="/command" className="text-sm text-[#ff7a36]">← Command</Link>
      </div>

      {data.upgrades.length === 0 ? (
        <p className="text-sm text-[#8aa]">No planned upgrades. Add them from the Infrastructure panel.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groups).map(([status, items]) => (
            <section key={status} className="rounded-sm border border-[#ff7a36]/20 bg-[#0e151b] p-4">
              <h2 className="mb-3 text-xs uppercase tracking-wider text-[#ff7a36]">
                {status.replace(/_/g, " ")} · {items.length}
              </h2>
              <ul className="space-y-2">
                {items.map((u) => (
                  <li key={u.id} className="rounded-sm border border-white/5 bg-[#0a0e12] p-2 text-sm">
                    <p className="text-[#e6feff]">{u.title}</p>
                    <p className="mt-1 text-xs text-[#8aa]">
                      {u.planned_date ? `Planned ${u.planned_date} · ` : ""}
                      Priority {u.priority}
                      {assetName(u.target_asset_id) ? ` · ${assetName(u.target_asset_id)}` : ""}
                    </p>
                    {u.notes ? <p className="mt-1 text-xs text-[#9bb]">{u.notes}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
