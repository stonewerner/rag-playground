# P1-24: Phase 1 exit check, smoke test, and README

**Phase:** 1 | **Status:** todo | **Depends on:** P1-01 … P1-23 | **Size:** S

## Why

A phase is done when its exit criterion works on the deployed app, not when its stories are closed.

## User story

As Stone, I want a scripted check of the Phase 1 definition of done against the deployed app, so
that I can demo it with confidence.

## Scope

- `scripts/smoke.ts` (`pnpm smoke -- --base-url <url>`): with a fresh cookie jar, upload a small
  markdown file, create two configs, poll until ready, run a query on each with rerank on, fetch
  the runs, re-run one, and assert shapes and non-empty results.
- Walk the Phase 1 exit criterion manually on production; fix gaps or file stories.
- README: what's demoable, live URL, a 60-second demo script, screenshots of the results view and
  rank movement.
- Update `docs/stories/README.md` and the Phase 1 EPIC with final statuses; review Phase 2 stories
  against what was built (revise if needed).

## Out of scope

- New features.

## Acceptance criteria

- [ ] `pnpm smoke` passes against production.
- [ ] Every item of the Phase 1 exit criterion verified on production (checklist in this file).
- [ ] README updated with demo script and screenshots.
- [ ] Phase 2 stories reviewed and adjusted.
- [ ] `pnpm check` passes.

## Technical notes

The smoke test spends real (small) money; run it manually, not in CI.

## Test and eval plan

The smoke script is the test.

## Demo

The 60-second demo script from the README, live.
