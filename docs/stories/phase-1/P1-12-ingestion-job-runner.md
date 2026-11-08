# P1-12: Ingestion job runner and progress API

**Phase:** 1 | **Status:** todo | **Depends on:** P1-11, P0-06 | **Size:** M

## Why

Guests need to see indexing progress, and work must survive function timeouts (ADR 0023).

## User story

As a visitor, I want to watch my documents get indexed and have it finish even if something
restarts, so that I'm never stuck with a half-indexed config.

## Scope

- `src/lib/jobs/runner.ts`: `processJobs(jobIds, { deadline })`: claim each job with a lease
  (`UPDATE … SET status='running', lease_expires_at=now()+interval … WHERE … AND (status='queued'
OR lease_expires_at < now()) RETURNING`), call `indexDocument`, persist progress, release or
  complete; mark `failed` after N attempts with `last_error`.
- Config status rollup: `indexing` while any job runs, `ready` when all succeed, `failed` if any
  failed permanently.
- Trigger: routes that enqueue jobs call `after(() => processJobs(...))` with a deadline well under
  `maxDuration` (set explicitly on those routes).
- `GET /api/index-configs/:id/progress`: returns per-document job progress and config status; if a
  job's lease expired, schedules `after(() => processJobs([id]))` to resume it.
- Record embed tokens on the session (usage helper from P0-10).

## Out of scope

- UI (P1-20). Cron-based resume beyond what P0-11 already sweeps.

## Acceptance criteria

- [ ] Two concurrent runners never process the same job (integration test with parallel claims).
- [ ] A job interrupted mid-way (simulated by expiring its lease) is resumed by the progress route
      and completes (integration test with fakes).
- [ ] After 3 failed attempts the job is `failed` with the error; config becomes `failed`.
- [ ] Session `embed_tokens_used` increases by the tokens consumed.
- [ ] Verified once on a Vercel preview deploy with a real document.
- [ ] `pnpm check` passes.

## Technical notes

- `after()`: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md`
- `maxDuration`: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/maxDuration.md`
- Vercel limit for the chosen plan recorded in architecture §17 (P0-06).

## Test and eval plan

Integration tests against the test DB with fake pipeline deps.

## Demo

Create a config for an uploaded doc; poll the progress route and watch `chunks_done` climb.
