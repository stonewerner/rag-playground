# P0-04: Core schema v1

**Phase:** 0 | **Status:** todo | **Depends on:** P0-03 | **Size:** M

## Why

The data model encodes the project's core ideas: index configs as first-class objects, immutable
run snapshots, and config-independent span labels. Getting offsets and spans into the schema now
is what makes Phase 2 metrics valid.

## User story

As a developer, I want the core tables with constraints and cascades, so that later stories build
on a model that already enforces the architecture.

## Scope

Drizzle tables in schema `app`, exactly as in `docs/architecture.md` §5: `sessions`, `corpora`,
`documents`, `index_configs`, `ingestion_jobs`, `chunks`, `runs`, `run_results`, `gold_questions`,
`gold_spans`, `rate_limit_buckets`. Enums for source type, chunker, config status, job status,
split, span source. Foreign keys with the documented cascade behavior; unique constraints
(`documents(corpus_id, content_hash)`, `index_configs(corpus_id, params_hash)`,
`index_configs(namespace)`, `ingestion_jobs(index_config_id, document_id)`); indexes for the main
lookups (chunks by config+document+ordinal, runs by session+created_at, gold spans by question).
Check constraints: `start_char < end_char`, `start_char ≥ 0`, grade in 0..2.

## Out of scope

- Tables added later: `inference_cache` (P1-15), `eval_batches` (P2-13), Phase 3 tables.
- Any data access helpers beyond what tests need.

## Acceptance criteria

- [ ] Migration generated and applied cleanly to an empty DB.
- [ ] Deleting a session cascades to its corpora, documents, configs, jobs, chunks, runs, results,
      gold questions, and spans (integration test against a real or local Postgres).
- [ ] Deleting an index config sets `runs.index_config_id` to null and keeps the run snapshot.
- [ ] Inserting a span with `start_char >= end_char` fails.
- [ ] Inserting a duplicate document (same corpus, same hash) fails.
- [ ] `docs/architecture.md` §5 matches the schema exactly (update the doc if anything changed).
- [ ] `pnpm check` passes.

## Technical notes

- Use `uuid` primary keys with `defaultRandom()`; `chunks.id` is text (deterministic, see §4).
- `runs.latency_ms`, `runs.usage`, `runs.metrics`, `index_configs.params` are `jsonb` typed via
  Drizzle `$type<>()` with the Zod-inferred types (types may be stubs until P1-10 / P1-16).
- For integration tests, a disposable local Postgres (Docker) or a separate test database URL
  (`DATABASE_URL_TEST`); document the choice in CLAUDE.md commands.

## Test and eval plan

Integration tests for cascades and constraints, skipped when no test DB URL is set (CI provides one
via a Postgres service container — add to `ci.yml`).

## Demo

Open Drizzle Studio and show the tables and relations.
