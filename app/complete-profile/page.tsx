"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ensureProfileRow, supabase } from "@/lib/supabase/client";

const usernameRule = /^[a-z0-9_]{3,20}$/;

export default function CompleteProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        router.replace("/login");
        return;
      }

      await ensureProfileRow(sessionData.session.user.id, sessionData.session.user.email);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", sessionData.session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Failed loading profile during onboarding:", error);
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (profile?.username) {
        router.replace("/dashboard");
        return;
      }

      setDisplayName(profile?.display_name ?? "");
      setIsLoading(false);
    };

    void load();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const normalizedUsername = username.trim().toLowerCase();
    if (!usernameRule.test(normalizedUsername)) {
      setErrorMessage(
        "Username must be 3-20 characters, lowercase only, no spaces. Use letters, numbers, or underscore.",
      );
      return;
    }

    setIsSubmitting(true);

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      setIsSubmitting(false);
      router.replace("/login");
      return;
    }

    const { data: existingUser, error: existingError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", normalizedUsername)
      .neq("id", sessionData.session.user.id)
      .maybeSingle();

    if (existingError) {
      console.error("Failed to verify username uniqueness:", existingError);
      setErrorMessage(existingError.message);
      setIsSubmitting(false);
      return;
    }

    if (existingUser) {
      setErrorMessage("Username is taken.");
      setIsSubmitting(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: normalizedUsername,
        display_name: displayName.trim() || normalizedUsername,
      })
      .eq("id", sessionData.session.user.id);

    if (updateError) {
      console.error("Failed to complete profile:", updateError);
      setErrorMessage(updateError.code === "23505" ? "Username is taken." : updateError.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    router.replace("/dashboard");
    router.refresh();
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-lg items-center justify-center px-4 py-10">
        <p className="text-sm text-slate-200">Loading profile setup...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
        <h1 className="text-2xl font-bold text-slate-100">Complete Profile</h1>
        <p className="mt-2 text-sm text-slate-300">
          Set your username to continue to LiftBoard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-100">
            Username
            <input
              type="text"
              required
              minLength={3}
              maxLength={20}
              value={username}
              onChange={(event) =>
                setUsername(event.target.value.toLowerCase().replace(/\s+/g, ""))
              }
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
            />
          </label>

          <label className="block text-sm font-medium text-slate-100">
            Display Name (optional)
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900"
            />
          </label>

          {errorMessage ? <p className="text-sm text-rose-400">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Continue to Dashboard"}
          </button>
        </form>
      </section>
    </main>
  );
}
