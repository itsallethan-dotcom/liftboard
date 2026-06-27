import { requireOwnerApi } from "@/lib/auth/owner";
import { addBusinessClient, updateBusinessClient } from "@/lib/os/business";
import type { AddBusinessClientInput, BusinessClient } from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const raw = (await request.json()) as AddBusinessClientInput;
    const client = await addBusinessClient(raw);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create client.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { id, ...patch } = (await request.json()) as { id?: string } & Partial<
      Pick<BusinessClient, "name" | "company" | "email" | "status" | "stage" | "notes">
    >;
    if (!id) throw new Error("id is required.");
    const client = await updateBusinessClient(id, patch);
    return NextResponse.json(client);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update client.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
