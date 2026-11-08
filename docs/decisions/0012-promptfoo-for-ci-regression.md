# ADR 0012: promptfoo for CI regression evals

**Status:** accepted · **Date:** 2026-11-07

## Context

The app computes metrics for users (in-app scorecards). Separately, we need CI to catch regressions
when pipeline code changes. Two overlapping eval systems would be redundant.

## Decision

- **In-app metrics** (`src/pipeline/eval/`) are the single implementation of recall@k, MRR,
  nDCG@k, and judging.
- **promptfoo** runs in CI (Phase 4) as a thin harness over **headless pipeline functions**: a custom
  provider calls our pipeline, and assertions call our metric functions against thresholds
  (e.g. test-split nDCG@10 must not drop more than a tolerance below the recorded baseline).
  promptfoo provides the runner, reporting, and CI ergonomics, not a second metrics library.

Docs: https://www.promptfoo.dev/docs/ (verify provider and assertion APIs in P4-02).

## Alternatives considered

- **Vitest-only regression tests:** workable, but promptfoo gives eval reporting and diffs for free.
- **promptfoo's built-in RAG metrics:** would duplicate and diverge from our definitions.

## Consequences

CI evals need vendor keys or recorded responses; P4-02 decides (cached embeddings + live Pinecone
reads, run on main and on demand, not on every PR).
