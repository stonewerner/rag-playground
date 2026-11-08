# P5-04: Agent trace UI

**Phase:** 5 | **Status:** todo | **Depends on:** P5-02 | **Size:** M

## Why

An agent's value is in its decisions; showing sub-queries, tool calls, and what each retrieved makes
the behavior inspectable.

## User story

As a visitor, I want to see each step the agent took and what it retrieved, so that I can understand
why it found (or missed) the evidence.

## Scope

- Run view for agentic runs: timeline of steps (sub-query, tool call, latency, top results), final
  evidence ranking, budget usage.
- Link each step's results to the standard results component.

## Out of scope

- Editing or replaying individual steps.

## Acceptance criteria

- [ ] Timeline renders from the persisted trace without model calls.
- [ ] Usable at 375 px width.
- [ ] `pnpm check` passes.

## Technical notes

Reuse latency-bar and results components.

## Test and eval plan

Unit test for trace → timeline mapping.

## Demo

Open an agentic run and step through its timeline.
