-- TABLES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  parent_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  display_name text not null,
  tags text[] not null default '{}',
  issue_date date,
  expiry_date date,
  notes text,
  storage_path text not null,
  mime_type text not null,
  size_bytes bigint not null,
  sha256 text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists documents_owner_idx on public.documents(owner_id);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ROW LEVEL SECURITY
alter table public.profiles     enable row level security;
alter table public.categories   enable row level security;
alter table public.documents    enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "own profile read"   on public.profiles;
drop policy if exists "own profile update" on public.profiles;
drop policy if exists "own categories all" on public.categories;
drop policy if exists "own documents all"  on public.documents;
drop policy if exists "own audit read"     on public.audit_events;
drop policy if exists "own audit insert"   on public.audit_events;

create policy "own profile read" on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy "own profile update" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "own categories all" on public.categories for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "own documents all" on public.documents for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "own audit read" on public.audit_events for select to authenticated
  using (owner_id = (select auth.uid()));
create policy "own audit insert" on public.audit_events for insert to authenticated
  with check (owner_id = (select auth.uid()));

-- PRIVATE STORAGE BUCKET
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vault-documents', 'vault-documents', false, 10485760,
        array['application/pdf','image/jpeg','image/png'])
on conflict (id) do update
  set public = false, file_size_limit = 10485760,
      allowed_mime_types = array['application/pdf','image/jpeg','image/png'];

drop policy if exists "own folder read"   on storage.objects;
drop policy if exists "own folder insert" on storage.objects;
drop policy if exists "own folder update" on storage.objects;
drop policy if exists "own folder delete" on storage.objects;

create policy "own folder read" on storage.objects for select to authenticated
  using (bucket_id = 'vault-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "own folder insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'vault-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "own folder update" on storage.objects for update to authenticated
  using (bucket_id = 'vault-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "own folder delete" on storage.objects for delete to authenticated
  using (bucket_id = 'vault-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);
