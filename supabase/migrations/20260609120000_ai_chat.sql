-- Forgeonix AI chat memory (apply in Supabase SQL editor or `supabase db push`)
-- Requires: OPENAI_API_KEY on the Next.js server
-- Recommended: SUPABASE_SERVICE_ROLE_KEY for anonymous session persistence via API routes

create extension if not exists pgcrypto;

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  client_session_id text,
  agent_key text not null default 'default',
  title text not null default 'Forgeonix AI Chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_conversations_owner_check check (
    user_id is not null or client_session_id is not null
  )
);

create index if not exists ai_conversations_user_id_idx
  on public.ai_conversations (user_id);

create index if not exists ai_conversations_client_session_idx
  on public.ai_conversations (client_session_id);

create index if not exists ai_conversations_updated_at_idx
  on public.ai_conversations (updated_at desc);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now(),
  constraint ai_messages_content_len check (char_length(trim(content)) > 0)
);

create index if not exists ai_messages_conversation_id_idx
  on public.ai_messages (conversation_id, created_at);

-- updated_at trigger
create or replace function public.set_ai_conversations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ai_conversations_set_updated_at on public.ai_conversations;
create trigger ai_conversations_set_updated_at
  before update on public.ai_conversations
  for each row execute function public.set_ai_conversations_updated_at();

-- RLS
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

drop policy if exists "ai_conversations_select_own" on public.ai_conversations;
create policy "ai_conversations_select_own"
  on public.ai_conversations for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "ai_conversations_insert_own" on public.ai_conversations;
create policy "ai_conversations_insert_own"
  on public.ai_conversations for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "ai_conversations_update_own" on public.ai_conversations;
create policy "ai_conversations_update_own"
  on public.ai_conversations for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "ai_messages_select_via_conversation" on public.ai_messages;
create policy "ai_messages_select_via_conversation"
  on public.ai_messages for select
  to authenticated
  using (
    exists (
      select 1
      from public.ai_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "ai_messages_insert_via_conversation" on public.ai_messages;
create policy "ai_messages_insert_via_conversation"
  on public.ai_messages for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.ai_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

-- API routes use the service role for guest session persistence.
grant select, insert, update, delete on public.ai_conversations to authenticated;
grant select, insert, update, delete on public.ai_messages to authenticated;
