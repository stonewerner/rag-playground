# P2-10: Review and freeze gold set v1 (Stone)

**Phase:** 2 | **Status:** todo | **Depends on:** P2-09 | **Size:** M

## Why

Human review is what makes the gold set defensible: "I reviewed every question and span myself" is
the answer to "how do you know your labels are right?"

## User story

As Stone, I want to review every draft question and span and freeze a versioned gold set, so that
the benchmark rests on labels I can defend.

## Scope

- Stone reviews each draft question: keep, edit, or drop; verifies spans in context; fixes splits
  only before freezing.
- Freeze to `fixtures/gold/edgar-v1.json` with `version: "edgar-v1"` and a content hash recorded in
  the fixture README; remove the draft flag.
- Run `pnpm gold:sync` in production.
- Record review stats: kept/edited/dropped counts, time spent, common problems found.

## Out of scope

- Any change to the frozen set after the first benchmark run; a later fix becomes `edgar-v2`.

## Acceptance criteria

- [ ] 30–50 answerable questions plus unanswerable ones, every one reviewed by Stone.
- [ ] Fixture validates; synced to production.
- [ ] Review stats and the freeze hash recorded in `fixtures/gold/README.md`.
- [ ] Q11 resolved in `docs/open-questions.md`.

## Technical notes

An agent can prepare a review worksheet (markdown, one section per question with spans in context)
to speed this up.

## Test and eval plan

Validator in CI.

## Demo

Show the review stats and three before/after edits.
