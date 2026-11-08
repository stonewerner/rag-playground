# P2-16: Compare two scorecards with deltas and significance

**Phase:** 2 | **Status:** todo | **Depends on:** P2-13, P2-14 | **Size:** M

## Why

"Is the difference real?" With 30–50 questions, a paired bootstrap CI on the delta and per-question
wins/losses answer it honestly.

## User story

As an interviewer, I want two scorecards compared with deltas, confidence intervals, and
per-question wins and losses, so that I can tell whether one config is really better.

## Scope

- `/eval/compare?a=<batchId>&b=<batchId>`: requires the same gold set version, split, and τ (error
  otherwise).
- Delta tiles per metric with paired-bootstrap 95% CI and a plain-language verdict ("B better, CI
  excludes 0" / "no clear difference").
- Per-type deltas; per-question table of wins/losses/ties with links to both runs.
- Scatter of per-question nDCG@10 (A on x, B on y) with the diagonal.

## Out of scope

- More than two scorecards at once (the benchmark table covers the matrix).

## Acceptance criteria

- [ ] Delta CIs computed by the P2-06 paired bootstrap (no duplicate statistics code).
- [ ] Refuses mismatched gold set versions or splits with a clear message.
- [ ] Verdict wording tested for the three cases (B better, A better, inconclusive).
- [ ] `pnpm check` passes.

## Technical notes

Scatter as inline SVG; follow dataviz guidance.

## Test and eval plan

Unit tests for verdict logic and pairing.

## Demo

Compare dense-only vs hybrid + rerank on the test split.
