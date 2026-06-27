import { NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/auth/owner";
import { getCrmDashboard } from "@/lib/crm/queries";

/**
 * Single-call CRM dashboard: stats + recent activity + the snapshot they were
 * computed from. One round trip instead of many entity requests.
 */
export async function GET() {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    return NextResponse.json(await getCrmDashboard());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load CRM dashboard.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
