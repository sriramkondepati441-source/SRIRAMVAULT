-- SriramVault Full Schema (Phase 1 & 2)
-- Enable UUID and Crypto extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  mfa_enabled boolean DEFAULT false,
  vault_status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX profiles_id_idx ON public.profiles(id);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Seed Categories
INSERT INTO public.categories (name, is_default) VALUES 
('01 Identity', true), ('02 Education', true), ('03 Finance', true), 
('04 Address', true), ('05 Government', true), ('06 College', true), 
('07 Scholarships', true), ('08 Career', true), ('09 Certificates', true), 
('10 Medical', true), ('11 Travel', true), ('12 Family & Property', true), 
('13 Applications', true), ('14 Other', true)
ON CONFLICT (name) DO NOTHING;

-- 3. DOCUMENTS (The Vault)
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category_id uuid REFERENCES public.categories(id),
  subcategory text,
  description text,
  issue_date date,
  expiry_date date,
  issuing_organization text,
  document_type text,
  file_type text,
  file_size bigint,
  version integer DEFAULT 1,
  storage_path text NOT NULL UNIQUE, -- path in user-files bucket
  upload_timestamp timestamptz DEFAULT now(),
  last_verified_timestamp timestamptz,
  integrity_hash text,
  verification_status text DEFAULT 'UNVERIFIED', -- UNVERIFIED, USER_VERIFIED, DIGITAL_SIGNATURE_VERIFIED, INTEGRITY_VERIFIED
  privacy_level text DEFAULT 'standard',
  health_status text DEFAULT 'GRAY', -- GREEN, YELLOW, RED, BLUE, GRAY, ORANGE
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX documents_owner_id_idx ON public.documents(owner_id);

-- 4. DOCUMENT VERSIONS (For redactions, updates)
CREATE TABLE IF NOT EXISTS public.document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version integer NOT NULL,
  storage_path text NOT NULL,
  integrity_hash text NOT NULL,
  is_redacted boolean DEFAULT false,
  redaction_reason text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX doc_versions_doc_id_idx ON public.document_versions(document_id);

-- 5. TAGS & DOCUMENT_TAGS
CREATE TABLE IF NOT EXISTS public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  UNIQUE(owner_id, name)
);

CREATE TABLE IF NOT EXISTS public.document_tags (
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

-- 6. WORKFLOWS (Goals like "Scholarship Application")
CREATE TABLE IF NOT EXISTS public.workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workflow_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  is_mandatory boolean DEFAULT true,
  description text,
  fulfilled_by_document_id uuid REFERENCES public.documents(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- 7. SUBMISSION PACKS
CREATE TABLE IF NOT EXISTS public.submission_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  purpose text,
  recipient text,
  expires_at timestamptz,
  status text DEFAULT 'draft', -- draft, active, revoked, expired
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.submission_pack_documents (
  pack_id uuid NOT NULL REFERENCES public.submission_packs(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_id uuid REFERENCES public.document_versions(id), -- Null means latest
  PRIMARY KEY (pack_id, document_id)
);

-- 8. SHARE GRANTS
CREATE TABLE IF NOT EXISTS public.share_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_id uuid REFERENCES public.submission_packs(id) ON DELETE CASCADE,
  document_id uuid REFERENCES public.documents(id) ON DELETE CASCADE, -- If sharing a single doc
  access_type text DEFAULT 'view_only', -- view_only, download
  recipient_email text,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  is_revoked boolean DEFAULT false,
  view_count integer DEFAULT 0,
  last_accessed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CHECK (pack_id IS NOT NULL OR document_id IS NOT NULL)
);

-- 9. SECURITY EVENTS (Audit Log)
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- e.g., 'document_accessed', 'share_created', 'login'
  description text,
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- 10. INTEGRITY RECORDS
CREATE TABLE IF NOT EXISTS public.integrity_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_id uuid REFERENCES public.document_versions(id) ON DELETE CASCADE,
  hash_algorithm text DEFAULT 'SHA-256',
  hash_value text NOT NULL,
  blockchain_anchor_tx text,
  created_at timestamptz DEFAULT now()
);

-- ROW LEVEL SECURITY (RLS) POLICIES --

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_pack_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrity_records ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see and edit their own profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories: Everyone can read categories
CREATE POLICY "Categories are readable by all" ON public.categories FOR SELECT TO authenticated USING (true);

-- Documents: Strict owner-only access
CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own documents" ON public.documents FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own documents" ON public.documents FOR DELETE USING (auth.uid() = owner_id);

-- Document Versions: Strict owner-only access
CREATE POLICY "Users can view own document versions" ON public.document_versions FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own document versions" ON public.document_versions FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own document versions" ON public.document_versions FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own document versions" ON public.document_versions FOR DELETE USING (auth.uid() = owner_id);

-- Tags
CREATE POLICY "Users can manage own tags" ON public.tags FOR ALL USING (auth.uid() = owner_id);

-- Document Tags (relies on document ownership for simplicity, but better to check tag owner too)
CREATE POLICY "Users can manage own document tags" ON public.document_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM public.documents d WHERE d.id = document_id AND d.owner_id = auth.uid())
);

-- Workflows
CREATE POLICY "Users can manage own workflows" ON public.workflows FOR ALL USING (auth.uid() = owner_id);

-- Workflow Requirements
CREATE POLICY "Users can manage own workflow requirements" ON public.workflow_requirements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.workflows w WHERE w.id = workflow_id AND w.owner_id = auth.uid())
);

-- Submission Packs
CREATE POLICY "Users can manage own submission packs" ON public.submission_packs FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own pack documents" ON public.submission_pack_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.submission_packs p WHERE p.id = pack_id AND p.owner_id = auth.uid())
);

-- Share Grants
CREATE POLICY "Users can manage own share grants" ON public.share_grants FOR ALL USING (auth.uid() = owner_id);

-- Security Events
CREATE POLICY "Users can view own security events" ON public.security_events FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own security events" ON public.security_events FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Integrity Records
CREATE POLICY "Users can view own integrity records" ON public.integrity_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.documents d WHERE d.id = document_id AND d.owner_id = auth.uid())
);
CREATE POLICY "Users can insert own integrity records" ON public.integrity_records FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.documents d WHERE d.id = document_id AND d.owner_id = auth.uid())
);

-- STORAGE BUCKET POLICIES (Private Bucket)
-- Ensure 'user-files' bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-files', 'user-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: Users can only upload and read files in their own folder (folder name = user_id)
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text
  ) WITH CHECK (
    bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Trigger for Profile Creation on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists so we can recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
