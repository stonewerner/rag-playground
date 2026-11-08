# P2-01: Sparse ingestion and backfill

**Phase:** 2 | **Status:** todo | **Depends on:** P1-11, P1-13 | **Size:** M

## Why

Hybrid search needs a lexical retriever over the same chunks. Writing chunk text to the sparse index
under the same IDs and namespaces is what lets our fusion join the two lists (ADR 0006).

## User story

As a developer, I want every chunk indexed in the sparse index alongside the dense one, so that
dense, sparse, and hybrid retrieval all run over identical chunks.

## Scope

- Add a sparse sink to `indexDocument`: upsert `{ _id, chunk_text, document_id, index_config_id,
ordinal, start_char, end_char }` to the sparse index namespace in batches of ≤ 96.
- `IndexConfigParams.sparse = true` for new configs (bump nothing else; existing configs get
  `sparse` backfilled rather than new hashes — document why this does not change chunk outputs).
- Usage: record sparse embedding tokens if the response reports them.
- `scripts/sparse-backfill.ts`: for configs without sparse data (presets and existing guest
  configs), upsert existing `chunks` rows to the sparse index; idempotent; progress output.
- Job progress counts both sinks.

## Out of scope

- Sparse search (P2-02).

## Acceptance criteria

- [ ] New ingestion writes identical `_id`s to dense and sparse namespaces (test with fakes; real
      count check after backfill: sparse count == dense count per namespace).
- [ ] Backfill is idempotent and resumable.
- [ ] Production presets backfilled; token usage recorded here.
- [ ] Chunks longer than the sparse model's `max_tokens_per_sequence` are detected and counted
      (should be zero at ≤ 1024 cl100k tokens with 2048 configured; verify).
- [ ] `pnpm check` passes.

## Technical notes

- https://docs.pinecone.io/models/pinecone-sparse-english-v0 (96 inputs/request, 512 default or 2048
  max tokens per sequence)
- https://docs.pinecone.io/guides/search/integrated-embedding

## Test and eval plan

Unit tests with fakes; real backfill verification by namespace counts.

## Demo

Backfill output, then describe both namespaces for one preset and show equal record counts.
