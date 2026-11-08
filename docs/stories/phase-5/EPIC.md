# Phase 5 — Agentic retrieval (optional)

**Status:** todo · **Stories:** 4

## Goal

An eve agent that decides when and how to search (query decomposition, iterative retrieval),
evaluated against single-shot retrieval on the same gold set, with cost and latency.

## Exit criteria

Agentic vs. single-shot comparison recorded in `docs/benchmark/` with paired CIs, per-type results,
cost, latency, and run-to-run variance.

## Before starting

P5-01 is a one-day spike; proceed only if eve fits (ADR 0011).

## Stories

| ID                                            | Title                             | Size | Depends on   | Critical path |
| --------------------------------------------- | --------------------------------- | ---- | ------------ | ------------- |
| [P5-01](P5-01-eve-spike.md)                   | eve spike                         | S    | P4-01        | ★             |
| [P5-02](P5-02-agentic-retrieval-agent.md)     | Agentic retrieval agent           | L    | P5-01        | ★             |
| [P5-03](P5-03-agentic-vs-single-shot-eval.md) | Agentic vs single-shot evaluation | M    | P5-02, P2-17 | ★             |
| [P5-04](P5-04-agent-trace-ui.md)              | Agent trace UI                    | M    | P5-02        |               |
