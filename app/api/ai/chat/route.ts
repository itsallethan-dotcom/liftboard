import { fetchAiHistory, runAiChat } from "@/lib/ai/chat-service";
import type { AiAgentKey, AiChatRequest } from "@/types/ai";
import { NextResponse } from "next/server";

function parseAgentKey(value: unknown): AiAgentKey | undefined {
  const keys: AiAgentKey[] = [
    "default",
    "note",
    "lead",
    "project",
    "content",
    "infrastructure",
  ];
  return typeof value === "string" && keys.includes(value as AiAgentKey)
    ? (value as AiAgentKey)
    : undefined;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const clientSessionId = searchParams.get("clientSessionId");

    if (!conversationId || !clientSessionId) {
      return NextResponse.json({ conversationId: null, messages: [] });
    }

    const messages = await fetchAiHistory({ conversationId, clientSessionId });
    return NextResponse.json({ conversationId, messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load AI history.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AiChatRequest;
    const message = typeof body.message === "string" ? body.message : "";
    const clientSessionId =
      typeof body.clientSessionId === "string" && body.clientSessionId.length > 0
        ? body.clientSessionId
        : crypto.randomUUID();

    const result = await runAiChat({
      message,
      conversationId: body.conversationId ?? null,
      clientSessionId,
      agentKey: parseAgentKey(body.agentKey),
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI chat request failed.";
    const status = message.includes("OPENAI_API_KEY") || message.includes("SUPABASE_SERVICE_ROLE_KEY")
      ? 503
      : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
