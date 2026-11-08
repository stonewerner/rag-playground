# P3-03: Citation parsing and mapping

**Phase:** 3 | **Status:** todo | **Depends on:** P3-02 | **Size:** S

## Why

Citations map answer sentences to chunks and therefore to source spans. That mapping is what
citation-correctness scoring and the UI's "jump to source" depend on.

## User story

As a developer, I want each answer sentence linked to the chunks it cites, so that citations can be
verified and displayed.

## Scope

- `src/pipeline/generation/citations.ts`: split the answer into sentences, extract `[n]`, `[n, m]`,
  `[n][m]` markers, map to chunk IDs and spans; flag invalid numbers (out of range), uncited
  sentences, and unused context.
- Output: `{ sentences: [{ text, start, end, citations: chunkId[] }], invalidCitations,
uncitedSentenceCount }`.

## Out of scope

- Judging whether citations are correct (P3-07).

## Acceptance criteria

- [ ] Table-driven tests for all marker forms, invalid numbers, markers at sentence ends and mid-
      sentence, and abbreviations not splitting sentences.
- [ ] Citation of a chunk claiming a gold span is detectable (helper links citation → gold span via
      span overlap).
- [ ] `pnpm check` passes.

## Technical notes

Reuse the sentence splitter rules from the recursive chunker if suitable.

## Test and eval plan

Unit tests only.

## Demo

Parse a sample answer and print the sentence → chunk table.
