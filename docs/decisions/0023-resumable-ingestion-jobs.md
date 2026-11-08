# ADR 0023: Ingestion as resumable Postgres-backed jobs

**Status:** accepted · **Date:** 2026-11-07

## Context

Indexing a document (chunk, embed, upsert) can take seconds to minutes and must report progress.
Vercel functions have a max duration, and requests can die mid-work.

## Decision

- One `ingestion_jobs` row per (index config, document) with status, stage, progress counters,
  attempts, last error, and a lease (`lease_expires_at`).
- The API enqueues jobs and returns 202; processing runs in `after()` within a time budget well
  under the function max duration, in bounded batches (embedding and upsert batches).
- Every step is idempotent: deterministic chunk IDs, upserts in Postgres and Pinecone.
- Recovery: the progress-polling endpoint resumes jobs whose lease expired; the daily cron sweeps
  stragglers. Jobs fail after N attempts with the error recorded.
- Scripts (EDGAR seeding) call the same headless pipeline directly, without the job runner.

## Alternatives considered

- **Vercel Queues/Workflow, Inngest, Trigger.dev:** durable and nicer, but a new service for work
  that usually finishes in one invocation. Revisit if jobs regularly exceed one invocation.
- **Synchronous ingestion in the request:** no progress, fails on timeouts.

## Consequences

Progress UI polls. A job interrupted mid-batch redoes at most one batch.
