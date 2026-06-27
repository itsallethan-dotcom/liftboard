import { requireOwnerApi } from "@/lib/auth/owner";
import {
  addInfrastructureIncident,
  resolveInfrastructureIncident,
} from "@/lib/os/infrastructure";
import type { AddInfrastructureIncidentInput } from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as AddInfrastructureIncidentInput;
    const item = await addInfrastructureIncident(raw);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create incident.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { id } = (await request.json()) as { id?: string };
    if (!id) throw new Error("id is required.");
    const item = await resolveInfrastructureIncident(id);
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to resolve incident.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
