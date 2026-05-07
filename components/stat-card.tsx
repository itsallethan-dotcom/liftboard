export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded-xl border border-slate-700 bg-slate-900 p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
    </article>
  );
}
