# P0-11: Guest TTL cleanup cron

**Phase:** 0 | **Status:** todo | **Depends on:** P0-04, P0-06, P0-08, P0-09 | **Size:** M

## Why

Guest data, blobs, and namespaces must not accumulate: namespaces are capped at 100 per index on
Starter, and storage costs money. Cleanup is part of guarding the bill.

## User story

As the owner, I want idle guest sessions and everything they own deleted automatically, so that
the demo stays within quotas without manual work.

## Scope

- `GET /api/cron/cleanup`, authorized by `Authorization: Bearer ${CRON_SECRET}`.
- For each session with `expires_at < now()` (bounded batch per invocation): delete Pinecone
  namespaces for its index configs in both indexes (ignore not-found), delete blob prefix
  `sessions/<id>/`, then delete the session row (cascade).
- Prune `rate_limit_buckets` older than 2 days.
- Sweep ingestion jobs with expired leases (mark for resume; actual resume logic lands in P1-12).
- `vercel.json` cron entry (daily). Structured log summary: sessions deleted, namespaces deleted,
  errors.
- Partial failure safety: a session whose namespace deletion fails is retried next run and its row
  is not deleted.

## Out of scope

- Shared corpus (never deleted). Manual admin UI.

## Acceptance criteria

- [ ] Unauthorized calls return 401.
- [ ] Integration test with fakes: expired session with 2 configs → 4 namespace deletions, blob
      prefix deletion, row deleted; unexpired session untouched; shared corpus untouched.
- [ ] Namespace deletion failure leaves the row for retry.
- [ ] Cron configured and verified once in production (Vercel cron log screenshot or note).
- [ ] Open question Q7 (TTL) resolved; if Supabase, confirm the cron keeps the project from pausing.
- [ ] `pnpm check` passes.

## Technical notes

- Vercel cron: https://vercel.com/docs/cron-jobs (cron sends GET; frequency limits per plan,
  verified in P0-06).
- Pinecone delete namespace (2026-07 data plane): see P0-09 links.

## Test and eval plan

Integration tests with fake Pinecone and blob clients and the test DB.

## Demo

Create a session, set its `expires_at` in the past, call the route with the secret, show it and its
namespace gone.
