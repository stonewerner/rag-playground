# ADR 0017: Runs are immutable snapshots

**Status:** accepted · **Date:** 2026-11-07

## Context

Runs must be replayable and comparable, and benchmark numbers must trace back to the runs that
produced them, even after configs are deleted or code changes.

## Decision

Each run stores: the full index config snapshot, the full query config, the query text, every
candidate (up to `candidateK`) with dense/sparse/fused/rerank scores and ranks plus pre- and
post-rerank ranks and final rank, the chunk text and span, per-stage latencies, usage (tokens,
rerank requests, read units), estimated cost, status and error, and metrics if labels exist.
Rows are never updated except to attach metrics computed later (append-only semantics: metrics
are derived data and can be recomputed). Viewing a run makes no external calls. **Re-running**
creates a new run with `replay_of_run_id`.

## Alternatives considered

Storing only top-k IDs and recomputing on view: breaks when configs, chunks, or models change.

## Consequences

`run_results` can hold up to 100 rows per run; guest runs are deleted with their session. Benchmark
runs have no session and are kept.
