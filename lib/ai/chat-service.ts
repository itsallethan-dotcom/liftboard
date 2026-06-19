import { resolveAgent } from "@/lib/ai/agents/registry";
import { getOpenAIClient, OPENAI_CHAT_MODEL } from "@/lib/ai/openai";
import {
  appendMessage,
  ensureConversation,
  loadConversationMessages,
} from "@/lib/ai/storage";
import type { AiAgentKey, AiChatMessage, AiChatRequest, AiChatResponse } from "@/types/ai";

const MAX_CONTEXT_MESSAGES = 20;

export async function runAiChat(params: AiChatRequest & { clientSessionId: string }): Promise<AiChatResponse> {
  const trimmed = params.message.trim();
  if (!trimmed) {
    throw new Error("Message cannot be empty.");
  }

  const agentKey: AiAgentKey = params.agentKey ?? "default";
  const agent = resolveAgent(agentKey);

  const conversationId = await ensureConversation({
    conversationId: params.conversationId,
    clientSessionId: params.clientSessionId,
    agentKey: agent.key,
    title: trimmed,
  });

  const priorMessages = await loadConversationMessages(conversationId, params.clientSessionId);
  await appendMessage({
    conversationId,
    clientSessionId: params.clientSessionId,
    role: "user",
    content: trimmed,
  });

  const openai = getOpenAIClient();
  const contextMessages = priorMessages.slice(-MAX_CONTEXT_MESSAGES).map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const completion = await openai.chat.completions.create({
    model: OPENAI_CHAT_MODEL,
    messages: [
      { role: "system", content: agent.getSystemPrompt() },
      ...contextMessages,
      { role: "user", content: trimmed },
    ],
    temperature: 0.6,
  });

  const assistantContent = completion.choices[0]?.message?.content?.trim();
  if (!assistantContent) {
    throw new Error("OpenAI returned an empty response.");
  }

  const assistantMessage = await appendMessage({
    conversationId,
    clientSessionId: params.clientSessionId,
    role: "assistant",
    content: assistantContent,
  });

  const messages = await loadConversationMessages(conversationId, params.clientSessionId);

  return {
    conversationId,
    message: assistantMessage,
    messages,
  };
}

export async function fetchAiHistory(params: {
  conversationId: string;
  clientSessionId: string;
}): Promise<AiChatMessage[]> {
  return loadConversationMessages(params.conversationId, params.clientSessionId);
}
