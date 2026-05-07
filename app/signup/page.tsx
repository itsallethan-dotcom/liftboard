"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/login");
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
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="mt-1 text-sm text-gray-300">Sign up to access your dashboard.</p>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
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
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              className="mt-2 w-full rounded-lg border border-gray-600 bg-neutral-900 px-3 py-2 text-white placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
            />
          </label>

          {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-white underline">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
