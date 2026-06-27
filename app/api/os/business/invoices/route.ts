import { requireOwnerApi } from "@/lib/auth/owner";
import {
  addBusinessInvoice,
  deleteBusinessInvoice,
  updateBusinessInvoice,
} from "@/lib/os/business";
import type { AddBusinessInvoiceInput, UpdateBusinessInvoiceInput } from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as AddBusinessInvoiceInput;
    const invoice = await addBusinessInvoice(raw);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create invoice.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { id, ...patch } = (await request.json()) as { id?: string } & UpdateBusinessInvoiceInput;
    if (!id) throw new Error("id is required.");
    const invoice = await updateBusinessInvoice(id, patch);
    return NextResponse.json(invoice);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update invoice.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw new Error("id is required.");
    await deleteBusinessInvoice(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete invoice.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
