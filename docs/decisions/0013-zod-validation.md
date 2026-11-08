# ADR 0013: Zod at every boundary

**Status:** accepted · **Date:** 2026-11-07

## Context

Configs (index, query) are persisted as JSON snapshots and must be canonical; vendor responses can
drift; request bodies are untrusted; env vars must be present and well-formed.

## Decision

Zod schemas for: environment (`src/lib/env.ts`), request bodies and query params, index and query
configs (also used to canonicalize and hash), vendor API responses (OpenAI, Pinecone fallbacks),
fixture files (EDGAR manifest, gold sets), and LLM structured outputs (Phase 3). Types are inferred
from schemas (`z.infer`), not written twice.

## Alternatives considered

Valibot (smaller), ArkType (faster): Zod is the ecosystem default, works with the AI SDK and eve.

## Consequences

One dependency (`zod`), added in P0-01.
