export default function DashboardLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center bg-gray-950 px-4 py-10">
      <section className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-52 rounded-md bg-slate-800" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="h-24 rounded-xl bg-slate-800" />
            <div className="h-24 rounded-xl bg-slate-800" />
            <div className="h-24 rounded-xl bg-slate-800" />
            <div className="h-24 rounded-xl bg-slate-800" />
          </div>
          <div className="h-64 rounded-xl bg-slate-800" />
        </div>
      </section>
    </main>
  );
}
