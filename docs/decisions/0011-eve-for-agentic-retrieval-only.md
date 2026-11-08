# ADR 0011: eve only for Phase 5 agentic retrieval

**Status:** accepted · **Date:** 2026-11-07

## Context

Agentic retrieval (query decomposition, iterative search) is an optional Phase 5 comparison against
single-shot retrieval. eve is Vercel's open-source TypeScript agent framework (announced June 2026,
public preview): agents are directories (`agent.ts`, `instructions.md`, `tools/` with Zod schemas)
with durable execution and evals.

## Decision

Use eve **only** in Phase 5, with our headless pipeline exposed as its search tool. Nothing before
Phase 5 imports it. P5-01 is a time-boxed spike that re-verifies the API and Vercel runtime
constraints before any build-out.

Docs: https://vercel.com/blog/introducing-eve · https://github.com/vercel/eve

## Alternatives considered

- **Hand-rolled loop with the AI SDK:** viable; the spike compares effort. If eve does not fit, a
  new ADR supersedes this one.
- **Mastra / LangGraph:** more surface than needed; LangGraph conflicts with ADR 0014's spirit.

## Consequences

Phase 5 outcomes depend on a preview framework; scope stays small and measurable (same gold set).
