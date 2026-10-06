-- 002_vault_extensions.sql
-- SriramVault Phase 1 & 2 Extensions

-- WORKFLOWS
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  goal_description text,
  status text not null default 'draft', -- draft, active, completed
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- WORKFLOW REQUIREMENTS
create table if not exists public.workflow_requirements (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  document_type text not null, -- e.g., 'Aadhaar', 'Income Certificate'
  is_satisfied boolean not null default false,
  matched_document_id uuid references public.documents(id) on delete set null,
  created_at timestamptz not null default now()
);

-- SUBMISSION PACKS
create table if not exists public.submission_packs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  purpose text not null,
  recipient text not null,
  expires_at timestamptz,
  access_policy text not null default 'view_only', -- view_only, download
  created_at timestamptz not null default now()
);

-- PACK DOCUMENTS (Many-to-Many)
create table if not exists public.pack_documents (
  pack_id uuid not null references public.submission_packs(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  is_redacted boolean not null default false,
  redacted_version_id uuid references public.documents(id) on delete set null,
  primary key (pack_id, document_id)
);

-- SHARES / ACCESS LOGS
create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.submission_packs(id) on delete cascade,
  token text not null unique default gen_random_uuid()::text,
  expires_at timestamptz not null,
  view_count integer not null default 0,
  max_views integer,
  created_at timestamptz not null default now()
);

-- INTEGRITY RECORDS
create table if not exists public.integrity_records (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  sha256_hash text not null,
  verified_at timestamptz not null default now(),
  blockchain_tx_id text,
  created_at timestamptz not null default now()
);

-- OFFLINE PACKAGES (Emergency Vault)
create table if not exists public.offline_packages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  encrypted_key text not null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- ENABLE ROW LEVEL SECURITY
alter table public.workflows enable row level security;
alter table public.workflow_requirements enable row level security;
alter table public.submission_packs enable row level security;
alter table public.pack_documents enable row level security;
alter table public.shares enable row level security;
alter table public.integrity_records enable row level security;
alter table public.offline_packages enable row level security;

-- RLS POLICIES: DENY BY DEFAULT, ALLOW AUTHENTICATED OWNER

-- Workflows
create policy "own workflows all" on public.workflows for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

-- Workflow Requirements
-- Owner is inferred from workflow_id
create policy "own workflow reqs all" on public.workflow_requirements for all to authenticated
  using (workflow_id in (select id from public.workflows where owner_id = (select auth.uid())))
  with check (workflow_id in (select id from public.workflows where owner_id = (select auth.uid())));

-- Submission Packs
create policy "own packs all" on public.submission_packs for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

-- Pack Documents
create policy "own pack docs all" on public.pack_documents for all to authenticated
  using (pack_id in (select id from public.submission_packs where owner_id = (select auth.uid())))
  with check (pack_id in (select id from public.submission_packs where owner_id = (select auth.uid())));

-- Shares (Owner can manage, others can view if they have the token via edge function or specific policy)
-- For now, owner can manage:
create policy "own shares all" on public.shares for all to authenticated
  using (pack_id in (select id from public.submission_packs where owner_id = (select auth.uid())))
  with check (pack_id in (select id from public.submission_packs where owner_id = (select auth.uid())));

-- Integrity Records
create policy "own integrity all" on public.integrity_records for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

-- Offline Packages
create policy "own offline pkgs all" on public.offline_packages for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
