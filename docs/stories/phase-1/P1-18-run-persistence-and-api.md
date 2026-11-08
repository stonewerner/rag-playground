# P1-18: Run persistence and query API

**Phase:** 1 | **Status:** todo | **Depends on:** P0-10, P1-16, P1-17 | **Size:** M

## Why

Runs are immutable snapshots (ADR 0017): the basis for history, replay, comparison, and every metric
in Phase 2.

## User story

As a visitor, I want every query I run saved with its exact settings and results, so that I can
come back to it and compare.

## Scope

- `POST /api/runs`: body `{ indexConfigId, queryConfig, queryText, goldQuestionId?, replayOfRunId? }`;
  `requireSession`, `assertQueryAllowed`; resolve config (own corpus or shared preset); execute
  `runQuery`; persist `runs` (with index config snapshot, query config, latency, usage, cost) and
  all `run_results` candidates in one transaction; return the run with results.
- `GET /api/runs/:id`: snapshot only, no external calls; only the owning session (or session-less
  benchmark runs) can read it.
- `GET /api/runs?limit&cursor`: session's history, newest first.
- Failed runs are persisted with `status: failed` and the error.

## Out of scope

- UI (P1-21, P1-23). Metrics (P2-11).

## Acceptance criteria

- [ ] A run's stored snapshot fully reconstructs the response without calling vendors (test).
- [ ] Another session cannot read the run (403 test).
- [ ] Rate limit and caps enforced (tests).
- [ ] `run_results` holds every candidate (up to `candidateK`), not only top-k.
- [ ] `pnpm check` passes.

## Technical notes

Insert `run_results` in batches; keep the transaction short (vendor calls happen before it).

## Test and eval plan

Integration tests with fake pipeline deps.

## Demo

`curl` a query against a preset, then fetch it by ID and show identical results.
