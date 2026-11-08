# P3-05: Generation persistence and cost

**Phase:** 3 | **Status:** todo | **Depends on:** P3-03, P3-04, P1-17 | **Size:** S

## Why

Generated answers must be part of the immutable run so they can be replayed, judged later, and
costed.

## User story

As a visitor, I want the answer, its citations, tokens, and cost saved with the run, so that I can
revisit and compare answers.

## Scope

- Migration: `run_generations(run_id pk/fk, model, prompt_version, answer_text, sentences jsonb,
abstained, input_tokens, output_tokens, ttft_ms, total_ms, est_cost_usd, created_at)`.
- LLM prices in `src/lib/pricing.ts`; run cost includes generation.
- Generation spend caps: per-session daily output tokens, global daily LLM spend estimate.
- Run view shows the stored answer with citations (no regeneration).

## Out of scope

- Judge scores (P3-07).

## Acceptance criteria

- [ ] Viewing a run with generation makes no LLM calls (test).
- [ ] Cost breakdown includes generation tokens (test with hand-computed price).
- [ ] Caps enforced (tests).
- [ ] `pnpm check` passes.

## Technical notes

Persist after the stream completes; a client disconnect still persists the full text if the server
stream finished (use `after()` or consume the stream server-side).

## Test and eval plan

Integration tests with a mock model.

## Demo

Open a past run and show the stored answer and cost breakdown.
