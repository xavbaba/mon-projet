-- Run this in the Supabase SQL Editor to create the analyses table

create table if not exists analyses (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  epoch text not null default '',
  usage text not null default '',
  estimated_value text not null default '',
  description text not null default '',
  similar_items jsonb not null default '[]',
  image_uri text not null default '',
  created_at timestamptz not null default now()
);

-- Index for fast user history queries
create index if not exists idx_analyses_user_id on analyses(user_id);

-- Row Level Security: users can only read their own analyses
alter table analyses enable row level security;

create policy "Users can read own analyses"
  on analyses for select
  using (auth.uid() = user_id);

create policy "Service role can insert analyses"
  on analyses for insert
  with check (true);
