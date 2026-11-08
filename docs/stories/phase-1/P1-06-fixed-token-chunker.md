# P1-06: Fixed-token chunker

**Phase:** 1 | **Status:** todo | **Depends on:** P1-05 | **Size:** S

## Why

The simplest baseline. Every comparison needs a naive reference point, and an interviewer will ask
"what does structure-awareness buy you over fixed windows?"

## User story

As a visitor, I want a fixed-size chunking option, so that I can compare structure-aware chunking
against a naive baseline.

## Scope

- `src/pipeline/chunking/fixed-token.ts`: pack whitespace-delimited segments greedily until adding
  the next would exceed `chunkSize` tokens; start the next chunk so the previous `chunkOverlap`
  tokens are repeated (snapped to segment boundaries). A single segment longer than `chunkSize` is
  split on token boundaries and mapped back to character offsets carefully (or emitted alone and
  flagged; document the choice).
- `headingPath` computed for each chunk from the nearest preceding headings (shared helper, so
  results display context consistently across chunkers).
- Register as `fixed_token`, `chunkerVersion: 1`.

## Out of scope

- Sentence awareness (that is the recursive chunker's job).

## Acceptance criteria

- [ ] Passes `assertChunkInvariants` on every EDGAR fixture (or a committed sample if P1-04 is not
      done) for sizes 128, 256, 512, 1024 and overlaps 0, 10%, 25%.
- [ ] Overlap is within ±1 segment of the requested token count (test).
- [ ] Empty and whitespace-only documents yield zero chunks.
- [ ] Deterministic output (same input → same chunks).
- [ ] `pnpm check` passes.

## Technical notes

Avoid re-tokenizing the whole prefix per step: count tokens per segment once (segment token counts
are approximately additive; document the approximation and test that chunks still satisfy the
token limit when recounted).

## Test and eval plan

Unit tests on small texts with hand-checked boundaries; invariant tests on fixtures.

## Demo

Print chunk count, mean tokens, and the first two chunks of one 10-K at 512/64.
