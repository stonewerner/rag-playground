# P2-17: Benchmark script and committed results

**Phase:** 2 | **Status:** todo | **Depends on:** P2-13, P2-10 | **Size:** M

## Why

This produces the project's headline: the real X → Y nDCG@10. It must be reproducible from a clean
checkout and honest about its method.

## User story

As Stone, I want one command that runs the full benchmark matrix and writes the results table, so
that the headline number is reproducible and traceable.

## Scope

- `scripts/bench.ts` (`pnpm bench`):
  1. **Tune on dev:** for each chunking preset, sweep alpha ∈ {0, 0.1, …, 1} for hybrid (rerank off)
     on the dev split; pick the alpha with the best mean nDCG@10 (ties → closest to 0.5); record it.
  2. **Evaluate on test:** for each preset × {dense, sparse, hybrid(α*), hybrid(α*) + rerank}, run a
     batch on the test split with fixed `candidateK`, `topK`, rerank depth.
  3. Sensitivity: recompute test metrics at τ ∈ {any, 0.5, 1.0} from stored runs (no new calls).
  4. Write `docs/benchmark/results-<date>.json` (all summaries, batch IDs, git SHA, gold set version
     and hash, model names, presets, α*, τ, CI method) and `docs/benchmark/results.md` (generated
     tables) — and update the README benchmark section between marker comments.
- Headline: best dense-only preset vs best hybrid + rerank preset, and the same-preset comparison;
  both reported with paired CIs.
- Cost and rerank-quota estimate printed before running; `--dry-run` supported.

## Out of scope

- Phase 4 extensions (each adds rows later).

## Acceptance criteria

- [ ] Clean checkout + seeded DB + `pnpm bench` reproduces the committed table (second run is fully
      cached and identical).
- [ ] Alpha chosen on dev only (asserted in code: test-split batches start only after α* is fixed).
- [ ] README table generated between markers, never hand-edited.
- [ ] Rerank requests used recorded in this story (quota check against the Pinecone plan, Q3).
- [ ] `pnpm check` passes.

## Technical notes

Quota math: presets(5) × test questions(~30) ≈ 150 rerank requests per full run on a cold cache.

## Test and eval plan

Unit tests for the alpha-selection and table-generation functions with fake summaries.

## Demo

`pnpm bench --dry-run`, then the generated README table.
