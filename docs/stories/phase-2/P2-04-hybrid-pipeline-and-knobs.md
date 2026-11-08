# P2-04: Hybrid query mode and knobs

**Phase:** 2 | **Status:** todo | **Depends on:** P2-02, P2-03, P1-21, P1-22 | **Size:** M

## Why

Hybrid + rerank is the configuration the headline compares against dense-only. Visitors need to
see dense, sparse, and fused ranks side by side to understand what fusion did.

## User story

As a visitor, I want to switch between dense, sparse, and hybrid modes and move an alpha slider,
so that I can see how fusion reorders results.

## Scope

- `runQuery` `mode: "hybrid"`: `embed_query` + `dense_search` in parallel with `sparse_search` →
  `fusion` (P2-03) → threshold (`stage: "rerank"` only in hybrid) → optional rerank → top-k.
- Query config: `fusion: { method: "rrf", alpha, k }`, defaults α = 0.5 (until tuned on dev), k = 60.
- UI: mode segmented control, alpha slider (0–1, step 0.05) with labels "sparse ← → dense",
  advanced RRF k; results show dense, sparse, fused, and rerank ranks; the rank-movement view gains
  a fused-vs-dense column option.
- Latency bar shows parallel stages correctly (overlap, not sum).

## Out of scope

- Tuning alpha (P2-17 does it on the dev split).

## Acceptance criteria

- [ ] Hybrid at α = 1 returns the same top-k as dense mode for the same query and pool (test with
      fakes; manual check on real data).
- [ ] Run snapshots include fusion params and all per-candidate ranks.
- [ ] Moving the slider re-runs without re-embedding the query (cache hit visible).
- [ ] `pnpm check` passes.

## Technical notes

A candidate found only by sparse has no dense score: hydrate from Postgres by chunk ID (both
indexes share IDs).

## Test and eval plan

Unit tests for the hybrid path with fakes.

## Demo

Same question at α = 1, 0.5, 0: show a numeric-term chunk climbing as alpha moves toward sparse.
