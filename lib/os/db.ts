import { requireSupabaseAdminClient } from "@/lib/supabase/admin";

/** Service-role client for Forgeonix OS memory (server-side only). */
export function osDb() {
  return requireSupabaseAdminClient();
}
