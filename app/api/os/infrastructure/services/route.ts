import { requireOwnerApi } from "@/lib/auth/owner";
import {
  addInfrastructureService,
  deleteInfrastructureService,
  updateInfrastructureService,
} from "@/lib/os/infrastructure";
import type {
  AddInfrastructureServiceInput,
  UpdateInfrastructureServiceInput,
} from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as AddInfrastructureServiceInput;
    const item = await addInfrastructureService(raw);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create service.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { id, ...patch } = (await request.json()) as { id?: string } & UpdateInfrastructureServiceInput;
    if (!id) throw new Error("id is required.");
    const item = await updateInfrastructureService(id, patch);
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update service.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw new Error("id is required.");
    await deleteInfrastructureService(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete service.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
