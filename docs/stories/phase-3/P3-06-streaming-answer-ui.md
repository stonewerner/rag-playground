# P3-06: Streaming answer UI with inline citations

**Phase:** 3 | **Status:** todo | **Depends on:** P3-05, P1-21 | **Size:** M

## Why

The answer view connects generation back to evidence: each citation jumps to the chunk and the
source span, making faithfulness inspectable by eye as well as by judge.

## User story

As a visitor, I want to toggle generation and watch a cited answer stream in, with citations linked
to the chunks they reference, so that I can check the answer against its sources.

## Scope

- Query panel toggle "Generate answer" (shows estimated extra cost).
- Streaming answer panel above results; citation chips `[n]` highlight the cited result on hover and
  scroll to it on click; "open source" jumps to the document viewer span.
- Abstention rendered as a distinct state with the evidence threshold shown if used.
- TTFT and generation time added to the latency bar.

## Out of scope

- Judge scores display (P3-07/P3-09 add them).

## Acceptance criteria

- [ ] Text streams progressively; final state matches the persisted answer.
- [ ] Every citation chip links to the right result (tested mapping helper).
- [ ] Abstained runs display correctly.
- [ ] Usable at 375 px width.
- [ ] `pnpm check` passes.

## Technical notes

Follow the AI SDK 7 UI streaming pattern for Next.js; verify against current docs.

## Test and eval plan

Unit tests for chip mapping; manual walkthrough.

## Demo

Ask a numeric question, hover a citation, jump to the source table row.
