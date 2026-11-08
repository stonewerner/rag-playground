# P2-11: Per-run metrics

**Phase:** 2 | **Status:** todo | **Depends on:** P2-06, P2-07, P1-18 | **Size:** M

## Why

"Measure, don't eyeball": once a query has labels, every run against it should show its metrics
immediately, so knob changes become metric deltas.

## User story

As a visitor, I want a run against a labeled question to show recall@k, MRR, and nDCG@k, so that I
can see whether a knob change helped.

## Scope

- Query panel: pick a gold question (curated set for the shared corpus, session set for uploads) or
  type free text; free text that exactly matches a gold question links it.
- On run completion with `gold_question_id`, compute metrics at k ∈ {5, 10} and the run's `topK`,
  plus `judged@k`, using τ from the gold set; persist in `runs.metrics` with `tau`, gold set
  version, and computation version.
- `recomputeRunMetrics(runId)` for when labels change (session labels) — metrics are derived data.
- Results list marks relevant chunks (with which span they claimed) and judged-not-relevant chunks.
- Run view shows a metrics strip.

## Out of scope

- Labeling UI (P2-12). Batch eval (P2-13).

## Acceptance criteria

- [ ] Metrics on a run equal those computed by calling the eval module directly on the stored
      results (integration test).
- [ ] Unanswerable questions show "not applicable" instead of zeros.
- [ ] Metrics record τ and gold set version.
- [ ] `pnpm check` passes.

## Technical notes

Gold spans for a question are loaded once per run; judging uses stored run results (spans), never
chunk IDs.

## Test and eval plan

Integration test with a seeded gold question and fake pipeline.

## Demo

Pick a gold question, run dense then hybrid, and show the nDCG@10 change.
