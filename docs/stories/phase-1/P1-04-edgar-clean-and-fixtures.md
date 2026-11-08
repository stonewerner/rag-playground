# P1-04: EDGAR cleaning and normalized fixtures

**Phase:** 1 | **Status:** todo | **Depends on:** P1-02, P1-03 | **Size:** L

## Why

10-K HTML is noisy (inline XBRL, layout tables, page footers). Garbage in the corpus becomes
garbage chunks and misleading metrics. Clean, committed fixtures make the benchmark reproducible
without network access.

## User story

As the owner, I want each 10-K converted into clean markdown with real item headings and readable
tables, committed with hashes, so that every later experiment uses identical text.

## Scope

- `scripts/edgar/build.ts` (`pnpm edgar:build`): read cached raw HTML, clean, convert (P1-02),
  post-process, normalize (P1-01), write `fixtures/edgar/<TICKER>-FY<year>.md` and
  `fixtures/edgar/manifest.json` (raw manifest fields + content hash, char count, token count,
  normalization version, build script version).
- Cleaning (`src/pipeline/normalize/edgar.ts`, pure and unit-tested): remove `ix:header` and
  hidden elements; unwrap `ix:*` tags keeping text; drop page numbers, repeated running headers,
  and table-of-contents link blocks; collapse layout tables that only position text; convert
  financial tables to GFM, merging `$` and `%` cells with their numbers and dropping empty spacer
  columns.
- Structure: promote `PART I`…`PART IV` and `Item 1.`, `Item 1A.`, `Item 7.`, … to `#`/`##`
  headings (detected by pattern, not by font styling).
- Quality report printed per filing: chars, tokens, heading count, table count, longest line,
  suspicious artifacts (leftover `ix:` text, runs of `|`, page-number lines).

## Out of scope

- Loading into the DB and indexing (P1-13). Exhibits.

## Acceptance criteria

- [ ] All target filings build; fixtures and manifest committed.
- [ ] Every filing has Items 1, 1A, 7, and 8 as headings (test asserts it on the fixtures).
- [ ] No `ix:` tags or hidden-XBRL text remain (test).
- [ ] At least one financial table per filing renders as a valid GFM table with numbers attached to
      their `$` signs (spot-check documented in this story with 2 examples per filing).
- [ ] Re-running the build produces byte-identical fixtures (determinism test).
- [ ] Manifest hashes match file contents (test).
- [ ] `pnpm check` passes.

## Technical notes

- Token count via the tokenizer from P1-05 if available; otherwise add it when P1-05 lands.
- Inline XBRL spec background: https://www.sec.gov/structureddata/osd-inline-xbrl.html
- Keep heuristics data-driven (lists of patterns) so they can be tuned without rewriting logic.
- If a filing incorporates Item 8 by reference to an exhibit (some do), record it in the manifest
  and note it in this story rather than chasing the exhibit.

## Test and eval plan

Unit tests for each cleaning rule on small HTML snippets; fixture-level assertions listed above.

## Demo

Open `fixtures/edgar/KO-FY2025.md` in the GitHub preview: Item headings, a readable income
statement table.
