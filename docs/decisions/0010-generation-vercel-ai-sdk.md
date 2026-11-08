# ADR 0010: Generation via the Vercel AI SDK (Phase 3)

**Status:** accepted · **Date:** 2026-11-07

## Context

Phase 3 adds a streamed answer with inline citations, an abstain path, and an LLM judge. We need
streaming to the browser, token usage, and structured output for the judge, without an agent
framework.

## Decision

Use the **Vercel AI SDK** (major version 7 as of 2026-11; ESM-only, Node 22+) for generation
(`streamText`) and judging (structured output validated with Zod). Plain LLM calls only: no tools,
no agents, no memory. Provider and model are config values (open question Q12). Prompts are
versioned files in `src/pipeline/generation/prompts/` and the version hash is stored on the run.

Docs: https://vercel.com/blog/ai-sdk-7 · https://ai-sdk.dev/docs (verify exact APIs in P3-01).

## Alternatives considered

- **Provider SDKs directly:** more code for streaming to React and for provider switching.
- **LangChain:** ruled out by ADR 0014.

## Consequences

Dependencies `ai` plus one provider package, added in P3-01. Embeddings stay on direct REST
(ADR 0009) so Phase 1 does not depend on the AI SDK.
