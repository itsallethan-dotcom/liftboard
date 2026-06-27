import { requireOwnerPage } from "@/lib/auth/owner";
import { fetchNotesDashboard } from "@/lib/os/notes";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Infrastructure · Docs | Forgeonix OS" };
export const dynamic = "force-dynamic";

const wrap = "min-h-screen bg-[#0a0e12] px-6 py-8 text-[#dce8ec] font-mono";

export default async function InfraDocsPage() {
  await requireOwnerPage();
  const { notes } = await fetchNotesDashboard();

  // Infrastructure docs reuse os_notes (documentation type, tagged infra).
  const docs = notes.filter(
    (n) =>
      n.note_type === "documentation" &&
      (n.tags ?? "").toLowerCase().includes("infra"),
  );

  return (
    <main className={wrap}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Infrastructure · Docs</h1>
        <Link href="/command" className="text-sm text-[#ff7a36]">← Command</Link>
      </div>

      <p className="mb-4 text-xs text-[#8aa]">
        Documentation notes tagged <code>infra</code> (add via AI Memory / Notes with
        note type &quot;documentation&quot;).
      </p>

      {docs.length === 0 ? (
        <p className="text-sm text-[#8aa]">No infrastructure docs yet.</p>
      ) : (
        <div className="space-y-4">
          {docs.map((d) => (
            <article key={d.id} className="rounded-sm border border-[#ff7a36]/20 bg-[#0e151b] p-4">
              <h2 className="text-[#e6feff]">{d.title}</h2>
              {d.tags ? <p className="mt-1 text-xs text-[#ff7a36]">{d.tags}</p> : null}
              {d.body ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-[#9bb]">{d.body}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
