# P1-22: Rank movement and latency visualization

**Phase:** 1 | **Status:** todo | **Depends on:** P1-21 | **Size:** M

## Why

"What did the reranker actually do?" is the question this answers visually. Per-stage latency makes
the cost of each stage visible. Both are core to the observability goal.

## User story

As an interviewer, I want to see how each chunk's rank changed after reranking and how long each
stage took, so that I can judge whether reranking is worth its latency.

## Scope

- Rank movement view: two columns (pre-rerank rank, post-rerank rank) with connecting lines
  (slope chart, inline SVG, no chart library), up/down/new/dropped indicators, and highlighting of
  the selected chunk in both columns. Candidates that left the top-k are shown as "dropped".
- Per-row badge in the results list: `▲3`, `▼5`, `new`, `—`.
- Latency breakdown: horizontal stacked bar of stage times (embed_query, dense_search, rerank,
  hydrate) with values, cached stages marked.
- Both components accept a stored run, so history and compare can reuse them.

## Out of scope

- Fused/sparse ranks (P2-04 extends the view with dense/sparse/fused columns).

## Acceptance criteria

- [ ] With rerank on, the slope chart shows every reranked candidate's movement; rerank off shows a
      note instead of an empty chart.
- [ ] Movement badges computed by a tested pure function (pre/post ranks → label).
- [ ] Latency bar sums to the stage total and labels cached stages.
- [ ] Accessible: chart has a table fallback for screen readers.
- [ ] `pnpm check` passes.

## Technical notes

Before building charts, read the project's dataviz guidance if a skill is available; keep colors
consistent with the theme and legible in dark mode.

## Test and eval plan

Unit tests for movement computation; visual check.

## Demo

Run a query with rerank depth 20 and point out a chunk that moved from rank 9 to rank 1.
