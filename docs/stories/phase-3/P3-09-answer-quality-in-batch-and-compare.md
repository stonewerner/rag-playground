# P3-09: Answer quality in batch eval and compare

**Phase:** 3 | **Status:** todo | **Depends on:** P3-07, P2-13, P2-16 | **Size:** M

## Why

Phase 3's exit: answer quality measurable and comparable across retrieval configs. This connects
generation and judging to the batch and compare machinery.

## User story

As an interviewer, I want scorecards to include faithfulness, citation correctness, abstain
accuracy, tokens, and cost, so that I can see how retrieval quality flows into answer quality.

## Scope

- Batch eval option `withGeneration` (owner-only on the shared corpus; capped for guests).
- Scorecard columns: faithfulness, citation correctness, answer correctness (if reference answers),
  abstain precision/recall, mean tokens, mean cost, mean TTFT.
- Compare view shows answer-quality deltas with paired CIs.
- Correlation view: per-question retrieval nDCG@10 vs faithfulness scatter.

## Out of scope

- New judge dimensions.

## Acceptance criteria

- [ ] Batch with generation reproduces from caches on second run (no LLM calls).
- [ ] Deltas use the shared paired-bootstrap code.
- [ ] `pnpm check` passes.

## Technical notes

Cost estimate shown before starting a generation batch.

## Test and eval plan

Integration test with mock generator and judge.

## Demo

Compare dense-only vs hybrid + rerank scorecards with answer-quality columns.
