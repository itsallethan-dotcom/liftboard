export type AiMessageRole = "user" | "assistant" | "system";

export type AiChatMessage = {
  id: string;
  role: AiMessageRole;
  content: string;
  createdAt: string;
};

export type AiAgentKey =
  | "default"
  | "note"
  | "lead"
  | "project"
  | "content"
  | "infrastructure";

export type AiChatRequest = {
  message: string;
  conversationId?: string | null;
  clientSessionId?: string | null;
  agentKey?: AiAgentKey;
};

export type AiChatResponse = {
  conversationId: string;
  message: AiChatMessage;
  messages: AiChatMessage[];
};

export type AiHistoryResponse = {
  conversationId: string | null;
  messages: AiChatMessage[];
};
