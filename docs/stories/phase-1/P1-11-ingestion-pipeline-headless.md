# P1-11: Headless ingestion pipeline

**Phase:** 1 | **Status:** todo | **Depends on:** P0-09, P1-06, P1-07, P1-08, P1-09, P1-10 | **Size:** M

## Why

Ingestion orchestration (chunk → persist → embed → upsert) is part of the core we build by hand.
Keeping it headless lets the app, the seed script, and tests share one implementation.

## User story

As a developer, I want one function that indexes a document under an index config, idempotently and
with progress callbacks, so that the app and scripts index the same way.

## Scope

- `src/pipeline/ingest/index-document.ts`:
  `indexDocument({ document, indexConfig, deps, onProgress, budget })` where `deps` injects DB,
  embedding client, Pinecone wrapper, clock, and trace.
- Stages: chunk (registry) → upsert `chunks` rows (deterministic IDs
  `<configId>:<documentId>:<ordinal>`) → embed in batches → upsert dense records to the config's
  namespace with stored fields → report progress after each batch.
- Resumability: given a starting batch index (from job progress), skip already-done work; every
  write is an upsert.
- Budget: stop cleanly after the current batch when `budget.deadline` passes and return
  `{ done: false, nextBatch }`.
- Usage: return embed tokens consumed; the caller records them.
- Pre-flight: estimate tokens and call the caller-provided `assertEmbedBudget`.
- Sparse upserts are a hook left empty until P2-01 (`sinks` array or equivalent).

## Out of scope

- Job claiming, leases, `after()` (P1-12). Sparse (P2-01).

## Acceptance criteria

- [ ] With fakes: a document produces N chunks, N vectors, N dense records with correct IDs, fields,
      and namespace (test).
- [ ] Re-running after a simulated crash at batch k redoes at most one batch and ends in the same
      state (test).
- [ ] Deadline stops after the current batch and reports `nextBatch` (test).
- [ ] Chunk `text` equals `normalized_text.slice(start, end)` for every stored chunk (test).
- [ ] One real end-to-end run against Pinecone with a small markdown doc (manual, noted here).
- [ ] `pnpm check` passes.

## Technical notes

- Dense upsert batch size must respect the 2 MB request limit (~100 records at 1536 dims), see P0-09.
- Use the same `onProgress` shape the job runner persists (`chunks_total`, `chunks_done`, `stage`).

## Test and eval plan

Unit tests with fake deps; manual real run.

## Demo

Index one markdown file via a script and print progress lines and the namespace record count.
