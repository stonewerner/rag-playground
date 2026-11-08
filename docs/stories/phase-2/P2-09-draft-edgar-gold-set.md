# P2-09: Draft the EDGAR gold set

**Phase:** 2 | **Status:** todo | **Depends on:** P2-08 | **Size:** L

## Why

The gold set is the measuring stick for the headline number. Its composition (question types,
difficulty, splits) determines whether the benchmark says anything real.

## User story

As the owner, I want ~50 candidate questions with minimal evidence spans, typed and split, so that
review can prune them to a strong 30–50-question benchmark.

## Scope

- Draft ~50 questions in `fixtures/gold/edgar-v1.draft.json`, target mix:
  `lookup` 8, `numeric` 8, `paraphrase` 10 (wording deliberately different from the filing),
  `table` 6, `multi_span` 6, `cross_company` 6 (e.g. KO vs PEP), `unanswerable` 6.
- Every answerable question has 1+ minimal evidence spans (sentence, table row with header row, or
  short passage), located with the CLI. Reference answer (one sentence) for each.
- Split: ~25% dev, ~75% test, stratified by type; assignment recorded and never changed after
  review.
- Drafting rules (in `fixtures/gold/README.md`): no question copied verbatim from the text; answers
  must be in the filing; avoid questions that depend on exhibits; prefer questions a financial
  analyst would actually ask; note any ambiguity.
- If an LLM helps draft candidates, record the model and prompt in the README, and require
  paraphrase-type questions to be rewritten by hand (drafting bias toward lexical overlap is a
  known risk).

## Out of scope

- Final review and freeze (P2-10, Stone).

## Acceptance criteria

- [ ] Draft fixture passes `pnpm gold:validate` (draft mode allows unreviewed flag).
- [ ] Type and split counts printed and within ±2 of targets.
- [ ] Every span checked in context with `pnpm gold:show` (author's checklist in this story).
- [ ] `fixtures/gold/README.md` documents rules, process, and any LLM assistance.
- [ ] `pnpm check` passes.

## Technical notes

Each question gets a `notes` field for ambiguity or reviewer questions.

## Test and eval plan

Validator; a sampling self-review of 10 random questions recorded here.

## Demo

`pnpm gold:show --id <random>` for three questions of different types.
