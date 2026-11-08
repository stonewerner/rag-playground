# P1-05: Chunk model, tokenizer, and chunk invariants

**Phase:** 1 | **Status:** todo | **Depends on:** P1-01 | **Size:** S

## Why

Chunk sizes are measured in tokens, and every chunk must map exactly to a source span. Shared
types, a single tokenizer, and invariant checks keep all three chunkers honest.

## User story

As a developer, I want a shared chunk type, token counter, and invariant checker, so that every
chunker is tested the same way.

## Scope

- Tokenizer dependency for `cl100k_base` (the `text-embedding-3-*` tokenizer); candidates
  `js-tiktoken` (pure JS) or `gpt-tokenizer`. Record the choice in an ADR. Lazy-load the encoding.
- `src/pipeline/chunking/types.ts`: `ChunkSpan`, `Chunker`, `ChunkParams`.
- `src/pipeline/chunking/tokens.ts`: `countTokens(text)`, `segmentWords(text)` returning
  whitespace-delimited segments with offsets.
- `src/pipeline/chunking/invariants.ts`: `assertChunkInvariants(doc, chunks, params)` implementing
  `docs/architecture.md` §7 (bounds, exact slice, ordering, coverage of non-whitespace, token limit
  with flagged exceptions).
- `src/pipeline/chunking/registry.ts`: maps chunker name → implementation + `chunkerVersion`.

## Out of scope

- The chunkers themselves (P1-06..P1-08).

## Acceptance criteria

- [ ] `countTokens` matches known cl100k counts for 5 reference strings (from the tokenizer's own
      test vectors or OpenAI's tokenizer page, cited).
- [ ] `assertChunkInvariants` catches each violation type (one failing test per rule).
- [ ] Tokenizer ADR written.
- [ ] `pnpm check` passes.

## Technical notes

- js-tiktoken: https://github.com/dqbd/tiktoken/tree/main/js · gpt-tokenizer:
  https://github.com/niieani/gpt-tokenizer
- Verify `text-embedding-3-small` uses `cl100k_base` against OpenAI docs and cite it.

## Test and eval plan

Unit tests for every invariant rule.

## Demo

Run invariants on a hand-made bad chunk list and show the specific errors.
