# P2-18: Benchmark page and write-up

**Phase:** 2 | **Status:** todo | **Depends on:** P2-17, P2-14, P2-16 | **Size:** S

## Why

The benchmark is the centerpiece an interviewer should see first, with the methodology and caveats
that make it credible.

## User story

As an interviewer, I want a results page with the benchmark table, methodology, and caveats, so that
I can evaluate the claim in two minutes.

## Scope

- `/benchmark`: renders `docs/benchmark/results-<latest>.json` (imported at build time): headline
  tile (X → Y nDCG@10 with CI), matrix table, per-type breakdown, τ sensitivity, links to scorecards
  and compare views.
- Methodology section: corpus, gold set construction and review, splits, τ and span claiming,
  alpha tuning on dev, CI method, known biases (chunk-size coverage bias, small n, drafting bias).
- Home page shows the headline tile and links here.
- README: headline sentence with the real numbers; update the résumé line draft in this story.
- Phase 2 EPIC and backlog statuses updated; Phase 3 stories reviewed against what was built.

## Out of scope

- New metrics.

## Acceptance criteria

- [ ] `/benchmark` matches `docs/benchmark/results.md` exactly (same source JSON).
- [ ] Every number links to a scorecard or compare view.
- [ ] Methodology and caveats reviewed by Stone.
- [ ] Phase 2 exit criterion verified: reproducible table and real X → Y number.
- [ ] `pnpm check` passes.

## Technical notes

Static import of JSON keeps the page cacheable under Cache Components.

## Test and eval plan

Unit test that the page's table builder and the markdown generator produce the same rows.

## Demo

Open `/benchmark` from the home page and walk through the headline and one caveat.
