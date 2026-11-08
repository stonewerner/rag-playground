# P1-17: Price table and per-run cost estimate

**Phase:** 1 | **Status:** todo | **Depends on:** P0-07 | **Size:** S

## Why

Cost is one of the three observability signals. Every run shows what it would cost at list price,
which also makes cost/quality tradeoffs discussable.

## User story

As an interviewer, I want each run to show an estimated cost, so that I can see the tradeoff between
quality and spend.

## Scope

- `src/lib/pricing.ts`: versioned price table (`asOf` date, source URL per entry) for embedding
  models (per 1M tokens), rerank models (per request), Pinecone sparse embedding (per 1M tokens),
  read units (per 1M), and placeholders for LLMs (Phase 3).
- `estimateCost(usage, models)` → `{ totalUsd, breakdown }`. Free-tier quotas are ignored (list
  price equivalent); the UI labels it "estimated list-price cost".
- Unknown model → explicit `unknownPrice` flag, never silently zero.

## Out of scope

- Billing reconciliation. LLM prices (P3-05).

## Acceptance criteria

- [ ] Unit tests with hand-computed totals for embed-only, embed + rerank, and cached (zero) runs.
- [ ] Every price entry has `asOf` and a source link, verified on current vendor pages.
- [ ] `pnpm check` passes.

## Technical notes

As of 2026-11-07: `text-embedding-3-small` ~$0.02/1M tokens (re-verify on OpenAI), Pinecone
`bge-reranker-v2-m3` $2/1k requests on Standard, `pinecone-sparse-english-v0` $0.08/1M tokens, read
units $16–18/1M (https://www.pinecone.io/pricing/).

## Test and eval plan

Unit tests only.

## Demo

Print the estimate for a sample usage object.
