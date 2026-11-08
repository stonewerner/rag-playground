# P1-21: Query panel and results view

**Phase:** 1 | **Status:** todo | **Depends on:** P1-18, P1-19 | **Size:** M

## Why

This is the playground: query knobs in, ranked evidence out, with enough detail to explain every
result. It is the screen interviewers will spend the most time on.

## User story

As a visitor, I want to type a question, set top-k, rerank, rerank depth, and a threshold, and see
ranked chunks with scores and sources, so that I can see how each knob changes retrieval.

## Scope

- `/query`: corpus and index config selectors (presets and own configs), query input, query knobs
  (top-k, rerank on/off, rerank depth, score threshold with stage) grouped as "query-time knobs";
  index config params shown read-only as "ingestion-time".
- Results list: final rank, chunk text (expandable), document title and heading path, char span with
  a link to the document viewer highlight, dense score, rerank score, badges for `cached`.
- Run summary bar: total latency, estimated cost, run ID link.
- Example questions for the EDGAR corpus (static list until the gold set exists).
- Query config persisted in the URL so a view can be shared.

## Out of scope

- Rank movement and latency visualizations (P1-22). History (P1-23). Hybrid knobs (P2-04).

## Acceptance criteria

- [ ] A guest queries a preset and sees top-k results with scores and source links in under 2 s p50
      (warm).
- [ ] Changing a query knob and re-running never triggers ingestion (verified in logs).
- [ ] Rate-limit and rerank-cap errors render clearly, with rerank automatically suggested off.
- [ ] Usable at 375 px width.
- [ ] `pnpm check` passes.

## Technical notes

Keep knob components reusable for compare mode (P2-15).

## Test and eval plan

Unit tests for URL-state serialization; manual walkthrough.

## Demo

Ask "What were Coca-Cola's main sources of revenue?" on `heading_aware 512/64` with rerank on.
