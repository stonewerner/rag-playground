# ADR 0009: OpenAI embeddings via direct REST

**Status:** accepted · **Date:** 2026-11-07

## Context

We compute dense vectors ourselves so the embedding model is a knob we control and compare.

## Decision

Call `POST https://api.openai.com/v1/embeddings` with `fetch` from `src/pipeline/embedding/openai.ts`:
batched by input count and token budget, retries with exponential backoff and jitter on 429/5xx,
`dimensions` passed explicitly, response validated with Zod, `usage.total_tokens` recorded. Start
with **`text-embedding-3-small` at 1536 dimensions** (open question Q4). No OpenAI SDK.

Docs: https://platform.openai.com/docs/guides/embeddings ·
https://platform.openai.com/docs/api-reference/embeddings (re-verify model names, limits, and
prices in P1-09).

## Alternatives considered

- **`openai` SDK:** fine, but adds a dependency for one endpoint, and Phase 3 already brings the AI
  SDK; two OpenAI clients would be redundant.
- **AI SDK `embedMany`:** couples Phase 1 to a Phase 3 dependency and hides batching control.

## Consequences

We own batching and retry logic (small, tested). Model names and prices live in config and the
price table.
