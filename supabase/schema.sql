-- Lishono — database schema v1
-- Run this first in the Supabase SQL editor. Then policies.sql, then (optionally) seed.sql.

-- Enums --------------------------------------------------------------------
create type user_role as enum ('contributor', 'trusted', 'reviewer', 'admin');
create type entry_status as enum ('pending', 'verified', 'disputed');
create type review_action as enum ('verify', 'dispute', 'reject');

-- Users --------------------------------------------------------------------
-- Mirrors auth.users. A trigger creates a row on signup (see bottom of file).
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  role user_role not null default 'contributor',
  dialect_background text,
  created_at timestamptz not null default now()
);

-- Entries ------------------------------------------------------------------
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  primary_latin text not null,
  serto text,
  english text not null,
  dutch text,
  category text,
  dialect_tag text,
  status entry_status not null default 'pending',
  submitter_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index entries_status_idx on public.entries (status);
create index entries_category_idx on public.entries (category);
create index entries_search_idx on public.entries
  using gin (to_tsvector('simple', coalesce(primary_latin, '') || ' ' || coalesce(english, '')));

-- Variants: groups spellings of the same word -------------------------------
create table public.entry_variants (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries (id) on delete cascade,
  latin_form text not null,
  note text
);
create index entry_variants_entry_idx on public.entry_variants (entry_id);

-- Example sentences ---------------------------------------------------------
create table public.example_sentences (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries (id) on delete cascade,
  latin text not null,
  serto text,
  english text,
  submitter_id uuid references public.users (id) on delete set null
);
create index example_sentences_entry_idx on public.example_sentences (entry_id);

-- Audio recordings (the moat) ----------------------------------------------
create table public.audio_recordings (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries (id) on delete cascade,
  file_url text not null,
  speaker_dialect text,
  submitter_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index audio_recordings_entry_idx on public.audio_recordings (entry_id);

-- Votes: one per user per entry --------------------------------------------
create table public.votes (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  value smallint not null check (value in (1, -1)),
  unique (entry_id, user_id)
);
create index votes_entry_idx on public.votes (entry_id);

-- Reviews: audit trail of verification actions ------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries (id) on delete cascade,
  reviewer_id uuid not null references public.users (id) on delete set null,
  action review_action not null,
  note text,
  created_at timestamptz not null default now()
);
create index reviews_entry_idx on public.reviews (entry_id);

-- Comments: threaded one level deep ----------------------------------------
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  parent_comment_id uuid references public.comments (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index comments_entry_idx on public.comments (entry_id);

-- Flags ---------------------------------------------------------------------
create table public.flags (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);
create index flags_entry_idx on public.flags (entry_id);

-- Auto-create a public.users row when someone signs up ----------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Convenience view: entries with vote score ---------------------------------
create or replace view public.entries_with_score as
select e.*, coalesce(sum(v.value), 0)::int as score
from public.entries e
left join public.votes v on v.entry_id = e.id
group by e.id;
