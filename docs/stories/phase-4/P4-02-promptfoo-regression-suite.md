# P4-02: promptfoo regression suite in CI

**Phase:** 4 | **Status:** todo | **Depends on:** P4-01 | **Size:** M

## Why

Evaluation discipline includes regression testing: a pipeline change that lowers nDCG should fail
CI. promptfoo is the harness; our metrics stay the single implementation (ADR 0012).

## User story

As a developer, I want CI to fail when a change drops benchmark metrics beyond a tolerance, so that
retrieval quality cannot silently regress.

## Scope

- `evals/promptfooconfig.yaml`: custom provider calling `retrieve` for each test-split gold
  question with the reference configs (e.g. best dense, best hybrid + rerank); custom assertions
  calling our metric functions; aggregate check: mean nDCG@10 ≥ baseline − tolerance (baseline from
  the committed benchmark JSON).
- CI job: on push to `main`, nightly, and manual dispatch (not every PR); secrets in GitHub Actions;
  caches make reruns cheap (rerank cached; query embeddings cached; Pinecone reads live).
- Deliberate regression demo: a branch that breaks fusion tie-breaking or chunk overlap fails the
  job.

## Out of scope

- Generation evals in CI (optional follow-up).

## Acceptance criteria

- [ ] `pnpm eval:ci` runs locally and in CI.
- [ ] A deliberately broken branch fails with a readable report.
- [ ] Monthly cost of the CI eval estimated and recorded here.
- [ ] Benchmark delta: n/a (guardrail), but the job's baseline matches the committed benchmark.
- [ ] `pnpm check` passes.

## Technical notes

- https://www.promptfoo.dev/docs/ — verify custom provider (JS/TS) and custom assertion APIs.
- Cache access in CI requires a DB; use the production DB read-only role or a CI database seeded
  from fixtures (decide and record in an ADR update).

## Test and eval plan

The regression demo is the test.

## Demo

Show the failing CI run from the broken branch and the green run on main.
