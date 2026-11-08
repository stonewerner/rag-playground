# ADR 0015: Ingestion-time vs query-time knobs

**Status:** accepted · **Date:** 2026-11-07

## Context

Users turn knobs and expect instant feedback, but some knobs change what is stored. Mixing them
causes accidental re-embedding (cost) and invalid comparisons.

## Decision

Two disjoint schemas. **Ingestion-time** (`IndexConfigParams`): chunker, chunker version, chunk
size, overlap, embedding model and dimensions, contextual headers, sparse on/off. **Query-time**
(`QueryConfig`): mode, top-k, candidate pool, fusion (alpha, k), rerank (on, model, depth),
score threshold, and later query rewriting. Ingestion knobs are fixed per index config; query knobs
apply per run. **A query-time knob never triggers re-chunking or re-embedding**, and the UI presents
the two groups separately. Details in `docs/architecture.md` §2.

## Alternatives considered

A single "settings" object with lazy re-indexing on change: hides cost and makes comparisons
ambiguous.

## Consequences

Changing an ingestion knob means creating a new index config (ADR 0016). Comparing chunking
strategies means comparing configs on the same corpus.
