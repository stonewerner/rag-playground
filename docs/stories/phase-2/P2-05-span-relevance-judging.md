# P2-05: Span overlap and relevance judging

**Phase:** 2 | **Status:** todo | **Depends on:** P1-05 | **Size:** S

## Why

Config-independent labels (ADR 0018) only work if span coverage and claiming are exactly right.
This is the foundation every metric sits on.

## User story

As a developer, I want a pure function that decides which retrieved chunks are relevant to which
gold spans, so that metrics are valid across chunking configs.

## Scope

- `src/pipeline/eval/spans.ts`: `overlap(a, b)` (same document only), `coverage(chunk, gold)`.
- `src/pipeline/eval/judge-ranking.ts`: `judgeRanking(results, goldSpans, { tau })` → per result
  `{ gain, claimedSpanIds, overlapsJudged }` using the claiming rule in ADR 0019; plus
  `claimedByK`.
- `tau` accepts a number in (0, 1] or `"any"` (overlap > 0).

## Out of scope

- Metric formulas (P2-06).

## Acceptance criteria

- [ ] Hand-computed cases: chunk fully containing span; span split across two chunks (each 50%);
      chunk touching one character; spans in different documents; two chunks covering the same
      span (second gets 0); one chunk covering two spans of different grades (gain = max grade).
- [ ] Grade-0 spans never produce gain but count as judged.
- [ ] Q6 (τ) resolved in `docs/open-questions.md`.
- [ ] `pnpm check` passes.

## Technical notes

Spans are half-open `[start, end)`.

## Test and eval plan

Table-driven unit tests with diagrams in comments.

## Demo

Print the judgement table for a crafted example with three chunks and two spans.
