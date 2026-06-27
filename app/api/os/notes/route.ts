import { requireOwnerApi } from "@/lib/auth/owner";
import { addOsNote, fetchNotesDashboard } from "@/lib/os/notes";
import type { AddOsNoteInput, NoteType } from "@/types/forgeonix-os";
import { NOTE_TYPES } from "@/types/forgeonix-os";
import { NextResponse } from "next/server";

function parseNote(body: unknown): AddOsNoteInput {
  const raw = body as Record<string, unknown>;
  const noteType = raw.note_type as NoteType | undefined;
  if (noteType && !NOTE_TYPES.includes(noteType)) {
    throw new Error(`Invalid note type. Allowed: ${NOTE_TYPES.join(", ")}`);
  }
  return {
    title: String(raw.title ?? ""),
    body: raw.body != null ? String(raw.body) : null,
    note_type: noteType,
    tags: raw.tags != null ? String(raw.tags) : null,
    project_id: raw.project_id != null ? String(raw.project_id) : null,
  };
}

export async function GET() {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    return NextResponse.json(await fetchNotesDashboard());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load notes.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const note = await addOsNote(parseNote(await request.json()));
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add note.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
