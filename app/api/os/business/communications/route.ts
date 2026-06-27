import { requireOwnerApi } from "@/lib/auth/owner";
import { addBusinessCommunication, deleteBusinessCommunication } from "@/lib/os/business";
import type { AddBusinessCommunicationInput } from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as AddBusinessCommunicationInput;
    const comm = await addBusinessCommunication(raw);
    return NextResponse.json(comm, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to log communication.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw new Error("id is required.");
    await deleteBusinessCommunication(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete communication.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
