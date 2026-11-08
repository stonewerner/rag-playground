# P2-08: Gold span locator CLI

**Phase:** 2 | **Status:** todo | **Depends on:** P2-07 | **Size:** S

## Why

Hand-computing character offsets is error-prone. A locator makes span labeling fast and exact,
which is what makes a 40-question gold set feasible.

## User story

As a gold-set author, I want to paste an evidence quote and get exact offsets, so that labeling
spans is quick and correct.

## Scope

- `pnpm gold:locate --doc KO-FY2025 "quote"`: finds exact matches (and whitespace-insensitive
  matches with mapped offsets), prints offsets, surrounding context, and heading path; errors on
  zero or multiple matches unless `--nth` is given.
- `pnpm gold:add --id q017 --doc … --start … --end …`: appends a span to a draft fixture with text
  and hash filled in.
- `pnpm gold:show --id q017`: prints the question and every span in context.

## Out of scope

- LLM-drafted questions (P2-09 may use an LLM outside the app; nothing here calls an LLM).

## Acceptance criteria

- [ ] Exact and whitespace-insensitive matching tested, including a quote spanning a table row.
- [ ] Ambiguous quotes report all match locations.
- [ ] `pnpm check` passes.

## Technical notes

Reuse the heading-path helper from the chunkers.

## Test and eval plan

Unit tests on fixture snippets.

## Demo

Locate a sentence from Netflix's Item 7 and add it as a span to a draft question.
