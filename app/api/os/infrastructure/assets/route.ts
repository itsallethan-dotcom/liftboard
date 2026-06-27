import { requireOwnerApi } from "@/lib/auth/owner";
import {
  addInfrastructureAsset,
  deleteInfrastructureAsset,
  updateInfrastructureAsset,
} from "@/lib/os/infrastructure";
import type {
  AddInfrastructureAssetInput,
  UpdateInfrastructureAssetInput,
} from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as AddInfrastructureAssetInput;
    const item = await addInfrastructureAsset(raw);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create asset.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { id, ...patch } = (await request.json()) as { id?: string } & UpdateInfrastructureAssetInput;
    if (!id) throw new Error("id is required.");
    const item = await updateInfrastructureAsset(id, patch);
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update asset.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw new Error("id is required.");
    await deleteInfrastructureAsset(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete asset.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
