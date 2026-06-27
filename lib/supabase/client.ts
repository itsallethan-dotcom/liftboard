import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.",
  );
}

/**
 * Cookie-based browser client (via @supabase/ssr). Storing the session in
 * cookies (instead of localStorage) is what lets the server, route handlers,
 * and proxy.ts read the auth state and enforce the owner-only gate.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export async function ensureProfileRow(userId: string, userEmail?: string | null) {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    const fullMessage = `Supabase auth check failed: ${authError.message}`;
    throw new Error(fullMessage);
  }

  if (!authData.user) {
    throw new Error("Supabase auth check failed: no authenticated user found.");
  }

  if (authData.user.id !== userId) {
    throw new Error("Profile creation blocked: provided user id does not match auth.uid().");
  }

  const { data: existingProfile, error: existingProfileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existingProfileError) {
    const fullMessage = `Supabase profile lookup failed: ${existingProfileError.message} (code: ${existingProfileError.code ?? "n/a"}, details: ${existingProfileError.details ?? "n/a"}, hint: ${existingProfileError.hint ?? "n/a"})`;
    throw new Error(fullMessage);
  }

  if (existingProfile) {
    return;
  }

  const emailToStore = userEmail ?? authData.user.email;
  if (!emailToStore) {
    throw new Error("Profile creation blocked: authenticated user has no email.");
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    display_name: emailToStore,
    username: null,
    avatar_url: null,
  });

  if (insertError) {
    const fullMessage = `Supabase profile insert failed: ${insertError.message} (code: ${insertError.code ?? "n/a"}, details: ${insertError.details ?? "n/a"}, hint: ${insertError.hint ?? "n/a"})`;
    throw new Error(fullMessage);
  }
}
