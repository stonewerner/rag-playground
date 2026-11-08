# P0-08: Blob storage module

**Phase:** 0 | **Status:** todo | **Depends on:** P0-01 | **Size:** S

## Why

Original uploads are kept for debugging normalization and future re-extraction (PDF in Phase 4),
and must be deletable by TTL cleanup.

## User story

As a developer, I want a minimal S3-compatible blob interface, so that uploads are stored and
deleted the same way whatever the provider.

## Scope

- Provision a private Cloudflare R2 bucket (decided in Q2) and an R2 API token scoped to it with
  Object Read & Write.
- `src/lib/blob.ts`: `putObject(key, bytes, contentType)`, `getObject(key)`, `deleteObject(key)`,
  `deletePrefix(prefix)` (paginated list + delete). Key helpers:
  `originalKey(sessionId, documentId)`.
- Choose the client (prefer a small SigV4 signer like `aws4fetch` over the full AWS SDK); record
  the choice in ADR 0004.

## Out of scope

- Upload route (P1-14). Public URLs (none; originals are served through the app if ever needed).

## Acceptance criteria

- [ ] Put/get/delete round-trip works against the real bucket (manual script `scripts/blob-smoke.ts`).
- [ ] `deletePrefix` deletes more than one page of objects (test with a fake client that pages).
- [ ] Bucket is private (unauthenticated GET fails).
- [ ] R2 token is scoped to this bucket only; ADR 0004 records the client library choice.
- [ ] `pnpm check` passes.

## Technical notes

- R2 S3 API: https://developers.cloudflare.com/r2/api/s3/api/
- R2 API tokens: https://developers.cloudflare.com/r2/api/tokens/
- aws4fetch: https://github.com/mhart/aws4fetch

## Test and eval plan

Unit tests with an injected fake transport; one manual smoke script against the real bucket.

## Demo

Run `pnpm tsx scripts/blob-smoke.ts`: put, get, list, delete.
