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
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-10">
      <section className="w-full max-w-md rounded-xl bg-gray-900 p-6 shadow sm:p-8">
        <Link
          href="/"
          className="inline-flex rounded-lg border border-gray-600 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-gray-200 hover:border-cyan-400/40 hover:text-cyan-300"
        >
          Back to Forgeonix
        </Link>
        <h1 className="text-2xl font-bold text-white">Log in</h1>
        <p className="mt-1 text-sm text-gray-300">Welcome back to LiftBoard.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-gray-200">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-gray-600 bg-neutral-900 px-3 py-2 text-white placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
            />
          </label>

          <label className="block text-sm font-medium text-gray-200">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-lg border border-gray-600 bg-neutral-900 px-3 py-2 text-white placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
            />
          </label>

          {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300">
          Need an account?{" "}
          <Link href="/signup" className="font-medium text-white underline">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
