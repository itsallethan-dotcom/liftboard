import { fetchCareerDashboard } from "@/lib/career/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await fetchCareerDashboard();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load career data.";
    const status = message.includes("SUPABASE_SERVICE_ROLE_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
