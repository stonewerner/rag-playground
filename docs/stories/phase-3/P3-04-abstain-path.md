# P3-04: Abstain path

**Phase:** 3 | **Status:** todo | **Depends on:** P3-02, P2-10 | **Size:** M

## Why

A RAG system that answers everything hallucinates. Measuring when it correctly declines
(unanswerable gold questions) is part of answer quality.

## User story

As a visitor, I want the system to say when the documents don't contain the answer, so that I can
trust it when it does answer.

## Scope

- Detect the abstain marker in the output; mark the generation `abstained: true`.
- Optional pre-check knob: abstain without calling the LLM when the best final score is below a
  threshold (`generation.minEvidenceScore`); recorded on the run.
- Metrics over a batch: abstain precision and recall against `unanswerable` gold questions
  (answerable questions where the model abstained count as false abstentions).

## Out of scope

- Judge scoring of non-abstained answers (P3-07).

## Acceptance criteria

- [ ] Marker detection tolerant to whitespace and punctuation (tests); partial marker in a normal
      answer does not trigger.
- [ ] Abstain precision/recall implemented in `src/pipeline/eval/` with hand-computed tests.
- [ ] A batch over the gold set reports abstain metrics.
- [ ] `pnpm check` passes.

## Technical notes

Keep the marker in the prompt version; changing it changes `promptVersion`.

## Test and eval plan

Unit tests; batch run on dev split.

## Demo

Ask an unanswerable gold question and show the abstention.
