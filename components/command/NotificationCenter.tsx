"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NotificationRow } from "@/types/command-core";

const BORDER = "rgba(255, 122, 54, 0.25)";
const PANEL_BG = "rgba(8, 14, 20, 0.97)";

const LEVEL_COLOR: Record<string, string> = {
  info: "#ff7a36",
  success: "#4ade80",
  warn: "#fbbf24",
  critical: "#f87171",
};

/** Notification center — bell with unread badge and a dropdown feed. */
export function NotificationCenter() {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/os/notifications?limit=30");
      const json = await res.json();
      if (res.ok) {
        setItems((json.notifications as NotificationRow[]) ?? []);
        setUnread(json.unreadCount ?? 0);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const markRead = async (id: string) => {
    await fetch("/api/os/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    }).catch(() => {});
    await load();
  };

  const markAll = async () => {
    await fetch("/api/os/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
    await load();
  };

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications (${unread} unread)`}
        style={{
          position: "relative",
          background: "rgba(8, 14, 20, 0.85)",
          border: `1px solid ${BORDER}`,
          borderRadius: 4,
          color: "#dffaff",
          cursor: "pointer",
          padding: "6px 8px",
          lineHeight: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M10 20a2 2 0 004 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {unread > 0 ? (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 8,
              background: "#f87171",
              color: "#0a0a0a",
              font: "10px/16px ui-monospace, monospace",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 320,
            maxHeight: 380,
            overflowY: "auto",
            background: PANEL_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 6,
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            zIndex: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "9px 12px",
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <span
              style={{
                color: "#9ad",
                font: "10px ui-monospace, monospace",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Notifications
            </span>
            {unread > 0 ? (
              <button
                type="button"
                onClick={markAll}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff7a36",
                  cursor: "pointer",
                  font: "10px ui-monospace, monospace",
                }}
              >
                Mark all read
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <p style={{ padding: 12, color: "#7aa", font: "11px ui-monospace, monospace" }}>
              No notifications.
            </p>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => !n.read && markRead(n.id)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: n.read ? "transparent" : "rgba(255, 122, 54, 0.06)",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  borderLeft: `3px solid ${LEVEL_COLOR[n.level] ?? "#ff7a36"}`,
                  cursor: n.read ? "default" : "pointer",
                  padding: "9px 12px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "#e6feff",
                    font: "12px ui-monospace, monospace",
                    fontWeight: n.read ? 400 : 600,
                  }}
                >
                  {n.title}
                </span>
                {n.body ? (
                  <span
                    style={{
                      display: "block",
                      color: "#8aa",
                      font: "11px ui-monospace, monospace",
                      marginTop: 2,
                    }}
                  >
                    {n.body}
                  </span>
                ) : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
