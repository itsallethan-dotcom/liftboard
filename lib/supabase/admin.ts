import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

/** Service-role client for server-side guest AI persistence. Returns null if not configured. */
export function createSupabaseAdminClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}

/** Guest AI persistence requires the service role — never expose this key to the client. */
export function requireSupabaseAdminClient(): SupabaseClient {
  const client = createSupabaseAdminClient();
  if (!client) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured on the server. Guest AI chat persistence requires this key in .env.local.",
    );
  }
  return client;
}
