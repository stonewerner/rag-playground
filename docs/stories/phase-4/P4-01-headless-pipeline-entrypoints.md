# P4-01: Headless pipeline entrypoints

**Phase:** 4 | **Status:** todo | **Depends on:** P2-13 | **Size:** S

## Why

promptfoo and other harnesses need a stable, documented API into the pipeline without Next.js.
This formalizes what scripts already do.

## User story

As a developer, I want a single module exposing `retrieve`, `evaluateQuestion`, and `runBatch` with
dependency wiring, so that external harnesses call the exact production pipeline.

## Scope

- `src/pipeline/headless.ts`: `createPipeline({ env, overrides })` wiring real clients (or fakes),
  exposing `retrieve(indexConfigId | params, queryConfig, text)`, `judgeAndScore`, `runBatch`.
- Typed, documented; example script.

## Out of scope

- promptfoo config (P4-02).

## Acceptance criteria

- [ ] Bench and batch scripts use the entrypoint (no duplicate wiring).
- [ ] Imports nothing from `next/*` (lint rule or test enforces it for `src/pipeline/**`).
- [ ] `pnpm check` passes.

## Technical notes

An ESLint `no-restricted-imports` rule on `src/pipeline/**` is a cheap guard.

## Test and eval plan

Unit test wiring with fakes.

## Demo

Example script retrieving for one gold question.
