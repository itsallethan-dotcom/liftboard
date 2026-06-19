import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AiAgentKey, AiChatMessage } from "@/types/ai";
import type { SupabaseClient } from "@supabase/supabase-js";

type DbMessageRow = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

type DbConversationRow = {
  id: string;
  user_id: string | null;
  client_session_id: string | null;
  agent_key: string;
};

type StorageContext = {
  userId: string | null;
  clientSessionId: string;
  supabase: SupabaseClient;
  mode: "authenticated" | "guest";
};

function mapMessage(row: DbMessageRow): AiChatMessage {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
  };
}

export async function getAuthUserId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return data.user.id;
}

/**
 * Authenticated users: user-scoped server client (RLS enforced).
 * Guests: service-role client only (RLS bypassed server-side).
 */
async function resolveStorageContext(clientSessionId: string): Promise<StorageContext> {
  const userId = await getAuthUserId();

  if (userId) {
    return {
      userId,
      clientSessionId,
      supabase: await createSupabaseServerClient(),
      mode: "authenticated",
    };
  }

  return {
    userId: null,
    clientSessionId,
    supabase: requireSupabaseAdminClient(),
    mode: "guest",
  };
}

function canAccessConversation(
  conversation: DbConversationRow,
  userId: string | null,
  clientSessionId: string | null,
): boolean {
  if (userId && conversation.user_id === userId) {
    return true;
  }
  if (!userId && clientSessionId && conversation.client_session_id === clientSessionId) {
    return true;
  }
  return false;
}

async function getConversationForAccess(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<DbConversationRow | null> {
  const { data, error } = await supabase
    .from("ai_conversations")
    .select("id, user_id, client_session_id, agent_key")
    .eq("id", conversationId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as DbConversationRow;
}

async function assertConversationAccess(
  ctx: StorageContext,
  conversationId: string,
): Promise<DbConversationRow> {
  const conversation = await getConversationForAccess(ctx.supabase, conversationId);
  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  if (!canAccessConversation(conversation, ctx.userId, ctx.clientSessionId)) {
    throw new Error("Conversation access denied.");
  }

  return conversation;
}

export async function loadConversationMessages(
  conversationId: string,
  clientSessionId: string | null,
): Promise<AiChatMessage[]> {
  const ctx = await resolveStorageContext(clientSessionId ?? "");

  const conversation = await getConversationForAccess(ctx.supabase, conversationId);
  if (!conversation) {
    return [];
  }

  if (!canAccessConversation(conversation, ctx.userId, clientSessionId)) {
    return [];
  }

  const { data: messages, error: messagesError } = await ctx.supabase
    .from("ai_messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(50);

  if (messagesError || !messages) {
    return [];
  }

  return (messages as DbMessageRow[]).map(mapMessage);
}

export async function ensureConversation(params: {
  conversationId?: string | null;
  clientSessionId: string;
  agentKey: AiAgentKey;
  title?: string;
}): Promise<string> {
  const ctx = await resolveStorageContext(params.clientSessionId);

  if (params.conversationId) {
    const existing = await getConversationForAccess(ctx.supabase, params.conversationId);
    if (
      existing &&
      canAccessConversation(existing, ctx.userId, params.clientSessionId)
    ) {
      return existing.id;
    }
  }

  const insertPayload =
    ctx.mode === "authenticated"
      ? {
          user_id: ctx.userId,
          client_session_id: null,
          agent_key: params.agentKey,
          title: params.title?.slice(0, 120) ?? "Forgeonix AI Chat",
        }
      : {
          user_id: null,
          client_session_id: params.clientSessionId,
          agent_key: params.agentKey,
          title: params.title?.slice(0, 120) ?? "Forgeonix AI Chat",
        };

  const { data: created, error } = await ctx.supabase
    .from("ai_conversations")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? "Failed to create AI conversation.");
  }

  return created.id;
}

export async function appendMessage(params: {
  conversationId: string;
  clientSessionId: string;
  role: "user" | "assistant";
  content: string;
}): Promise<AiChatMessage> {
  const ctx = await resolveStorageContext(params.clientSessionId);
  await assertConversationAccess(ctx, params.conversationId);

  const { data, error } = await ctx.supabase
    .from("ai_messages")
    .insert({
      conversation_id: params.conversationId,
      role: params.role,
      content: params.content,
    })
    .select("id, role, content, created_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to save AI message.");
  }

  await ctx.supabase
    .from("ai_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", params.conversationId);

  return mapMessage(data as DbMessageRow);
}
