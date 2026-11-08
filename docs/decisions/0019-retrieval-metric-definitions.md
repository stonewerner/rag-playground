# ADR 0019: Retrieval metric definitions

**Status:** accepted · **Date:** 2026-11-07

## Context

The headline number is nDCG@10. With span labels, overlapping chunks, and multiple spans per
question, "standard" definitions have edge cases that change results. They must be fixed in
writing before code.

## Decision

For a question with relevant spans G (grade ≥ 1) and ranking r₁..r_k:

1. **Claiming:** top-down, rᵢ claims each span in G it covers (`cov ≥ τ`) not yet claimed.
   gainᵢ = max grade among newly claimed spans, else 0.
2. **recall@k** = |claimed spans in top k| / |G|.
3. **MRR@k** = 1 / rank of the first rᵢ with gainᵢ > 0, else 0.
4. **nDCG@k** = DCG@k / IDCG@k; DCG@k = Σ (2^gainᵢ − 1) / log₂(i + 1); IDCG@k assumes each gold span
   claimed by its own result in grade order. Bounded to [0, 1].
5. **judged@k** = share of top-k overlapping any judged span (diagnostic).
6. Questions with |G| = 0 are excluded from retrieval metrics.
7. Aggregates: mean over questions; 95% CI by bootstrap over questions (10,000 resamples, fixed
   seed); config deltas by paired bootstrap; per-type means.

Implemented as pure functions in `src/pipeline/eval/` with hand-computed test vectors.

## Alternatives considered

- **No dedup** (every chunk covering any gold span earns gain): rewards redundant overlapping
  chunks and can push nDCG above 1.
- **Precision@k:** depends on how many spans a question has; reported later if useful.

## Consequences

Numbers may differ slightly from libraries such as `pytrec_eval` on the same rankings; the tests
document why.
