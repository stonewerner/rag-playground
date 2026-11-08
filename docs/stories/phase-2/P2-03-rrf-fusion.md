# P2-03: Weighted RRF fusion (hand-written)

**Phase:** 2 | **Status:** todo | **Depends on:** — | **Size:** S

## Why

Hand-built fusion is one of the core skills the project demonstrates, and part of the headline
claim ("hybrid search with hand-built RRF fusion"). It must be correct, deterministic, and
explainable (ADR 0007).

## User story

As a developer, I want a pure, well-tested weighted RRF function, so that hybrid rankings are
correct and reproducible.

## Scope

- `src/pipeline/retrieval/fusion.ts`:
  `fuseRRF(dense: Ranked[], sparse: Ranked[], { alpha, k }) → Fused[]` with
  `score = α/(k + r_dense) + (1 − α)/(k + r_sparse)`, missing ⇒ 0 contribution, ties by better dense
  rank then chunk ID. Output carries `fusedScore`, `fusedRank`, and both input ranks.
- Input validation: ranks unique and 1-based, `alpha ∈ [0, 1]`, `k > 0`.

## Out of scope

- Score-based fusion (possible Phase 4 comparison; parking lot).

## Acceptance criteria

- [ ] Hand-computed example (5 docs, 2 lists, α = 0.5, k = 60) matches expected scores to 1e-12.
- [ ] Property tests: α = 1 reproduces dense order for dense candidates (sparse-only items follow);
      α = 0 reproduces sparse order; every input ID appears exactly once; output is deterministic
      under input permutation of equal-rank ties.
- [ ] Docstring shows the formula and cites Cormack et al. (2009), "Reciprocal Rank Fusion
      outperforms Condorcet and individual Rank Learning Methods".
- [ ] `pnpm check` passes.

## Technical notes

Keep the function free of I/O and Pinecone types; it operates on IDs and ranks.

## Test and eval plan

Unit and property tests; hand-computed vectors committed in the test file with the arithmetic shown.

## Demo

Print a small worked example table (dense rank, sparse rank, contributions, fused rank).
