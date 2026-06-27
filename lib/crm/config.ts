/**
 * Forgeonix CRM — data-source switch (Phase 1).
 *
 * The UI never decides where data comes from; the service layer does, based on
 * this flag. Demo mode → in-memory demo data. Live mode → Supabase.
 *
 * Resolution order:
 *   1. Explicit env flag `NEXT_PUBLIC_FORGEONIX_DEMO` / `FORGEONIX_DEMO`
 *      ("true" / "1" → demo on, anything else → demo off).
 *   2. Otherwise: demo on only when Supabase isn't configured, so the OS works
 *      out of the box with zero backend setup.
 */
export function isDemoMode(): boolean {
  const flag =
    process.env.NEXT_PUBLIC_FORGEONIX_DEMO ?? process.env.FORGEONIX_DEMO ?? null;
  if (flag !== null) {
    return flag === "true" || flag === "1";
  }
  return !process.env.NEXT_PUBLIC_SUPABASE_URL;
}
