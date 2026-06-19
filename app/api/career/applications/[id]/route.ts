import { updateJobApplication } from "@/lib/career/queries";
import type { JobApplicationStatus, UpdateJobApplicationInput } from "@/types/career";
import { JOB_APPLICATION_STATUSES } from "@/types/career";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

function parsePatch(body: unknown): UpdateJobApplicationInput {
  const raw = body as Record<string, unknown>;
  const patch: UpdateJobApplicationInput = {};

  if (raw.company_name !== undefined) patch.company_name = String(raw.company_name);
  if (raw.role_title !== undefined) patch.role_title = String(raw.role_title);
  if (raw.source !== undefined) patch.source = String(raw.source);
  if (raw.status !== undefined) {
    const status = raw.status as JobApplicationStatus;
    if (!JOB_APPLICATION_STATUSES.includes(status)) {
      throw new Error(`Invalid status. Allowed: ${JOB_APPLICATION_STATUSES.join(", ")}`);
    }
    patch.status = status;
  }
  if (raw.applied_date !== undefined) {
    patch.applied_date = raw.applied_date ? String(raw.applied_date) : null;
  }
  if (raw.follow_up_date !== undefined) {
    patch.follow_up_date = raw.follow_up_date ? String(raw.follow_up_date) : null;
  }
  if (raw.contact_email !== undefined) {
    patch.contact_email = raw.contact_email ? String(raw.contact_email) : null;
  }
  if (raw.job_url !== undefined) patch.job_url = raw.job_url ? String(raw.job_url) : null;
  if (raw.notes !== undefined) patch.notes = raw.notes ? String(raw.notes) : null;

  return patch;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const patch = parsePatch(await request.json());
    const application = await updateJobApplication(id, patch);
    return NextResponse.json(application);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update application.";
    const status = message.includes("SUPABASE_SERVICE_ROLE_KEY")
      ? 503
      : message.includes("Invalid") || message.includes("required")
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
