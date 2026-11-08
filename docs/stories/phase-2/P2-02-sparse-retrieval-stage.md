# P2-02: Sparse retrieval stage

**Phase:** 2 | **Status:** todo | **Depends on:** P2-01, P1-16 | **Size:** S

## Why

Sparse-only retrieval is both an input to fusion and a benchmark row of its own: it shows what the
lexical signal alone achieves on 10-K questions.

## User story

As a visitor, I want a sparse-only mode, so that I can see what keyword-style retrieval finds that
dense retrieval misses.

## Scope

- `src/pipeline/retrieval/sparse.ts`: `searchSparse(namespace, text, candidateK)` via the Pinecone
  wrapper → ranked `{ id, score, rank }[]` (may be shorter than `candidateK`).
- `runQuery` supports `mode: "sparse"`: sparse search → (threshold not applicable to sparse scores;
  reject `scoreThreshold.stage = "dense"` in this mode) → optional rerank → top-k.
- `sparse_search` stage timing; candidates carry `sparseScore`, `sparseRank`.

## Out of scope

- Fusion (P2-03/P2-04).

## Acceptance criteria

- [ ] Sparse mode returns results for a query with exact 10-K terms (e.g. "Item 1A risk factors
      supply chain") on a preset (manual check noted).
- [ ] Fewer-than-`candidateK` results handled (test).
- [ ] Run snapshots store sparse scores and ranks.
- [ ] `pnpm check` passes.

## Technical notes

Sparse search request shape (verified 2026-11-07): `score_by: [{ type: "sparse_embed", fields:
["chunk_text"], query }]` — https://docs.pinecone.io/guides/search/sparse-vector-search

## Test and eval plan

Unit tests with fake Pinecone; manual real query.

## Demo

Same query in dense and sparse mode; point out a chunk only sparse finds (exact term match).
