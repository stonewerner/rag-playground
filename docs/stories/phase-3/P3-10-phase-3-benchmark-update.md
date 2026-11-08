# P3-10: Phase 3 benchmark update

**Phase:** 3 | **Status:** todo | **Depends on:** P3-08, P3-09 | **Size:** S

## Why

Records whether better retrieval produced better answers, with cost, which completes the story from
retrieval metrics to user-facing quality.

## User story

As Stone, I want the benchmark extended with answer-quality results per retrieval config, so that I
can show how retrieval improvements translate into answers.

## Scope

- `pnpm bench --with-generation`: answer-quality table on the test split for dense-only, hybrid, and
  hybrid + rerank (best preset), with judge version and calibration link.
- Update `/benchmark`, `docs/benchmark/results.md`, README.
- Phase 3 EPIC and backlog updated; Phase 4 subset proposed to Stone.

## Out of scope

- Phase 4 work.

## Acceptance criteria

- [ ] Generated tables committed; numbers reproducible from caches.
- [ ] Phase 3 exit criterion verified.
- [ ] Phase 4 subset agreed with Stone and recorded in the Phase 4 EPIC.

## Technical notes

Report cost per answer alongside quality.

## Test and eval plan

Table generator unit tests.

## Demo

`/benchmark` answer-quality section.
