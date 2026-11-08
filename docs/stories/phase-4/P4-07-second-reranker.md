# P4-07: Second reranker comparison

**Phase:** 4 | **Status:** todo | **Depends on:** P2-17 | **Size:** M

## Why

Rerankers differ in quality, latency, context length, and price. A measured comparison is a strong
interview topic.

## User story

As a visitor, I want to choose between two rerankers, so that I can compare their effect and cost.

## Scope

- Rerank model as a query knob; second model `cohere-rerank-4-fast` via Pinecone (requires Standard
  plan; 4096 tokens per document, 250 documents per request, billed per rerank unit) or another
  provider if Stone chooses (ADR required).
- Cache keys already include the model.
- Benchmark rows: hybrid + rerank with each model; latency and cost per query.

## Out of scope

- More than two rerankers.

## Acceptance criteria

- [ ] Pinecone plan decision recorded (Q3) before starting.
- [ ] Benchmark delta recorded with CI, latency, and cost.
- [ ] `pnpm check` passes.

## Technical notes

https://docs.pinecone.io/models/cohere-rerank-4-fast (verified 2026-11-07: Standard plan and above).

## Test and eval plan

Unit tests for model-specific request shapes; benchmark.

## Demo

Same gold question reranked by both models with rank movement side by side.
