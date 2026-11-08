# P4-06: Second embedding model

**Phase:** 4 | **Status:** todo | **Depends on:** P2-17 | **Size:** M

## Why

Embedding-model tradeoffs (quality vs dimensions vs cost) are a named gap. Measuring them on our
benchmark beats quoting MTEB.

## User story

As a visitor, I want to index with a second embedding model, so that I can compare quality, latency,
and storage cost across models.

## Scope

- Dense index registry keyed by `(model, dimensions)`; setup script creates the second dense index
  (e.g. `text-embedding-3-large@3072` or `text-embedding-3-small@512`; decide with Stone based on
  index-count and storage limits).
- Ingestion and query select the dense index from the config's embedding params.
- Presets for the best chunker with the second model; benchmark rows with cost per 1M tokens and
  storage per namespace.

## Out of scope

- Non-OpenAI embedding providers (parking lot unless approved).

## Acceptance criteria

- [ ] Registry tested; wrong-dimension upsert impossible by construction.
- [ ] Benchmark delta recorded with CI, plus latency and cost comparison.
- [ ] TTL cleanup deletes namespaces in every registered dense index.
- [ ] `pnpm check` passes.

## Technical notes

Starter allows 5 indexes; check counts before creating.

## Test and eval plan

Unit tests; benchmark.

## Demo

Compare scorecards for the two models side by side.
