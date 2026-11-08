# P1-16: Headless query pipeline (dense + rerank)

**Phase:** 1 | **Status:** todo | **Depends on:** P0-07, P1-09, P1-15 | **Size:** M

## Why

The query pipeline is the core we orchestrate by hand. Every stage must be timed and every candidate
recorded so rank movement and metrics are possible.

## User story

As a developer, I want `runQuery(indexConfig, queryConfig, text)` to return every candidate with
scores, ranks, and stage timings, so that the UI, scripts, and evals share one implementation.

## Scope

- `src/pipeline/config/query-config.ts`: Zod `QueryConfig` per architecture §2 (Phase 1 allows
  `mode: "dense"` only; other fields validated but rejected with a clear error until Phase 2).
- `src/pipeline/query/run-query.ts`: stages per architecture §9 — `embed_query` (cache) →
  `dense_search` (`candidateK`) → threshold (`stage: "dense"`) → `rerank` (top `depth`, optional)
  → final ordering → top-k → `hydrate` (chunk rows by ID from Postgres).
- Output `QueryResult`: `candidates[]` with `chunkId`, `documentId`, span, text, `headingPath`,
  `denseScore`, `denseRank`, `preRerankRank`, `rerankScore`, `rerankRank`, `finalRank | null`,
  `passedThreshold`; plus `latencyMs`, `usage`, flags (`cacheHits`, `possiblyTruncated`).
- Ordering rule: reranked candidates first (by rerank score), then non-reranked candidates in
  pre-rerank order.
- Deps injected (DB, embedding, Pinecone, rerank, cache, trace).

## Out of scope

- Persistence (P1-18). Sparse and fusion (Phase 2). Generation (Phase 3).

## Acceptance criteria

- [ ] With fakes: rerank off → final order equals dense order; rerank on → top `depth` reordered by
      rerank score, the rest keep dense order (tests).
- [ ] Threshold drops candidates below `min` before rerank and marks them `passedThreshold: false`.
- [ ] Every stage in architecture §9 for Phase 1 appears in `latencyMs`.
- [ ] Unknown index config / empty namespace returns a typed error, not a crash.
- [ ] Real run against a seeded preset returns sensible results (manual, noted here).
- [ ] `pnpm check` passes.

## Technical notes

Run `embed_query` and anything independent in parallel where possible; record `total` as wall clock.

## Test and eval plan

Unit tests with fake deps covering each knob; manual real run.

## Demo

A script runs one query against a preset with rerank on and prints a table of dense rank → rerank
rank with scores and the latency breakdown.
