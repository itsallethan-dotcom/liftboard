/**
 * Forgeonix CRM — route factory (Phase 2).
 *
 * Produces identical owner-gated REST handlers for every entity, so each route
 * file is two lines. Collection routes: GET (list) + POST (create). Item routes:
 * GET (read) + PATCH (update) + DELETE (remove).
 */
import { NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/auth/owner";
import { getEntity, listEntity } from "@/lib/crm/queries";
import { createEntity, deleteEntity, updateEntity } from "@/lib/crm/mutations";
import type { CrmEntityKey } from "@/lib/crm/types";

function fail(error: unknown, fallback: string): NextResponse {
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status: 400 });
}

export function makeCollectionRoute(key: CrmEntityKey) {
  async function GET() {
    const denied = await requireOwnerApi();
    if (denied) return denied;
    try {
      return NextResponse.json(await listEntity(key));
    } catch (error) {
      return fail(error, "Failed to list records.");
    }
  }

  async function POST(request: Request) {
    const denied = await requireOwnerApi();
    if (denied) return denied;
    try {
      const body = (await request.json()) as Record<string, unknown>;
      const row = await createEntity(key, body);
      return NextResponse.json(row, { status: 201 });
    } catch (error) {
      return fail(error, "Failed to create record.");
    }
  }

  return { GET, POST };
}

type ItemContext = { params: Promise<{ id: string }> };

export function makeItemRoute(key: CrmEntityKey) {
  async function GET(_request: Request, ctx: ItemContext) {
    const denied = await requireOwnerApi();
    if (denied) return denied;
    try {
      const { id } = await ctx.params;
      const row = await getEntity(key, id);
      if (!row) return NextResponse.json({ error: "Not found." }, { status: 404 });
      return NextResponse.json(row);
    } catch (error) {
      return fail(error, "Failed to fetch record.");
    }
  }

  async function PATCH(request: Request, ctx: ItemContext) {
    const denied = await requireOwnerApi();
    if (denied) return denied;
    try {
      const { id } = await ctx.params;
      const patch = (await request.json()) as Record<string, unknown>;
      const row = await updateEntity(key, id, patch);
      if (!row) return NextResponse.json({ error: "Not found." }, { status: 404 });
      return NextResponse.json(row);
    } catch (error) {
      return fail(error, "Failed to update record.");
    }
  }

  async function DELETE(_request: Request, ctx: ItemContext) {
    const denied = await requireOwnerApi();
    if (denied) return denied;
    try {
      const { id } = await ctx.params;
      const ok = await deleteEntity(key, id);
      if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
      return NextResponse.json({ ok: true });
    } catch (error) {
      return fail(error, "Failed to delete record.");
    }
  }

  return { GET, PATCH, DELETE };
}
