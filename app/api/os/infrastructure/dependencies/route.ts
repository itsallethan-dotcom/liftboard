import { requireOwnerApi } from "@/lib/auth/owner";
import {
  addInfrastructureDependency,
  deleteInfrastructureDependency,
} from "@/lib/os/infrastructure";
import type { AddInfrastructureDependencyInput } from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as AddInfrastructureDependencyInput;
    const item = await addInfrastructureDependency(raw);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create dependency.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw new Error("id is required.");
    await deleteInfrastructureDependency(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete dependency.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
