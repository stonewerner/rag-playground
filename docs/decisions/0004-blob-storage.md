# ADR 0004: S3-compatible blob storage behind a small interface

**Status:** accepted (provider open: open-questions Q2) · **Date:** 2026-11-07

## Context

Original uploads should be kept for re-normalization and "view original", and later for PDFs
(Phase 4). Normalized text lives in Postgres; EDGAR fixtures are committed to git.

## Decision

A minimal module `src/lib/blob.ts` with `put`, `get`, `delete`, and `deletePrefix`, speaking the S3
API to any S3-compatible provider (R2, Supabase Storage S3 endpoint). Keys:
`sessions/<session_id>/originals/<document_id>`. Provider is chosen by env vars only.
Implementation should prefer a small signing client (e.g. `aws4fetch`) over the full AWS SDK;
the story that implements it records the final choice here.

## Alternatives considered

- **Store originals in Postgres (`bytea`):** simplest, but bloats the DB and the free-tier limit.
- **Vercel Blob:** easy, but not S3-compatible, so harder to swap.
- **No originals at all:** viable for md/txt, but loses debuggability of HTML normalization and
  blocks PDF re-extraction.

## Consequences

One small dependency. TTL cleanup deletes `sessions/<id>/` prefixes. Uploads go through a route
handler (≤ 1 MB cap, under Vercel's request body limit), so no presigned client uploads are needed.
