# P4-04: Multi-query rewriting

**Phase:** 4 | **Status:** todo | **Depends on:** P2-17, P3-01 | **Size:** M

## Why

Query rewriting is a common technique for paraphrase-heavy questions. Our RRF already fuses ranked
lists, so multi-query is a natural, measurable extension.

## User story

As a visitor, I want an option to rewrite my question into several variants and fuse the results, so
that I can see whether rewriting helps recall.

## Scope

- Query knob `rewrite: { method: "multi_query", n: 3, model } | null`.
- LLM generates n paraphrases (prompt versioned, cached by query hash); retrieve each (dense or
  hybrid); fuse all lists with RRF (equal weights); then rerank against the original query.
- `rewrite` stage timing, tokens, cost; rewritten queries stored on the run.
- Benchmark rows: with vs without rewriting on the best config; per-type breakdown (expect gains on
  `paraphrase`).

## Out of scope

- HyDE (P4-05).

## Acceptance criteria

- [ ] Multi-list RRF reuses `fuseRRF` generalized to N lists (tests updated, old tests still pass).
- [ ] Benchmark delta recorded with CI and per-type breakdown.
- [ ] Cost and latency overhead reported.
- [ ] `pnpm check` passes.

## Technical notes

Generalizing fusion to N lists must keep α semantics for the two-list case.

## Test and eval plan

Unit tests; benchmark.

## Demo

Show the rewrites and the fused ranking for a paraphrase question.
