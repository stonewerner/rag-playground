# P0-09: Pinecone indexes and client wrapper

**Phase:** 0 | **Status:** todo | **Depends on:** P0-01 | **Size:** M

## Why

Dense and sparse indexes with per-config namespaces are the storage layer for every retrieval
experiment. Creating them by script keeps the setup reproducible and documented.

## User story

As a developer, I want one idempotent command that creates the Pinecone indexes with the right
schemas, and a typed wrapper for upsert, search, and namespace management, so that pipeline code
never talks to Pinecone ad hoc.

## Scope

- Dependency `@pinecone-database/pinecone` (v9.x, Node ≥ 22).
- `scripts/pinecone-setup.ts` (`pnpm pinecone:setup`): creates, if absent, the dense document
  index (`embedding: dense_vector 1536 cosine` + stored fields) and the sparse document index
  (`chunk_text` with `sparse_embed: pinecone-sparse-english-v0`, `max_tokens_per_sequence: 2048`),
  per `docs/architecture.md` §4; waits until ready; prints descriptions. Re-running is a no-op.
- `src/lib/pinecone/`: client factory; `namespaceFor(indexConfigId)`;
  `upsertDense(ns, records)`, `searchDense(ns, vector, topK)`, `upsertSparse(ns, records)`,
  `searchSparse(ns, text, topK)`, `listNamespaces(index)`, `deleteNamespace(index, ns)`. Batch
  splitting respects limits (dense ≤ 2 MB and ≤ 1,000 per request; sparse ≤ 96 per request).
- If the SDK lacks a Documents API operation, implement it with `fetch` and header
  `X-Pinecone-Api-Version: 2026-07`.

## Out of scope

- Embedding (P1-09), rerank (P1-15), ingestion (P1-11).

## Acceptance criteria

- [ ] `pnpm pinecone:setup` creates both indexes on a fresh project and is idempotent.
- [ ] A smoke script upserts 3 records into a scratch namespace in each index, searches each
      (dense by vector, sparse by text), prints scores, and deletes the namespaces.
- [ ] Batch splitting unit-tested (record counts and byte budget).
- [ ] Exact SDK method names and request shapes verified against current docs; links in this story.
- [ ] Index region chosen and recorded (Starter requires AWS `us-east-1`).
- [ ] CLAUDE.md commands table updated.
- [ ] `pnpm check` passes.

## Technical notes

Verified 2026-11-07 (re-check before implementing):

- Create a document index: https://docs.pinecone.io/guides/indexes/create-an-index
- Search documents (score_by, include_fields, top_k ≤ 10,000):
  https://docs.pinecone.io/reference/api/2026-07/data-plane/search_documents
- Sparse search: https://docs.pinecone.io/guides/search/sparse-vector-search
- Integrated embedding rules: https://docs.pinecone.io/guides/search/integrated-embedding
- Limits: https://docs.pinecone.io/reference/api/database-limits
- TS SDK: https://sdk.pinecone.io/typescript/ · https://github.com/pinecone-io/pinecone-ts-client
- Namespace list/delete REST ops exist in 2026-07; SDK method names were not verified yet.

## Test and eval plan

Unit tests for batching and namespace naming with a fake client; manual smoke script against
Pinecone.

## Demo

`pnpm pinecone:setup` (no-op on second run), then the smoke script output showing scores.
