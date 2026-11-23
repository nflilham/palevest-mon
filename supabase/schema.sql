-- Skema Database PostgreSQL untuk Palevest Mon (Supabase)
create table if not exists public.player_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text not null default 'Petani',
  farm_name text not null default 'Kebun Lembah',
  day integer not null default 1,
  season text not null default 'Semi',
  gold integer not null default 500,
  energy integer not null default 100,
  max_energy integer not null default 100,
  game_state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.player_saves to authenticated;

alter table public.player_saves enable row level security;

create policy "player_saves_select_own"
  on public.player_saves
  for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "player_saves_insert_own"
  on public.player_saves
  for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "player_saves_update_own"
  on public.player_saves
  for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

create policy "player_saves_delete_own"
  on public.player_saves
  for delete
  to authenticated
  using ( (select auth.uid()) = user_id );
