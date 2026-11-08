# P4-09: OpenTelemetry tracing (optional)

**Phase:** 4 | **Status:** todo | **Depends on:** P0-07 | **Size:** M

## Why

Exporting the existing stage timings as traces (e.g. to Langfuse) shows production-grade LLM
observability practice. Optional: in-app latency views already cover the core need.

## User story

As a developer, I want pipeline stages exported as OpenTelemetry spans, so that runs can be inspected
in a standard tracing tool.

## Scope

- Bridge `timeStage` to OTel spans via Next.js instrumentation; attributes: run ID, config hashes,
  tokens, cache hits.
- Exporter to Langfuse or another OTLP backend (ADR for the dependency and vendor).

## Out of scope

- Replacing in-app latency views.

## Acceptance criteria

- [ ] One query produces a trace with all stages as child spans.
- [ ] Disabled cleanly when no exporter env is set.
- [ ] Benchmark delta: n/a (observability); overhead measured and recorded.
- [ ] `pnpm check` passes.

## Technical notes

`node_modules/next/dist/docs/01-app/02-guides/open-telemetry.md` and `instrumentation.md`.

## Test and eval plan

Unit test for the bridge with an in-memory exporter.

## Demo

Screenshot of a trace waterfall for one run.
