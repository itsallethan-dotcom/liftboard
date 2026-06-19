"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HudPanel } from "@/components/command/HudPanel";
import type { AiChatMessage, AiChatResponse, AiHistoryResponse } from "@/types/ai";

const STORAGE_KEY = "forgeonix-ai-conversation-id";
const SESSION_KEY = "forgeonix-ai-client-session-id";

function getOrCreateClientSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }
  const created = crypto.randomUUID();
  window.localStorage.setItem(SESSION_KEY, created);
  return created;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function AiChatPanel() {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const clientSessionIdRef = useRef("");

  useEffect(() => {
    clientSessionIdRef.current = getOrCreateClientSessionId();
    const storedConversationId = window.localStorage.getItem(STORAGE_KEY);

    if (!storedConversationId) {
      setBootstrapping(false);
      return;
    }

    setConversationId(storedConversationId);

    const loadHistory = async () => {
      try {
        const params = new URLSearchParams({
          conversationId: storedConversationId,
          clientSessionId: clientSessionIdRef.current,
        });
        const response = await fetch(`/api/ai/chat?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to load chat history.");
        }
        const data = (await response.json()) as AiHistoryResponse;
        setMessages(data.messages);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        setConversationId(null);
      } finally {
        setBootstrapping(false);
      }
    };

    void loadHistory();
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || loading) {
        return;
      }

      setError(null);
      setLoading(true);
      setInput("");

      const optimisticUser: AiChatMessage = {
        id: `optimistic-${Date.now()}`,
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      setMessages((current) => [...current, optimisticUser]);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            conversationId,
            clientSessionId: clientSessionIdRef.current,
            agentKey: "default",
          }),
        });

        const data = (await response.json()) as AiChatResponse & { error?: string };
        if (!response.ok) {
          throw new Error(data.error ?? "AI request failed.");
        }

        setConversationId(data.conversationId);
        window.localStorage.setItem(STORAGE_KEY, data.conversationId);
        setMessages(data.messages);
      } catch (submitError) {
        const message =
          submitError instanceof Error ? submitError.message : "AI request failed.";
        setError(message);
        setMessages((current) => current.filter((item) => item.id !== optimisticUser.id));
        setInput(trimmed);
      } finally {
        setLoading(false);
      }
    },
    [conversationId, input, loading],
  );

  return (
    <aside className="command-ai-chat command-boot-item" style={{ animationDelay: "0.6s" }}>
      <HudPanel label="// FORGEONIX AI" title="Jarvis" className="command-ai-chat__panel">
        <p className="command-ai-chat__status">
          <span className="command-ai-chat__status-dot" aria-hidden />
          OPERATIONS CO-PILOT ONLINE
        </p>

        <ul ref={listRef} className="command-ai-chat__messages" aria-live="polite">
          {bootstrapping ? (
            <li className="command-ai-chat__empty">Loading memory…</li>
          ) : messages.length === 0 ? (
            <li className="command-ai-chat__empty">
              Ask about Forgeonix, LiftBoard, homelab, leads, or your next move.
            </li>
          ) : (
            messages.map((message) => (
              <li
                key={message.id}
                className={`command-ai-chat__message command-ai-chat__message--${message.role}`}
              >
                <span className="command-ai-chat__meta">
                  [{formatTime(message.createdAt)}] {message.role.toUpperCase()}
                </span>
                <span className="command-ai-chat__content">{message.content}</span>
              </li>
            ))
          )}
          {loading ? (
            <li className="command-ai-chat__message command-ai-chat__message--assistant">
              <span className="command-ai-chat__meta">[···] ASSISTANT</span>
              <span className="command-ai-chat__content command-ai-chat__typing">
                Thinking<span className="command-terminal__blink">_</span>
              </span>
            </li>
          ) : null}
        </ul>

        {error ? <p className="command-ai-chat__error">{error}</p> : null}

        <form className="command-ai-chat__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="command-ai-chat__input"
            placeholder="Message Forgeonix AI…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={loading || bootstrapping}
            aria-label="AI chat message"
          />
          <button
            type="submit"
            className="command-ai-chat__submit"
            disabled={loading || bootstrapping || !input.trim()}
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </form>
      </HudPanel>
    </aside>
  );
}
