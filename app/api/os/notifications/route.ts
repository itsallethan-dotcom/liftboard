import { requireOwnerApi } from "@/lib/auth/owner";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/os/command-core";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = Number(searchParams.get("limit")) || 50;
    const notifications = await fetchNotifications({ unreadOnly, limit });
    const unreadCount = notifications.filter((n) => !n.read).length;
    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load notifications.";
    return NextResponse.json({ error: message }, { status: message.includes("SUPABASE") ? 503 : 500 });
  }
}

export async function PATCH(request: Request) {
  const denied = await requireOwnerApi();
  if (denied) return denied;
  try {
    const body = (await request.json()) as { id?: string; read?: boolean; all?: boolean };
    if (body.all) {
      await markAllNotificationsRead();
      return NextResponse.json({ ok: true });
    }
    if (!body.id) throw new Error("Notification id is required.");
    const updated = await markNotificationRead(body.id, body.read ?? true);
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update notification.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
