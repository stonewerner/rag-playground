# P1-07: Recursive chunker

**Phase:** 1 | **Status:** todo | **Depends on:** P1-05 | **Size:** M

## Why

The common production default. Respecting paragraph and sentence boundaries usually improves
retrieval; we will measure whether it does on 10-Ks.

## User story

As a visitor, I want a chunker that respects paragraphs and sentences, so that chunks read as
coherent passages.

## Scope

- `src/pipeline/chunking/recursive.ts`: separators in order `\n\n`, `\n`, sentence end
  (`. `, `? `, `! ` followed by whitespace, tolerant of abbreviations like "U.S." and "Inc."),
  space, then character. Split on the first separator that yields pieces ≤ `chunkSize`; recurse
  on oversized pieces; merge adjacent pieces up to `chunkSize`; apply `chunkOverlap` by carrying
  trailing whole pieces.
- All operations on offsets, never on copied substrings, so spans stay exact.
- Register as `recursive`, `chunkerVersion: 1`.

## Out of scope

- Markdown structure (P1-08 uses this as its sub-splitter).

## Acceptance criteria

- [ ] Passes `assertChunkInvariants` on all fixtures for sizes 128–1024 and overlaps 0–25%.
- [ ] No chunk boundary falls inside a sentence when a sentence boundary exists within the size
      limit (test on crafted text).
- [ ] "U.S." and "Inc." do not trigger sentence splits (test).
- [ ] Exposes `splitRecursive(text, start, end, params)` for reuse by P1-08.
- [ ] `pnpm check` passes.

## Technical notes

Write the separator list as data so it is easy to explain and change.

## Test and eval plan

Unit tests with hand-computed boundaries; invariants on fixtures.

## Demo

Same 10-K at 512/64: compare chunk boundaries side by side with the fixed-token output.
