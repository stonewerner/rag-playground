# P5-03: Agentic vs single-shot evaluation

**Phase:** 5 | **Status:** todo | **Depends on:** P5-02, P2-17 | **Size:** M

## Why

Phase 5's exit criterion: a recorded comparison on the same gold set, including cost and latency,
not a demo-only feature.

## User story

As Stone, I want agentic retrieval scored against the best single-shot config on the test split, so
that I can say when agents are worth their cost.

## Scope

- Batch eval support for `mode: "agentic"`.
- Benchmark rows: agentic vs best hybrid + rerank; nDCG@10, recall@10, per-type (esp.
  `multi_span`, `cross_company`), mean tool calls, tokens, cost, latency.
- Write-up in `docs/benchmark/` and README.

## Out of scope

- Tuning the agent on the test split (dev only).

## Acceptance criteria

- [ ] Comparison recorded with paired CIs and cost/latency.
- [ ] Phase 5 exit criterion verified.
- [ ] `pnpm check` passes.

## Technical notes

Agent runs are nondeterministic: run test split twice and report run-to-run variance.

## Test and eval plan

Benchmark run.

## Demo

Benchmark section "Agentic vs single-shot".
