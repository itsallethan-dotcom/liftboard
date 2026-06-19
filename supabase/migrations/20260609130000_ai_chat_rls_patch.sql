-- Patch: reaffirm AI chat RLS for authenticated users (guest access is service-role API only)
-- Safe to run multiple times in Supabase SQL editor.

alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

-- Authenticated users: own rows only (user_id must match auth.uid())
drop policy if exists "ai_conversations_select_own" on public.ai_conversations;
create policy "ai_conversations_select_own"
  on public.ai_conversations for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "ai_conversations_insert_own" on public.ai_conversations;
create policy "ai_conversations_insert_own"
  on public.ai_conversations for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and user_id is not null
    and client_session_id is null
  );

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
      where c.id = conversation_id
        and c.user_id = auth.uid()
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
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  );

-- No anon policies: guest persistence is server-side via SUPABASE_SERVICE_ROLE_KEY only.

grant select, insert, update, delete on public.ai_conversations to authenticated;
grant select, insert, update, delete on public.ai_messages to authenticated;
