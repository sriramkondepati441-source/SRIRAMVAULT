# SriramVault Architecture & Implementation Plan

## 1. Current Project Structure

The existing project is a Next.js (App Router) application initialized with Supabase. 

**Root Directory:**
- `.env`, `.env.example`
- `package.json`, `package-lock.json`
- `next.config.ts`, `tsconfig.json`, `tailwind.config`
- `eslint.config.mjs`, `postcss.config.mjs`
- `SECURITY.md`, `README.md`, `AGENTS.md`

**Source Code (`src/`):**
- `app/`: Next.js App Router containing directories for `actions`, `api`, `auth`, `category`, `checklists`, `dashboard`, `documents`, `forgot-password`, `login`, `profile`, `reset-password`, `settings`, `signup`, `upload`.
- `components/`: React components.
- `lib/`, `utils/`: Utility functions and library wrappers.
- `proxy.ts`

**Supabase (`supabase/`):**
- `config.toml`
- `migrations/`
- `schema.sql`: Contains a basic initial schema with a `files` table and some basic RLS policies.

## 2. Recommended Architecture

We will build upon the existing Next.js App Router and Supabase foundation, expanding it to meet the requirements of a high-security document intelligence platform.

- **Frontend:** Next.js Server Components for secure data fetching, Client Components for interactive UI (Dashboard, Office Mode).
- **Backend:** Next.js Server Actions for mutations (uploading, sharing), API Routes for webhooks or external integrations.
- **Authentication & Authorization:** Supabase Auth with strict Row Level Security (RLS) in PostgreSQL.
- **Storage:** Supabase Storage using strictly private buckets with signed URLs for temporary access.
- **AI Abstraction Layer:** A generic interface in `src/lib/ai` that can connect to any AI provider (or local deterministic fallbacks) without leaking sensitive keys to the client.
- **State Management:** React Context/Hooks for local state, Next.js cache/revalidation for server state.

## 3. Technology Stack

- **Framework:** Next.js 16 (App Router)
- **UI/Styling:** React 19, Tailwind CSS v4, Lucide React (icons), `clsx`/`tailwind-merge`
- **Database & Auth:** Supabase (PostgreSQL, Auth, Storage)
- **Forms & Validation:** React Hook Form, Zod
- **Testing:** Vitest (Unit/Integration), Playwright (E2E) *(To be configured)*
- **Security:** Helmet/Secure Headers, CSP, DOMPurify (if needed for HTML rendering)

## 4. Database Schema (Target)

To support the full feature set, we will need to expand the existing schema into the following core entities:

- **`users` / `profiles`**: Extended user metadata, MFA status, vault preferences.
- **`documents`**: Core metadata (owner, category, issue/expiry dates, health status).
- **`document_versions`**: Tracking changes, redactions, and file hashes.
- **`categories` & `tags`**: For organization and search.
- **`workflows` & `workflow_requirements`**: To map user goals (e.g., "Scholarship") to required document types.
- **`submission_packs`**: Collections of documents prepared for a specific recipient.
- **`share_grants`**: Short-lived, auditable access tokens for submission packs or individual files.
- **`security_events` / `audit_logs`**: Tracking access, shares, and security-critical actions.
- **`integrity_records`**: Cryptographic hashes of document versions for verification.

## 5. Security Architecture

**Defense-in-Depth Approach:**
- **Network:** HTTPS only, secure cookies, HSTS.
- **Application:** CSP headers to prevent XSS, Server Actions to prevent CSRF, Zod for strict input validation.
- **Authentication:** Supabase Auth (JWT), sessions bound to devices, explicit MFA support.
- **Authorization (Crucial):** 
  - **No Client Trust:** Server-side checks for every document request.
  - **Database Level:** Default `DENY` Row Level Security (RLS) policies. Only `auth.uid() = owner_id` can `SELECT`/`INSERT`/`UPDATE`/`DELETE`.
- **Storage:** Private buckets only. Temporary Signed URLs for downloads/views, never permanent public links.
- **AI Privacy:** AI engine only receives abstract goals and document metadata (e.g., "User has an expiring Income Certificate"), never raw document contents unless explicitly configured and consented by the user.

## 6. Threat Model (Summary)

*A full `THREAT_MODEL.md` will be generated at the end of the project.*

| Threat | Impact | Mitigation |
|---|---|---|
| **Stolen Password** | Full vault access | MFA, Device tracking, Session invalidation. |
| **IDOR (Cross-user access)** | Data breach | Strict RLS, server-side ownership checks on all endpoints. |
| **Malicious File Upload** | Malware distribution / XSS | Strict MIME-type checking, size limits, CSP, never rendering user files as HTML. |
| **Share Link Leakage** | Unauthorized access to pack | Short expirations, explicit revocation, view limits, audit logging. |

## 7. Implementation Phases

1. **PHASE 1:** Architecture, Threat model, Database design, UI shell. *(Current)*
2. **PHASE 2:** Authentication, User vault, Database, RLS.
3. **PHASE 3:** Secure document upload/storage, Search, Preview, Categories.
4. **PHASE 4:** Document health, Expiry, Missing documents.
5. **PHASE 5:** AI requirement engine, Workflow engine.
6. **PHASE 6:** Submission Packs, Minimum Disclosure, Redaction.
7. **PHASE 7:** Office Mode, Emergency Vault.
8. **PHASE 8:** Integrity verification.
9. **PHASE 9:** Optional blockchain.
10. **PHASE 10:** Security testing, Performance testing, Accessibility testing, Backup testing.
11. **PHASE 11:** Deployment preparation & Final Reports.

## 8. Conflicts with the Existing Project

- **`schema.sql`:** The existing `schema.sql` has a rudimentary `files` table and a `user-files` bucket. This will need to be significantly expanded and potentially restructured to support `documents`, `document_versions`, and the new RLS models. We will use Supabase migrations to safely transition or recreate the schema.
- **Existing Routes:** The current `src/app` directory has many placeholder routes (`dashboard`, `checklists`, `documents`, etc.). We will need to ensure these align with the new architecture and refactor them to use the robust server-side validation and data fetching required by the security spec.
- **Synthetic Data:** We will need to create robust seed scripts for development to ensure we only use synthetic data (Aadhaar_Demo.pdf, etc.) as requested.

---
**Status:** Awaiting architectural confirmation to proceed with Phase 1 and Phase 2 implementation.
