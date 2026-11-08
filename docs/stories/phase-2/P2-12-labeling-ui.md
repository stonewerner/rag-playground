# P2-12: Relevance labeling UI

**Phase:** 2 | **Status:** todo | **Depends on:** P2-11, P1-21 | **Size:** L

## Why

Visitors (and Stone) need to create labels from real results. Storing labels as spans, with
optional evidence highlighting, is the config-independence design made tangible.

## User story

As a visitor, I want to mark returned chunks relevant or not and highlight the exact evidence, so
that my labels apply to every config and produce metrics.

## Scope

- On each result: "Relevant" / "Not relevant" toggle; optional "highlight evidence" mode where the
  user selects text inside the chunk and the selection is mapped to document offsets.
- Saving: creates a session-scoped gold question from the query text if none is linked (shared
  corpus labels never touch the curated set); stores `gold_spans` (grade 1 with highlight or
  `is_coarse = true`; grade 0 for not relevant; `source = ui_label`).
- Labels apply immediately: re-run metrics via `recomputeRunMetrics`; the same question queried on
  another config shows metrics without relabeling.
- Session gold set page: list questions and spans, delete a label.
- Cap: labels per session (e.g. 500) to bound rows.

## Out of scope

- Graded labels in the UI (parking lot). Editing the curated set from the UI.

## Acceptance criteria

- [ ] Selection → offset mapping is exact, including chunks with emoji and markdown symbols (tested
      pure function).
- [ ] A label made on config A produces metrics on config B for the same question (integration
      test).
- [ ] Coarse labels are flagged in the UI and in metrics output (share of coarse spans).
- [ ] Guest labels on the shared corpus do not appear for other sessions.
- [ ] `pnpm check` passes.

## Technical notes

Map DOM selection to chunk-relative offsets on the chunk's text node, then add `chunk.start_char`.
Since chunk text is a raw slice of normalized text (no contextual headers in Phase 2), the mapping
is a direct addition; assert it.

## Test and eval plan

Unit tests for offset mapping; integration test for cross-config metrics.

## Demo

Label two results on `fixed_token 512/64`, switch to `heading_aware 512/64`, and see metrics appear.
