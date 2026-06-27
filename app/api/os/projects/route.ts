import { requireOwnerApi } from "@/lib/auth/owner";
import { addOsProject, fetchOsProjects } from "@/lib/os/projects";
import type { AddOsProjectInput, ProjectStatus } from "@/types/forgeonix-os";
import { PROJECT_STATUSES } from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

function parseProject(body: unknown): AddOsProjectInput {
  const raw = body as Record<string, unknown>;
  const status = raw.status as ProjectStatus | undefined;
  if (status && !PROJECT_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${PROJECT_STATUSES.join(", ")}`);
  }
  return {
    name: String(raw.name ?? ""),
    slug: raw.slug != null ? String(raw.slug) : null,
    description: raw.description != null ? String(raw.description) : null,
    status,
    stack: raw.stack != null ? String(raw.stack) : null,
    url: raw.url != null ? String(raw.url) : null,
    client_id: raw.client_id != null ? String(raw.client_id) : null,
    display_order: typeof raw.display_order === "number" ? raw.display_order : undefined,
  };
}

export async function GET() {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const projects = await fetchOsProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load projects.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const project = await addOsProject(parseProject(await request.json()));
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add project.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
