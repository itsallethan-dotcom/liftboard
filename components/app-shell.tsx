"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { LogoutButton } from "@/components/logout-button";

const loggedInNavItems = [
  { href: "/dashboard", label: "Leaderboard" },
  { href: "/workouts", label: "Workouts" },
  { href: "/teams", label: "Teams/Gyms" },
  { href: "/profile", label: "Profile" },
];

const publicNavItems = [
  { href: "/dashboard", label: "Leaderboard" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
];

export function AppShell({
  title,
  children,
  user,
  profileDisplayName,
  avatarUrl,
}: {
  title: string;
  children: React.ReactNode;
  user: { id: string } | null;
  profileDisplayName?: string;
  avatarUrl?: string | null;
}) {
  const pathname = usePathname();
  const navItems = user ? loggedInNavItems : publicNavItems;

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{title}</h1>
              <Link
                href="/"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
              >
                Back to Forgeonix
              </Link>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5"
                >
                  <Avatar
                    name={profileDisplayName?.trim() || "Profile"}
                    avatarUrl={avatarUrl ?? null}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-slate-200">
                    {profileDisplayName?.trim() || "Profile"}
                  </span>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg border border-cyan-400/40 bg-slate-950 px-3 py-1.5 text-sm font-semibold text-cyan-300"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm font-semibold text-slate-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <nav className="mt-4 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-all duration-300 ease-out ${
                    isActive
                      ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-700 bg-slate-950 text-slate-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
