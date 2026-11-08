# P5-02: Agentic retrieval agent

**Phase:** 5 | **Status:** todo | **Depends on:** P5-01 | **Size:** L

## Why

Agentic retrieval (decompose, search iteratively, decide when to stop) may help multi-span and
cross-company questions. It must output a ranked evidence list so it can be scored like any other
retrieval method.

## User story

As a visitor, I want an agentic retrieval mode that plans and runs multiple searches, so that I can
see whether it finds evidence single-shot retrieval misses.

## Scope

- Agent strategy: decompose the question into sub-queries, search each (tool), optionally refine
  once based on results, then select and rank final evidence (≤ top-k chunks).
- Output contract: ranked list of chunk IDs + spans (scored by our metrics), plus the trace of tool
  calls and sub-queries.
- Budgets: max tool calls, max tokens, max wall time; recorded per run.
- Persisted as a run with `mode: "agentic"` and its trace.

## Out of scope

- Generation from agent evidence beyond reusing P3 generation.

## Acceptance criteria

- [ ] Ranked evidence list contract documented and tested (merging rule for evidence from multiple
      searches: order of agent's final ranking, ties by first retrieval).
- [ ] Budgets enforced (tests with a mock model).
- [ ] Runs persisted and viewable.
- [ ] `pnpm check` passes.

## Technical notes

Reuse caches; every tool call is a normal `retrieve` call with its own stage timings.

## Test and eval plan

Unit tests with a scripted mock model.

## Demo

Agentic run on a `cross_company` question showing two sub-queries.
