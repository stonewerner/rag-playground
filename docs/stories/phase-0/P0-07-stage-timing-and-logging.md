# P0-07: Stage timing and structured logging

**Phase:** 0 | **Status:** todo | **Depends on:** — | **Size:** S

## Why

LLM observability is one of the three goals. Per-stage latency must be designed in from the first
pipeline, not bolted on.

## User story

As a developer, I want every pipeline stage timed and logged in one structured line per request, so
that latency and usage are visible in logs and can be persisted on runs.

## Scope

- `src/lib/timing.ts`: `createTrace(meta)`, `timeStage(trace, name, fn)` (async, records duration
  even on throw, supports parallel stages), `trace.summary()` returning `{ stages: Record<name, ms>,
totalMs }`. Uses `performance.now()`.
- `src/lib/log.ts`: tiny JSON logger (`info`, `warn`, `error`) with a request/run ID; no dependency.
- Usage counters on the trace: `addUsage(trace, { embedTokens, rerankRequests, ... })`.

## Out of scope

- OpenTelemetry export (P4-09). UI display (P1-22).

## Acceptance criteria

- [ ] `timeStage` records durations for sequential and parallel stages; a throwing stage is recorded
      and the error rethrown.
- [ ] Trace summary shape matches `runs.latency_ms` and `runs.usage` in `docs/architecture.md` §9.
- [ ] Logger emits single-line JSON with level, message, timestamp, and IDs.
- [ ] Unit tests with fake timers.
- [ ] `pnpm check` passes.

## Technical notes

Keep `src/lib/timing.ts` free of Next.js imports so `src/pipeline/` can use it headless.

## Test and eval plan

Unit tests only.

## Demo

Run a test script that times two fake stages in parallel and prints the summary.
