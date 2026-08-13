create table if not exists public.reading_recordings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null check (char_length(exercise_id) between 1 and 80),
  storage_path text not null unique,
  score smallint not null check (score between 0 and 100),
  passed boolean not null,
  duration_ms integer not null check (duration_ms between 0 and 300000),
  byte_size bigint not null check (byte_size between 1 and 10485760),
  mime_type text not null check (mime_type in ('audio/ogg', 'audio/opus')),
  created_at timestamptz not null default now()
);

create index if not exists reading_recordings_user_created_idx
  on public.reading_recordings (user_id, created_at desc);

alter table public.reading_recordings enable row level security;

revoke all on table public.reading_recordings from anon, authenticated;
grant select, insert, delete on table public.reading_recordings to authenticated;

drop policy if exists "Users insert their own reading recordings" on public.reading_recordings;
create policy "Users insert their own reading recordings"
  on public.reading_recordings for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users read their own reading recordings" on public.reading_recordings;
create policy "Users read their own reading recordings"
  on public.reading_recordings for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users delete their own reading recordings" on public.reading_recordings;
create policy "Users delete their own reading recordings"
  on public.reading_recordings for delete to authenticated
  using ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('reading-audios', 'reading-audios', false, 10485760, array['audio/ogg', 'audio/opus'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users upload their own opus readings" on storage.objects;
create policy "Users upload their own opus readings"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'reading-audios'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and lower(storage.extension(name)) = 'opus'
  );

drop policy if exists "Users read their own opus readings" on storage.objects;
create policy "Users read their own opus readings"
  on storage.objects for select to authenticated
  using (bucket_id = 'reading-audios' and owner_id = (select auth.uid()::text));

drop policy if exists "Users delete their own opus readings" on storage.objects;
create policy "Users delete their own opus readings"
  on storage.objects for delete to authenticated
  using (bucket_id = 'reading-audios' and owner_id = (select auth.uid()::text));
