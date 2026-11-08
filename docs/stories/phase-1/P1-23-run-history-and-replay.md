# P1-23: Run history and replay

**Phase:** 1 | **Status:** todo | **Depends on:** P1-18, P1-21, P1-22 | **Size:** M

## Why

Replayable runs turn the playground into a lab: any result can be revisited and re-executed to
check for drift (ADR 0017).

## User story

As a visitor, I want to see my past runs, open one exactly as it was, and re-run it, so that I can
compare results over time and settings.

## Scope

- `/runs`: list of the session's runs (query, config name, key knobs, latency, cost, time).
- `/runs/[id]`: read-only render of the snapshot with the results list, rank movement, and latency
  components (no vendor calls).
- "Re-run": POST with `replayOfRunId`, then show a diff: overlap of top-k sets, rank changes per
  chunk, score deltas, latency comparison.
- "Open in playground": loads the snapshot's configs into `/query`.

## Out of scope

- Cross-config compare (P2-15).

## Acceptance criteria

- [ ] Opening a past run makes zero external API calls (verified by logs or test).
- [ ] Re-run creates a new linked run; the diff view handles identical results (says so) and
      changed results.
- [ ] Diff logic is a tested pure function.
- [ ] `pnpm check` passes.

## Technical notes

A run whose index config was deleted still renders (snapshot) but cannot be re-run; the UI says why.

## Test and eval plan

Unit tests for the diff; integration test that viewing makes no vendor calls (fake clients assert
not called).

## Demo

Re-run yesterday's query and show "identical top-10, latency −40% (cache hit)".
