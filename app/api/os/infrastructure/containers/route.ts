import { requireOwnerApi } from "@/lib/auth/owner";
import {
  addInfrastructureContainer,
  deleteInfrastructureContainer,
  updateInfrastructureContainer,
} from "@/lib/os/infrastructure";
import type {
  AddInfrastructureContainerInput,
  UpdateInfrastructureContainerInput,
} from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as AddInfrastructureContainerInput;
    const item = await addInfrastructureContainer(raw);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create container.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { id, ...patch } = (await request.json()) as { id?: string } & UpdateInfrastructureContainerInput;
    if (!id) throw new Error("id is required.");
    const item = await updateInfrastructureContainer(id, patch);
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update container.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw new Error("id is required.");
    await deleteInfrastructureContainer(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete container.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
