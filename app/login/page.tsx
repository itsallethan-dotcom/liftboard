"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ensureProfileRow, supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", data.session.user.id)
          .maybeSingle();
        router.replace(profile?.username ? "/dashboard" : "/complete-profile");
      }
    };

    void checkSession();
  }, [router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    if (data.user) {
      try {
        await ensureProfileRow(data.user.id, data.user.email);
      } catch (profileError) {
        console.error("Profile creation failed:", profileError);
        const message = profileError instanceof Error ? profileError.message : String(profileError);
        setErrorMessage(message);
        setIsSubmitting(false);
        return;
      }

      const { data: profile, error: profileFetchError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileFetchError) {
        console.error("Failed to check username during login:", profileFetchError);
        setErrorMessage(profileFetchError.message);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      router.push(profile?.username ? "/dashboard" : "/complete-profile");
      router.refresh();
      return;
    }

    setIsSubmitting(false);
    setErrorMessage("Login succeeded but user session data was unavailable. Please try again.");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="mt-1 text-sm text-slate-600">Welcome back to LiftBoard.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Need an account?{" "}
          <Link href="/signup" className="font-medium text-slate-900 underline">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
