-- Lishono — Row Level Security v1
-- Run AFTER schema.sql. The anon key is safe to ship to clients because these
-- policies decide what each request can actually do.

-- Helper: is the current user a reviewer or admin? -------------------------
create or replace function public.is_reviewer()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role in ('reviewer', 'admin')
  );
$$;

-- Enable RLS on every table -------------------------------------------------
alter table public.users enable row level security;
alter table public.entries enable row level security;
alter table public.entry_variants enable row level security;
alter table public.example_sentences enable row level security;
alter table public.audio_recordings enable row level security;
alter table public.votes enable row level security;
alter table public.reviews enable row level security;
alter table public.comments enable row level security;
alter table public.flags enable row level security;

-- USERS ---------------------------------------------------------------------
create policy "profiles are public" on public.users
  for select using (true);
create policy "users update own profile" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);
-- Note: changing your own `role` should be blocked by a column-level grant or
-- trigger in production. Role promotion is done by admins out-of-band.

-- ENTRIES -------------------------------------------------------------------
create policy "entries are public" on public.entries
  for select using (true);
create policy "logged-in users submit entries" on public.entries
  for insert with check (auth.uid() = submitter_id);
create policy "submitter or reviewer edits entry" on public.entries
  for update using (auth.uid() = submitter_id or public.is_reviewer());
create policy "reviewer deletes entry" on public.entries
  for delete using (public.is_reviewer());

-- ENTRY VARIANTS ------------------------------------------------------------
create policy "variants are public" on public.entry_variants
  for select using (true);
create policy "logged-in users add variants" on public.entry_variants
  for insert with check (auth.uid() is not null);
create policy "reviewer manages variants" on public.entry_variants
  for all using (public.is_reviewer()) with check (public.is_reviewer());

-- EXAMPLE SENTENCES ---------------------------------------------------------
create policy "examples are public" on public.example_sentences
  for select using (true);
create policy "logged-in users add examples" on public.example_sentences
  for insert with check (auth.uid() = submitter_id);

-- AUDIO ---------------------------------------------------------------------
create policy "audio is public" on public.audio_recordings
  for select using (true);
create policy "logged-in users add audio" on public.audio_recordings
  for insert with check (auth.uid() = submitter_id);

-- VOTES ---------------------------------------------------------------------
create policy "votes are public" on public.votes
  for select using (true);
create policy "users manage own votes" on public.votes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- REVIEWS -------------------------------------------------------------------
create policy "reviews are public" on public.reviews
  for select using (true);
create policy "only reviewers write reviews" on public.reviews
  for insert with check (public.is_reviewer() and auth.uid() = reviewer_id);

-- COMMENTS ------------------------------------------------------------------
create policy "comments are public" on public.comments
  for select using (true);
create policy "logged-in users comment" on public.comments
  for insert with check (auth.uid() = user_id);
create policy "author or reviewer edits comment" on public.comments
  for update using (auth.uid() = user_id or public.is_reviewer());
create policy "author or reviewer deletes comment" on public.comments
  for delete using (auth.uid() = user_id or public.is_reviewer());

-- FLAGS ---------------------------------------------------------------------
create policy "reviewers read flags" on public.flags
  for select using (public.is_reviewer());
create policy "logged-in users flag" on public.flags
  for insert with check (auth.uid() = user_id);
