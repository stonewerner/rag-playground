# P2-07: Gold set fixture format, validator, and loader

**Phase:** 2 | **Status:** todo | **Depends on:** P1-04, P0-04 | **Size:** M

## Why

The curated gold set must be versioned, reviewable in a PR, and provably anchored to the exact
corpus text. A fixture with span text and content hashes makes it auditable.

## User story

As the owner, I want gold sets stored as validated JSON fixtures and synced into the database, so
that labels are version-controlled and every span is verified against the source.

## Scope

- Zod schema `fixtures/gold/schema` (in `src/pipeline/eval/gold-schema.ts`):
  `{ version, corpus: "edgar-10k", createdAt, tau, questions: [{ id, question, type, split,
referenceAnswer?, notes?, spans: [{ doc: "KO-FY2025", contentHash, start, end, text, grade }] }] }`.
- Question types: `lookup`, `numeric`, `paraphrase`, `table`, `multi_span`, `cross_company`,
  `unanswerable`. Splits: `dev`, `test`.
- `pnpm gold:validate`: schema check; every span's `text === fixture.slice(start, end)`; content
  hashes match the manifest; IDs unique; `unanswerable` has no spans; split counts printed.
- `pnpm gold:sync`: upsert `gold_questions` and `gold_spans` for the shared corpus by `external_id`;
  idempotent; set `gold_set_version`.
- Re-anchor helper: if a content hash changed, find each span's text in the new document and
  report exact, moved, or missing.

## Out of scope

- Authoring the questions (P2-08, P2-09).

## Acceptance criteria

- [ ] Validator catches: wrong slice, wrong hash, duplicate ID, spans on unanswerable (tests).
- [ ] Sync is idempotent (integration test).
- [ ] A 3-question sample fixture is committed and passes validation in CI (as a Vitest test).
- [ ] CLAUDE.md commands updated.
- [ ] `pnpm check` passes.

## Technical notes

Store `doc` as the fixture slug, mapped to `document_id` at sync time via the manifest.

## Test and eval plan

Unit tests for the validator; integration test for sync.

## Demo

Break one span offset in the sample fixture and run `pnpm gold:validate` to show the error.
