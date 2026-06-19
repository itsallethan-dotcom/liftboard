import { osDb } from "@/lib/os/db";
import type { AddOsNoteInput, NotesDashboard, OsNote, UpdateOsNoteInput } from "@/types/forgeonix-os";
import { NOTE_TYPES } from "@/types/forgeonix-os";

export async function fetchOsNotes(): Promise<OsNote[]> {
  const { data, error } = await osDb()
    .from("os_notes")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as OsNote[];
}

export async function fetchNotesDashboard(): Promise<NotesDashboard> {
  const notes = await fetchOsNotes();
  return { notes };
}

export async function addOsNote(input: AddOsNoteInput): Promise<OsNote> {
  const title = input.title.trim();
  if (!title) throw new Error("Note title is required.");

  const noteType = input.note_type ?? "note";
  if (!NOTE_TYPES.includes(noteType)) {
    throw new Error(`Invalid note type. Allowed: ${NOTE_TYPES.join(", ")}`);
  }

  const { data, error } = await osDb()
    .from("os_notes")
    .insert({
      title,
      body: input.body ?? null,
      note_type: noteType,
      tags: input.tags ?? null,
      project_id: input.project_id ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as OsNote;
}

export async function updateOsNote(id: string, input: UpdateOsNoteInput): Promise<OsNote> {
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.body !== undefined) patch.body = input.body;
  if (input.tags !== undefined) patch.tags = input.tags;
  if (input.project_id !== undefined) patch.project_id = input.project_id;
  if (input.note_type !== undefined) patch.note_type = input.note_type;

  const { data, error } = await osDb().from("os_notes").update(patch).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data as OsNote;
}
