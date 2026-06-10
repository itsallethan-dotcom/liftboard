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
    <main className="forgeonix-app px-4 py-6 sm:px-6">
      <div className="relative z-10 mx-auto w-full max-w-6xl space-y-4">
        <header className="forgeonix-app-shell-panel forgeonix-panel rounded-sm p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="forgeonix-metallic-text text-2xl font-bold">{title}</h1>
              <Link
                href="/"
                className="forgeonix-btn-ghost rounded-sm border border-white/20 px-3 py-1.5 text-sm font-semibold tracking-wide text-[#c0c0c0] transition-all duration-500 hover:border-[#67e8f9]/40 hover:text-white"
              >
                Back to Forgeonix
              </Link>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-sm border border-white/10 bg-[#141414]/80 px-2.5 py-1.5 transition-colors hover:border-[#67e8f9]/35"
                >
                  <Avatar
                    name={profileDisplayName?.trim() || "Profile"}
                    avatarUrl={avatarUrl ?? null}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-[#e0e0e0]">
                    {profileDisplayName?.trim() || "Profile"}
                  </span>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-sm border border-[#67e8f9]/30 px-3 py-1.5 text-sm font-semibold text-[#a5f3fc] transition-colors hover:border-[#67e8f9]/60"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="forgeonix-btn-ghost rounded-sm border border-white/20 px-3 py-1.5 text-sm font-semibold tracking-wide text-[#c0c0c0] transition-all duration-500 hover:border-[#67e8f9]/40 hover:text-white"
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
                  className={`rounded-sm border px-3 py-1.5 text-sm font-semibold transition-all duration-300 ease-out ${
                    isActive
                      ? "border-[#67e8f9]/50 bg-[#67e8f9]/10 text-[#a5f3fc]"
                      : "forgeonix-app-shell-panel border-white/10 bg-[#141414]/80 text-[#e0e0e0] hover:-translate-y-0.5 hover:border-[#67e8f9]/35"
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
