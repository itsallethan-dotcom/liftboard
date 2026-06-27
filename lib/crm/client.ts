/**
 * Forgeonix CRM — browser fetch helpers (Phases 4–7).
 * Thin wrappers over the source-agnostic /api/crm/* endpoints. The UI uses these
 * and never knows whether demo or Supabase is behind them.
 *
 * `seg` is the URL segment: clients | leads | tasks | follow-ups | proposals | revenue | notes
 */
async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const json = (await res.json().catch(() => ({}))) as unknown;
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? "Request failed.");
  }
  return json as T;
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const crmApi = {
  list: <T>(seg: string) => req<T[]>(`/api/crm/${seg}`),
  get: <T>(seg: string, id: string) => req<T>(`/api/crm/${seg}/${id}`),
  create: <T>(seg: string, body: unknown) => req<T>(`/api/crm/${seg}`, jsonInit("POST", body)),
  update: <T>(seg: string, id: string, patch: unknown) =>
    req<T>(`/api/crm/${seg}/${id}`, jsonInit("PATCH", patch)),
  remove: (seg: string, id: string) => req<{ ok: boolean }>(`/api/crm/${seg}/${id}`, { method: "DELETE" }),
};
