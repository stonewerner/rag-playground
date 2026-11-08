# P1-09: OpenAI embedding client

**Phase:** 1 | **Status:** todo | **Depends on:** P0-01, P0-07 | **Size:** M

## Why

We compute dense vectors ourselves so the embedding model is a knob we control and compare
(ADR 0009). Batching, retries, and usage accounting are where real systems break.

## User story

As a developer, I want a reliable embedding function that batches, retries, and reports tokens, so
that ingestion and queries share one tested path.

## Scope

- `src/pipeline/embedding/openai.ts`: `embedTexts(texts, { model, dimensions })` →
  `{ vectors: number[][], usage: { totalTokens } }` via `fetch` to `/v1/embeddings`.
- Batching by input count and by token budget per request (limits from current docs); preserves
  input order (sort by `index` in the response).
- Retries: exponential backoff with jitter on 429 and 5xx, honoring `Retry-After`; max attempts
  configurable; no retry on 4xx other than 429.
- Zod validation of the response; dimension check against the requested `dimensions`.
- `EmbeddingClient` interface so tests and scripts can inject a fake (deterministic hash-based
  vectors).
- Each call wrapped in `timeStage` when a trace is provided.

## Out of scope

- Query embedding cache (P1-15). Second model (P4-06).

## Acceptance criteria

- [ ] Unit tests with a fake `fetch`: batching splits correctly, order preserved, 429 then 200
      retries, 400 fails fast, dimension mismatch throws.
- [ ] One manual smoke call embeds 3 strings and prints usage.
- [ ] Current model names, dimensions, max input tokens, per-request limits, and price verified on
      OpenAI's docs and recorded here; Q4 resolved; pricing added to the price table when P1-17
      lands.
- [ ] `pnpm check` passes.

## Technical notes

- https://platform.openai.com/docs/guides/embeddings · https://platform.openai.com/docs/api-reference/embeddings
- As of 2026-11-07 secondary sources list `text-embedding-3-small` (1536 dims, ~$0.02/1M tokens)
  and `text-embedding-3-large` (3072 dims); confirm on the official pages.
- Inputs longer than the model limit must be rejected before sending (chunk size caps make this rare).

## Test and eval plan

Unit tests with fake fetch; manual smoke test.

## Demo

Smoke script prints vector length, first 5 values, and token usage.
