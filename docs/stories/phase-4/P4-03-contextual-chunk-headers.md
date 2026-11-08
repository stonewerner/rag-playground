# P4-03: Contextual chunk headers

**Phase:** 4 | **Status:** todo | **Depends on:** P2-17 | **Size:** M

## Why

Prepending document title and heading path to the embedded text is a cheap, popular technique.
Measuring it is better than assuming it helps, especially for KO vs PEP confusion.

## User story

As a visitor, I want an index config option to embed chunks with their document and section
context, so that I can measure whether context headers improve retrieval.

## Scope

- `contextualHeaders: true` in `IndexConfigParams`: embedded text = `"<Company> 10-K FY<year> ›
<heading path>\n\n<chunk text>"`; sparse text gets the same header (decide and document); spans and
  `chunks.text` keep the raw slice, with the embedded text stored separately (`embedded_text`
  column) for auditability.
- Rerank input: raw text or headed text (decide; record; ideally a measured choice).
- New presets with headers on (best chunker from Phase 2).
- Benchmark rows added: with vs without headers, dense and hybrid + rerank.

## Out of scope

- LLM-generated contextual summaries (parking lot: "contextual retrieval" with LLM context).

## Acceptance criteria

- [ ] Labeling offset mapping still exact (raw text unchanged) — test.
- [ ] Benchmark delta recorded in `docs/benchmark/` and this story, with CI.
- [ ] `pnpm check` passes.

## Technical notes

Header tokens count toward the chunk-size limit or not: decide and document (affects comparability).

## Test and eval plan

Unit tests for header construction; benchmark run.

## Demo

Compare scorecards with and without headers, focusing on `cross_company` questions.
