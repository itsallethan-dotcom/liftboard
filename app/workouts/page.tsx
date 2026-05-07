"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAppData } from "@/hooks/use-app-data";

export default function WorkoutsPage() {
  const {
    loading,
    workouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    error,
    message,
    user,
    profile,
    profileDisplayName,
  } = useAppData();
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  if (loading) return <main className="min-h-screen bg-gray-950" />;

  return (
    <AppShell
      title="Workouts"
      user={user}
      profileDisplayName={profileDisplayName}
      avatarUrl={profile?.avatar_url ?? null}
    >
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-lg font-semibold">Log Workout</h2>
        <form
          className="mt-3 grid gap-3 sm:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!exercise.trim()) return;
            await addWorkout({
              exercise_name: exercise,
              weight: Number(weight),
              reps: Number(reps),
              sets: Number(sets),
            });
            setExercise("");
            setWeight("");
            setReps("");
            setSets("");
          }}
        >
          <input className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Exercise" value={exercise} onChange={(event) => setExercise(event.target.value)} />
          <input className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Weight" type="number" value={weight} onChange={(event) => setWeight(event.target.value)} />
          <input className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Reps" type="number" value={reps} onChange={(event) => setReps(event.target.value)} />
          <input className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Sets" type="number" value={sets} onChange={(event) => setSets(event.target.value)} />
          <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">Log Workout</button>
        </form>
        {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}
        {message ? <p className="mt-2 text-sm text-emerald-400">{message}</p> : null}
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-lg font-semibold">Recent Workout Entries</h2>
        {workouts.length === 0 ? (
          <p className="mt-3 text-sm text-slate-300">No workouts yet. Log your first workout above.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {workouts.map((entry) => (
              <article key={entry.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                {editingId === entry.id ? (
                  <WorkoutEditRow
                    entry={entry}
                    onCancel={() => setEditingId(null)}
                    onSave={async (payload) => {
                      await updateWorkout(entry.id, payload);
                      setEditingId(null);
                    }}
                  />
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <p>
                      {entry.exercise_name} - {Number(entry.weight)} x {entry.reps} x {entry.sets}
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="rounded-md border border-blue-500/60 px-2 py-1 text-xs text-blue-300"
                        onClick={() => setEditingId(entry.id)}
                      >
                        Edit Workout
                      </button>
                      <button
                        className="rounded-md border border-rose-500/60 px-2 py-1 text-xs text-rose-300"
                        onClick={() => void deleteWorkout(entry.id)}
                      >
                        Delete Workout
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function WorkoutEditRow({
  entry,
  onSave,
  onCancel,
}: {
  entry: { exercise_name: string; weight: number | string; reps: number; sets: number };
  onSave: (payload: { exercise_name: string; weight: number; reps: number; sets: number }) => Promise<void>;
  onCancel: () => void;
}) {
  const [exercise, setExercise] = useState(entry.exercise_name);
  const [weight, setWeight] = useState(String(entry.weight));
  const [reps, setReps] = useState(String(entry.reps));
  const [sets, setSets] = useState(String(entry.sets));
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <input className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5" value={exercise} onChange={(event) => setExercise(event.target.value)} />
      <input className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5" type="number" value={weight} onChange={(event) => setWeight(event.target.value)} />
      <input className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5" type="number" value={reps} onChange={(event) => setReps(event.target.value)} />
      <input className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5" type="number" value={sets} onChange={(event) => setSets(event.target.value)} />
      <div className="flex gap-2">
        <button
          className="rounded-md border border-emerald-500/60 px-2 py-1 text-xs text-emerald-300"
          onClick={() =>
            void onSave({
              exercise_name: exercise,
              weight: Number(weight),
              reps: Number(reps),
              sets: Number(sets),
            })
          }
        >
          Save
        </button>
        <button className="rounded-md border border-slate-600 px-2 py-1 text-xs" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
