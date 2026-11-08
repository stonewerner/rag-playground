# P3-08: Judge calibration against human labels

**Phase:** 3 | **Status:** todo | **Depends on:** P3-07 | **Size:** M

## Why

"How do you know the judge is right?" A small human-labeled set and an agreement number answer it.

## User story

As Stone, I want to label a sample of answers by hand and measure judge agreement, so that judge
scores can be trusted (or their limits stated).

## Scope

- Generate answers for ~20 dev-split questions across 2 configs (~40 answers, ~150 sentences).
- Labeling worksheet (markdown or a minimal page) where Stone marks each sentence supported /
  partial / not, and citation correct / not.
- `pnpm judge:calibrate`: agreement (accuracy and Cohen's kappa) per dimension; confusion matrix;
  examples of disagreements. Results in `docs/benchmark/judge-calibration.md`.
- If agreement is weak, iterate the judge prompt once (judge-v2) and re-measure on the same set.

## Out of scope

- Large-scale human evaluation.

## Acceptance criteria

- [ ] Human labels committed as a fixture.
- [ ] Kappa computed by a hand-tested function.
- [ ] Calibration report committed with the judge prompt version used for Phase 3 results.

## Technical notes

Labeling takes Stone ~1–2 hours; schedule it.

## Test and eval plan

Unit tests for kappa and confusion matrix.

## Demo

Show the calibration report: agreement and two disagreement examples.
