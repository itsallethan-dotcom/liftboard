import { requireOwnerApi } from "@/lib/auth/owner";
import {
  addBusinessContact,
  deleteBusinessContact,
  updateBusinessContact,
} from "@/lib/os/business";
import type { AddBusinessContactInput, UpdateBusinessContactInput } from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as AddBusinessContactInput;
    const contact = await addBusinessContact(raw);
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create contact.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { id, ...patch } = (await request.json()) as { id?: string } & UpdateBusinessContactInput;
    if (!id) throw new Error("id is required.");
    const contact = await updateBusinessContact(id, patch);
    return NextResponse.json(contact);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update contact.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw new Error("id is required.");
    await deleteBusinessContact(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete contact.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
