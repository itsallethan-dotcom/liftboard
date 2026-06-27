import { requireOwnerPage } from "@/lib/auth/owner";
import { fetchInfrastructureDashboard } from "@/lib/os/infrastructure";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Infrastructure · Assets | Forgeonix OS" };
export const dynamic = "force-dynamic";

const wrap = "min-h-screen bg-[#0a0e12] px-6 py-8 text-[#dce8ec] font-mono";
const th = "border-b border-[#ff7a36]/20 px-2 py-2 text-left text-xs uppercase tracking-wider text-[#ff7a36]";
const td = "border-b border-white/5 px-2 py-1.5 align-top";

export default async function InfraAssetsPage() {
  await requireOwnerPage();
  const data = await fetchInfrastructureDashboard();
  const assetName = (id: string | null) =>
    id ? (data.assets.find((a) => a.id === id)?.name ?? "—") : "—";

  return (
    <main className={wrap}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Infrastructure · Asset Inventory</h1>
        <Link href="/command" className="text-sm text-[#ff7a36]">← Command</Link>
      </div>

      <section className="mb-8">
        <h2 className="mb-2 text-sm uppercase tracking-wider text-[#ff7a36]">Hosts / VMs</h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={th}>Name</th><th className={th}>Kind</th><th className={th}>Status</th>
              <th className={th}>IP</th><th className={th}>OS</th><th className={th}>CPU</th>
              <th className={th}>RAM (MB)</th><th className={th}>Disk (GB)</th><th className={th}>Parent</th>
            </tr>
          </thead>
          <tbody>
            {data.assets.map((a) => (
              <tr key={a.id}>
                <td className={td}>{a.name}</td>
                <td className={td}>{a.kind}</td>
                <td className={td}>{a.status}</td>
                <td className={td}>{a.ip_address ?? "—"}</td>
                <td className={td}>{a.os ?? "—"}</td>
                <td className={td}>{a.cpu_cores ?? "—"}</td>
                <td className={td}>{a.ram_mb ?? "—"}</td>
                <td className={td}>{a.disk_gb ?? "—"}</td>
                <td className={td}>{assetName(a.parent_id)}</td>
              </tr>
            ))}
            {data.assets.length === 0 ? (
              <tr><td className={td} colSpan={9}>No assets.</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-sm uppercase tracking-wider text-[#ff7a36]">Containers</h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={th}>Name</th><th className={th}>Image</th><th className={th}>Status</th>
              <th className={th}>Ports</th><th className={th}>Host</th>
            </tr>
          </thead>
          <tbody>
            {data.containers.map((c) => (
              <tr key={c.id}>
                <td className={td}>{c.name}</td>
                <td className={td}>{c.image ?? "—"}</td>
                <td className={td}>{c.status}</td>
                <td className={td}>{c.ports ?? "—"}</td>
                <td className={td}>{assetName(c.asset_id)}</td>
              </tr>
            ))}
            {data.containers.length === 0 ? (
              <tr><td className={td} colSpan={5}>No containers.</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="mb-2 text-sm uppercase tracking-wider text-[#ff7a36]">Services</h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={th}>Name</th><th className={th}>Status</th><th className={th}>IP</th>
              <th className={th}>Port</th><th className={th}>URL</th><th className={th}>Host</th>
            </tr>
          </thead>
          <tbody>
            {data.services.map((s) => (
              <tr key={s.id}>
                <td className={td}>{s.name}</td>
                <td className={td}>{s.status}</td>
                <td className={td}>{s.ip_address ?? "—"}</td>
                <td className={td}>{s.port ?? "—"}</td>
                <td className={td}>{s.internal_url ?? s.url ?? "—"}</td>
                <td className={td}>{assetName(s.asset_id)}</td>
              </tr>
            ))}
            {data.services.length === 0 ? (
              <tr><td className={td} colSpan={6}>No services.</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </main>
  );
}
