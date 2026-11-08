# Phase 4 — Depth extensions

**Status:** todo · **Stories:** 9 (pick a subset)

## Goal

Deepen the retrieval and eval story with extensions that are each measured against the benchmark.
Nothing ships without a recorded delta (or, for guardrail and observability items, a recorded
rationale).

## Exit criteria

Each shipped extension has a benchmark delta recorded in `docs/benchmark/` and its story.

## Recommended subset (confirm with Stone at the end of Phase 3)

1. P4-01 + P4-02: CI regression guard (evaluation discipline).
2. P4-03: contextual chunk headers (cheap, likely visible on cross-company questions).
3. P4-06: second embedding model (embedding tradeoffs, a named gap).
4. P4-04: multi-query rewriting (paraphrase questions).
5. P4-07 only if the Pinecone plan is Standard (Q3).

## Stories

| ID                                              | Title                                | Size | Depends on   | Critical path |
| ----------------------------------------------- | ------------------------------------ | ---- | ------------ | ------------- |
| [P4-01](P4-01-headless-pipeline-entrypoints.md) | Headless pipeline entrypoints        | S    | P2-13        |               |
| [P4-02](P4-02-promptfoo-regression-suite.md)    | promptfoo regression suite in CI     | M    | P4-01        |               |
| [P4-03](P4-03-contextual-chunk-headers.md)      | Contextual chunk headers             | M    | P2-17        |               |
| [P4-04](P4-04-multi-query-rewriting.md)         | Multi-query rewriting                | M    | P2-17, P3-01 |               |
| [P4-05](P4-05-hyde.md)                          | HyDE                                 | M    | P4-04        |               |
| [P4-06](P4-06-second-embedding-model.md)        | Second embedding model               | M    | P2-17        |               |
| [P4-07](P4-07-second-reranker.md)               | Second reranker comparison           | M    | P2-17        |               |
| [P4-08](P4-08-text-only-pdf.md)                 | Text-only PDF support (layout-lossy) | M    | P1-14        |               |
| [P4-09](P4-09-otel-tracing.md)                  | OpenTelemetry tracing (optional)     | M    | P0-07        |               |
