import { addJobApplication } from "@/lib/career/queries";
import type { AddJobApplicationInput, JobApplicationStatus } from "@/types/career";
import { JOB_APPLICATION_STATUSES } from "@/types/career";
import { NextResponse } from "next/server";

function parseBody(body: unknown): AddJobApplicationInput {
  const raw = body as Record<string, unknown>;
  const status = raw.status as JobApplicationStatus | undefined;
  if (status && !JOB_APPLICATION_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${JOB_APPLICATION_STATUSES.join(", ")}`);
  }

  return {
    company_name: String(raw.company_name ?? ""),
    role_title: String(raw.role_title ?? ""),
    source: raw.source != null ? String(raw.source) : "manual",
    status,
    applied_date: raw.applied_date != null ? String(raw.applied_date) : null,
    follow_up_date: raw.follow_up_date != null ? String(raw.follow_up_date) : null,
    contact_email: raw.contact_email != null ? String(raw.contact_email) : null,
    job_url: raw.job_url != null ? String(raw.job_url) : null,
    notes: raw.notes != null ? String(raw.notes) : null,
  };
}

export async function POST(request: Request) {
  try {
    const body = parseBody(await request.json());
    const application = await addJobApplication(body);
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add application.";
    const status = message.includes("SUPABASE_SERVICE_ROLE_KEY")
      ? 503
      : message.includes("required") || message.includes("Invalid")
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
