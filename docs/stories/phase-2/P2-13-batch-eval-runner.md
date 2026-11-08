# P2-13: Batch eval runner

**Phase:** 2 | **Status:** todo | **Depends on:** P2-11, P2-04 | **Size:** M

## Why

Single queries are anecdotes; a scorecard over the gold set is evidence. Batch eval is the engine of
the benchmark.

## User story

As a visitor or the owner, I want to run the whole gold set (or a split) against a config and get a
scorecard, so that configs can be compared on evidence, not anecdotes.

## Scope

- Migration: `eval_batches(id, session_id null, corpus_id, index_config_id, index_config_snapshot,
query_config, gold_set_version, split, tau, status, progress, summary jsonb, created_at,
finished_at)` and `runs.eval_batch_id`.
- `src/pipeline/eval/run-batch.ts` (headless): for each question in the split, `runQuery` →
  persist run (linked to batch and question) → metrics; then aggregate (means, CIs, per type) into
  `summary`. Concurrency limit (e.g. 4). Uses inference caches.
- API: `POST /api/eval-batches` (job-style with `after()` and progress, like ingestion);
  `GET /api/eval-batches/:id`.
- Guardrails: guests may batch-eval their own gold sets (≤ 25 questions) within caps; on the shared
  corpus, guests view **precomputed** owner scorecards; a guest batch on the shared corpus is
  allowed only with rerank off or fully cached.
- Scripts call the headless runner directly (`session_id` null).

## Out of scope

- Scorecard UI (P2-14). Compare (P2-16). Benchmark matrix (P2-17).

## Acceptance criteria

- [ ] Batch summary equals aggregates recomputed from its stored runs (integration test).
- [ ] A second identical batch hits caches for every query embedding and rerank (no vendor calls
      beyond Pinecone searches).
- [ ] Resumable after interruption (lease pattern from P1-12).
- [ ] Guest guardrails enforced (tests).
- [ ] `pnpm check` passes.

## Technical notes

Unanswerable questions are skipped for retrieval metrics but still run (Phase 3 will need them).

## Test and eval plan

Integration tests with fake pipeline deps and a 5-question gold set.

## Demo

Run a batch on the dev split for `heading_aware 512/64` hybrid + rerank and print the summary.
