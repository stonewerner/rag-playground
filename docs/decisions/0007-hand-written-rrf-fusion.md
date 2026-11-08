# ADR 0007: Hybrid fusion is hand-written weighted RRF

**Status:** accepted · **Date:** 2026-11-07

## Context

Fusing dense and sparse rankings is a core skill this project demonstrates. Dense cosine scores and
sparse dot-product scores are on different scales, so score-based fusion needs normalization that
is fragile across queries.

## Decision

Weighted Reciprocal Rank Fusion in `src/pipeline/retrieval/fusion.ts`, a pure function:

`score(d) = α · 1/(k + r_dense(d)) + (1 − α) · 1/(k + r_sparse(d))`, ranks 1-based, absent ⇒ 0
contribution, `k = 60` default, `α ∈ [0, 1]`. Ties break by better dense rank, then chunk ID.
Properties under test: α = 1 reproduces the dense order, α = 0 the sparse order; output is
deterministic; every input candidate appears exactly once.

## Alternatives considered

- **Convex combination of normalized scores** (min-max or z-score): sensitive to score
  distributions per query; can be added later as a second fusion method for comparison.
- **Pinecone server-side hybrid:** not available for separate dense/sparse fields; and it would
  hide the skill.

## Consequences

Alpha is a query-time knob, tuned on the dev split only. RRF discards score magnitudes, which is a
known tradeoff we can discuss with evidence from the benchmark.
