# P2-14: Eval scorecard UI

**Phase:** 2 | **Status:** todo | **Depends on:** P2-13 | **Size:** M

## Why

The scorecard is where an interviewer sees rigor: means with confidence intervals, per-type
breakdowns, and drill-down to the questions that failed.

## User story

As an interviewer, I want a scorecard per config with CIs and per-question drill-down, so that I can
see where retrieval works and where it fails.

## Scope

- `/eval/[batchId]`: header with config snapshot, split, gold set version, τ; metric tiles for
  recall@5/10, MRR@10, nDCG@5/10 with 95% CI; per-type table; per-question table (sortable) with
  metrics and a link to the run.
- `/eval`: list of batches (owner precomputed for shared presets + session's own).
- Failure drill-down: for a question with nDCG@10 = 0, show the top results and where the gold
  span actually ranked (if within `candidateK`).

## Out of scope

- Comparison view (P2-16).

## Acceptance criteria

- [ ] Every number links to the runs that produced it.
- [ ] CIs shown as ranges and explained in a tooltip ("bootstrap over questions, n = …").
- [ ] Gold-span rank for missed questions shown when present in the candidate pool.
- [ ] Usable at 375 px width (tables scroll horizontally inside their container).
- [ ] `pnpm check` passes.

## Technical notes

Follow the project's dataviz guidance for tiles and tables; keep the stat-tile component reusable
for the benchmark page.

## Test and eval plan

Unit tests for the "where did the gold span rank" helper; visual check.

## Demo

Open a hybrid + rerank scorecard, sort by nDCG@10 ascending, open the worst question.
