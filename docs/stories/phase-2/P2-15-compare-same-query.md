# P2-15: Compare two configs on the same query

**Phase:** 2 | **Status:** todo | **Depends on:** P2-04, P2-11 | **Size:** M

## Why

Side-by-side results are the most intuitive way to see what a knob changes: which chunks are shared,
which are unique, and how ranks differ.

## User story

As a visitor, I want to run one query against two configs side by side, so that I can see exactly
which results differ and why.

## Scope

- `/compare`: two config panes (index config + query config each, reusing knob components) and one
  query box; runs both (two runs, linked by a `compare_group` value in the URL or a column).
- Diff view: shared chunks (by span overlap, since IDs differ across index configs), unique chunks
  per side, rank of shared items in each, and metric deltas if the question is labeled.
- Latency and cost side by side.

## Out of scope

- Batch comparison (P2-16).

## Acceptance criteria

- [ ] Matching across different index configs uses span overlap (pure function, tested), not chunk
      IDs.
- [ ] Works for same index config + different query configs (IDs match directly).
- [ ] Shareable URL reproduces both configs.
- [ ] `pnpm check` passes.

## Technical notes

Define "same evidence" as overlap ≥ 50% of the shorter span; document it in the component.

## Test and eval plan

Unit tests for cross-config matching.

## Demo

Compare `fixed_token 512/64` dense vs `heading_aware 512/64` hybrid + rerank on one gold question.
