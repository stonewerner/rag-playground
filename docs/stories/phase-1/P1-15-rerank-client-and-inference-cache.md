# P1-15: Rerank client and inference cache

**Phase:** 1 | **Status:** todo | **Depends on:** P0-04, P0-09, P0-10 | **Size:** M

## Why

Reranking is a core retrieval knob, and rerank requests are the scarcest quota (500/month on
Starter). Caching makes the demo affordable and the benchmark reproducible.

## User story

As a visitor, I want reranking to be fast and always available, so that I can toggle it freely on
common queries without exhausting the demo's quota.

## Scope

- Migration: `inference_cache(key text pk, kind, model, payload jsonb, created_at, hits int)`.
- `src/pipeline/retrieval/rerank.ts`: `rerank({ query, candidates: {id, text}[], model, depth })`
  → `{ scores: {id, score, index}[], cached, possiblyTruncated }` using `pc.inference.rerank` with
  `topN = depth` and `rankFields` for the text field; validate the response with Zod.
- Cache key: sha256 of `model + query + ordered (id, sha256(text))` list. Cache reads/writes go
  through `src/lib/inference-cache.ts`.
- Query-embedding cache in the same table: key = sha256 of `model + dims + query text`.
- Only cache misses call `assertRerankAllowed` and count toward usage.
- `possiblyTruncated`: true if `countTokens(query) + countTokens(text)` exceeds ~1024 for any
  candidate (approximate, since the reranker uses a different tokenizer; documented).

## Out of scope

- Second reranker (P4-07).

## Acceptance criteria

- [ ] Unit tests: cache hit returns identical scores without calling the client; changed candidate
      text changes the key; order of candidates changes the key.
- [ ] Miss path enforces per-session and global rerank caps (tests).
- [ ] Real smoke call with 5 candidates prints scores; model name, limits, and request shape
      verified on current docs and linked here (Q5 resolved).
- [ ] `pnpm check` passes.

## Technical notes

Verified 2026-11-07: `bge-reranker-v2-m3` — 1024 tokens per query+doc pair, 100 docs per request;
Starter 500 requests/month; Builder 1,000; Standard $2/1k.

- https://docs.pinecone.io/guides/search/rerank-results
- https://docs.pinecone.io/models/bge-reranker-v2-m3
- Check the `truncate` parameter options and choose explicitly.

## Test and eval plan

Unit tests with a fake Pinecone inference client; manual smoke.

## Demo

Rerank the same 5 candidates twice: first call ~hundreds of ms, second `cached: true`, ~0 ms.
