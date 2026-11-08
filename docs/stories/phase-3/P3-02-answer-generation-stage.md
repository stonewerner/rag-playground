# P3-02: Answer generation stage (headless, streamed)

**Phase:** 3 | **Status:** todo | **Depends on:** P3-01, P1-16 | **Size:** M

## Why

Adds the generation step to the same timed, snapshotted pipeline so answer quality can be compared
across retrieval configs.

## User story

As a developer, I want `runQuery` to optionally stream a cited answer from the top results, so that
retrieval and generation are measured in one run.

## Scope

- `src/pipeline/generation/generate.ts`: build the prompt from the top `maxContextChunks` results,
  stream via AI SDK, return an async iterator of text plus a final record `{ text, usage,
finishReason, ttftMs, totalMs }`.
- `generation` stage timing (TTFT and total) in the trace; token usage added to `usage`.
- Headless (no Next.js); a route-level adapter streams to the browser in P3-06.

## Out of scope

- Citation parsing (P3-03), abstain logic (P3-04), persistence (P3-05).

## Acceptance criteria

- [ ] With a fake model, the stage yields chunks in order and records TTFT and total (tests).
- [ ] Prompt construction is a tested pure function (numbering, heading paths, truncation to
      `maxContextChunks`).
- [ ] Real smoke run on a preset returns a cited answer.
- [ ] `pnpm check` passes.

## Technical notes

Use the AI SDK's mock/test model utilities if available in v7.

## Test and eval plan

Unit tests with a mock model.

## Demo

CLI: run a gold question with generation on and stream the answer.
