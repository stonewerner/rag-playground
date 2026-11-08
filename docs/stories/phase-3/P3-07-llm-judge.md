# P3-07: LLM judge for faithfulness and citation correctness

**Phase:** 3 | **Status:** todo | **Depends on:** P3-05 | **Size:** M

## Why

LLM-as-judge is one of the evaluation skills the project demonstrates. Done carefully (different
model, structured output, versioned prompt, calibration) it makes answer quality measurable.

## User story

As an interviewer, I want each answer scored for faithfulness and citation correctness, so that
answer quality can be compared across retrieval configs.

## Scope

- `src/pipeline/eval/judge/`: prompt `judge-v1.md`; structured output (Zod) per sentence:
  `{ supported: "yes" | "partial" | "no", citedChunksSupport: boolean, rationale }`.
- Scores: faithfulness = share of sentences supported by the provided context; citation correctness
  = share of cited sentences whose cited chunks support them; optional answer correctness vs
  `reference_answer` (yes/partial/no).
- Migration: `judge_scores(run_id, judge_model, judge_prompt_version, scores jsonb,
per_sentence jsonb, usage, est_cost_usd, created_at)`.
- Judge model differs from the generator (asserted).
- Cached by (judge model, prompt version, answer hash, context hash).

## Out of scope

- Calibration (P3-08). Batch integration (P3-09).

## Acceptance criteria

- [ ] Structured outputs validated; malformed outputs retried once then recorded as judge errors.
- [ ] Score aggregation tested with hand-computed examples.
- [ ] Generator == judge configuration is rejected.
- [ ] `pnpm check` passes.

## Technical notes

Judge sees exactly the context the generator saw (same numbered blocks).

## Test and eval plan

Unit tests with a mock judge; smoke run on 3 real answers.

## Demo

Judge one answer and show per-sentence verdicts.
