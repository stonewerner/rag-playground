# P4-05: HyDE (hypothetical document embeddings)

**Phase:** 4 | **Status:** todo | **Depends on:** P4-04 | **Size:** M

## Why

HyDE embeds a generated hypothetical answer instead of the question. On financial filings it may
help or hurt (hallucinated numbers); measuring it is the point.

## User story

As a visitor, I want a HyDE option, so that I can see whether embedding a hypothetical answer
retrieves better evidence.

## Scope

- `rewrite.method: "hyde"`: generate a short hypothetical passage, embed it (cached), dense search
  with it; hybrid uses original question for sparse.
- Benchmark rows and per-type breakdown; note numeric-question behavior.

## Out of scope

- Combining HyDE with multi-query.

## Acceptance criteria

- [ ] Benchmark delta recorded with CI.
- [ ] Hypothetical passage stored on the run.
- [ ] `pnpm check` passes.

## Technical notes

Gao et al. (2022), "Precise Zero-Shot Dense Retrieval without Relevance Labels".

## Test and eval plan

Unit tests for the stage with mocks; benchmark.

## Demo

Show a HyDE passage and the retrieved chunks for a numeric question.
