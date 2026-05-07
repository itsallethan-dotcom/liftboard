"use client";

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  console.error(error);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center bg-gray-950 px-4 py-10">
      <section className="w-full rounded-2xl border border-rose-500/40 bg-slate-900 p-6 sm:p-8">
        <h1 className="text-xl font-semibold text-rose-200">Dashboard temporarily unavailable</h1>
        <p className="mt-3 text-sm text-slate-300">
          We hit a temporary issue while loading your gym data. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={unstable_retry}
          className="mt-5 rounded-lg border border-cyan-400/40 bg-slate-950 px-4 py-2 text-sm font-semibold text-cyan-300 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:border-cyan-400/40"
        >
          Retry
        </button>
      </section>
    </main>
  );
}
