# P2-06: Retrieval metrics (recall@k, MRR, nDCG@k, judged@k) and bootstrap CIs

**Phase:** 2 | **Status:** todo | **Depends on:** P2-05 | **Size:** M

## Why

The headline number is nDCG@10. Metric code is load-bearing: a bug here invalidates the project's
central claim, so it gets hand-computed test vectors (CLAUDE.md rule 8).

## User story

As a developer, I want metric functions that match the written definitions exactly, with confidence
intervals, so that every reported number is defensible.

## Scope

- `src/pipeline/eval/metrics.ts`: `recallAtK`, `mrrAtK`, `ndcgAtK`, `judgedAtK` per ADR 0019,
  consuming `judgeRanking` output.
- `src/pipeline/eval/aggregate.ts`: mean over questions, per-type means, 95% bootstrap CI (10,000
  resamples, seeded PRNG), paired bootstrap for deltas between two configs on the same questions,
  win/loss/tie counts.
- Seeded PRNG implemented by hand (e.g. mulberry32) to avoid a dependency.

## Out of scope

- Persistence and UI (P2-11, P2-14).

## Acceptance criteria

- [ ] Hand-computed vectors for each metric, including binary and graded nDCG, multi-span questions,
      and redundant chunks (arithmetic shown in test comments).
- [ ] Properties: all metrics in [0, 1]; perfect ranking ⇒ 1; no relevant results ⇒ 0; nDCG
      invariant to results after k.
- [ ] Cross-check: for single-span binary questions, nDCG@k equals the textbook formula computed
      independently in the test.
- [ ] Bootstrap CI is deterministic for a fixed seed; paired bootstrap of identical configs yields
      a CI containing 0.
- [ ] `pnpm check` passes.

## Technical notes

Järvelin & Kekäläinen (2002) for nDCG; document our span-claiming deviation from chunk-level
qrels.

## Test and eval plan

Exhaustive unit tests; these are the most important tests in the repo.

## Demo

A test-output table of the hand-computed examples.
