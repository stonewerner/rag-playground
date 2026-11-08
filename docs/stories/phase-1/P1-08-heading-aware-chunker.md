# P1-08: Heading-aware markdown chunker

**Phase:** 1 | **Status:** todo | **Depends on:** P1-05, P1-07 | **Size:** M

## Why

10-Ks have strong structure (Parts, Items, subsections). Chunking along it should keep answers
inside one chunk and give each chunk meaningful context (heading path). This is the structure-aware
strategy the benchmark tests.

## User story

As a visitor, I want chunks that follow the document's sections and carry their heading path, so
that results show where in the filing each chunk came from.

## Scope

- `src/pipeline/chunking/heading-aware.ts`: scan lines for ATX headings (`#`..`######`), ignoring
  fenced code blocks; build sections with heading paths; a section ≤ `chunkSize` becomes one chunk;
  larger sections are sub-split with `splitRecursive`; tiny adjacent sibling sections (below a
  minimum, e.g. 15% of `chunkSize`) merge with the next sibling under the same parent.
- GFM tables: avoid splitting inside a table when the table fits; when a table exceeds the size,
  split between rows and repeat nothing (offsets must stay exact); document the behavior.
- Overlap applies only within a sub-split section, never across section boundaries.
- Register as `heading_aware`, `chunkerVersion: 1`.

## Out of scope

- Contextual headers in the embedded text (P4-03). Setext headings (`===`), unless trivial.

## Acceptance criteria

- [ ] Passes `assertChunkInvariants` on all fixtures for sizes 128–1024.
- [ ] Every chunk's `headingPath` matches the headings above its start (test on crafted markdown).
- [ ] `#` inside fenced code is not treated as a heading (test).
- [ ] A table that fits in `chunkSize` is never split (test).
- [ ] No chunk spans two top-level Items in the EDGAR fixtures (test).
- [ ] `pnpm check` passes.

## Technical notes

Line scanning by hand; no markdown parser dependency (ADR 0014 spirit: the chunker is the skill).

## Test and eval plan

Unit tests on crafted markdown; invariants and Item-boundary assertions on fixtures.

## Demo

Show the heading paths for the first ten chunks of a 10-K's Item 7.
