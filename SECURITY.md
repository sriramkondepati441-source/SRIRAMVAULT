# SriramVault Security Architecture

SriramVault is designed with zero-trust principles, leveraging Supabase's Row Level Security (RLS) to ensure absolute tenant isolation at the database and storage level. 

## What Row Level Security (RLS) PROTECTS

1. **Absolute Data Isolation**: Even if a hacker finds an API endpoint or injects code to request another user's documents (`SELECT * FROM documents WHERE owner_id = 'target-user'`), Postgres itself will return 0 rows. The query simply acts as if the other user's data does not exist.
2. **Storage Isolation**: Our bucket policies use `storage.foldername(name)[1] = auth.uid()`. This guarantees that no user can list, read, or overwrite files stored in another user's directory.
3. **Malicious ID Spoofing**: Because the RLS policies use `(select auth.uid())`, they rely strictly on the cryptographically signed JWT token verified by the Supabase server. A malicious user cannot spoof an API request to act as another user.
4. **Audit Trail Integrity**: The `audit_events` table policy enforces `with check (owner_id = (select auth.uid()))`. Users cannot insert fake audit logs under someone else's identity.

## What Row Level Security DOES NOT Protect

1. **Denial of Service (DoS)**: RLS restricts *who* can access data, but not *how often*. An authenticated user could spam API endpoints. We mitigate this using Next.js Rate Limiting (Phase 7).
2. **File Content Integrity**: RLS protects access to the file, but if an attacker uploads malware within their own permitted directory, RLS doesn't care. We mitigate this by verifying magic bytes (PDF, JPG, PNG) and strictly computing SHA-256 hashes during the upload API route, preventing malicious executables masked as PDFs.
3. **Stolen Sessions**: If a user's browser is compromised and their HTTP-Only cookie is stolen, the attacker assumes that user's identity. RLS cannot distinguish between the real user and the attacker if the session is hijacked.
4. **Data at Rest (Zero Knowledge)**: While Supabase encrypts data at rest via Postgres TDE (Transparent Data Encryption), the database administrators (or Supabase support) could technically read the database. True end-to-end encryption (Zero Knowledge) requires encrypting files locally via AES-256 in the browser before they are uploaded (Phase 6).

## Security Best Practices
- **Never expose the Service Role Key**: The `SUPABASE_SERVICE_ROLE_KEY` bypasses ALL Row Level Security. It is stored exclusively on the server and is never exposed to the client.
- **Server Actions over APIs**: All critical operations (Auth, Password changes) route through strict Next.js Server Actions with Zod validation to ensure no tampered requests reach the database.
