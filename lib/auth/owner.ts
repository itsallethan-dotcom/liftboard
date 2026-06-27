import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Owner allowlist for the Forgeonix command center.
 * Set FORGEONIX_OWNER_EMAIL in the environment (comma-separated to allow more than one).
 * NOTE: this only controls *who* is allowed in — account passwords are managed by
 * Supabase Auth (set via /signup), never stored in code or env.
 */
export function getOwnerEmails(): string[] {
  return (process.env.FORGEONIX_OWNER_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  const owners = getOwnerEmails();
  return owners.length > 0 && owners.includes(email.toLowerCase());
}

/** Reads the authenticated user from the request cookies (server-side). */
export async function getSessionUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

/** Returns the user only if they are the owner, else null. */
export async function getOwnerUser(): Promise<User | null> {
  const user = await getSessionUser();
  return user && isOwnerEmail(user.email) ? user : null;
}

/**
 * Hard gate for server components / pages. Redirects away if the caller is not
 * the owner. Returns the owner user when allowed.
 */
export async function requireOwnerPage(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/command");
  if (!isOwnerEmail(user.email)) redirect("/?denied=1");
  return user;
}

/**
 * Hard gate for route handlers. Returns a NextResponse to short-circuit when the
 * caller is not the owner, or null when the request is allowed to proceed.
 *
 *   const denied = await requireOwnerApi();
 *   if (denied) return denied;
 */
export async function requireOwnerApi(): Promise<NextResponse | null> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isOwnerEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
