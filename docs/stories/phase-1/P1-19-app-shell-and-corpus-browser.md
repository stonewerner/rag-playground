# P1-19: App shell, corpus browser, and document viewer

**Phase:** 1 | **Status:** todo | **Depends on:** P0-05, P1-13, P1-14 | **Size:** M

## Why

Interviewers need to orient in seconds. The document viewer with span highlighting is also how
results, labels, and citations point back to source text in every later phase.

## User story

As a visitor, I want to see the available corpora and documents and read a document with a
highlighted passage, so that I understand what I'm querying and where results come from.

## Scope

- Layout: header with app name and nav (Corpora, Query, Runs; later Eval, Benchmark), footer with
  session ID.
- `/corpora`: shared EDGAR corpus card (documents, presets) and "My uploads" (upload entry point
  from P1-14).
- `/corpora/[id]`: document list with metadata (company, fiscal year, tokens) and index configs with
  status.
- `/documents/[id]?start=&end=`: renders normalized markdown as plain preformatted text (not
  rendered markdown, so offsets map 1:1), scrolls to and highlights `[start, end)`, shows the
  heading outline for navigation.
- Home page: one-paragraph pitch, "Try the 10-K corpus" CTA, link to methodology (placeholder).

## Out of scope

- Rendered markdown view (parking lot). Query panel (P1-21).

## Acceptance criteria

- [ ] A guest can navigate home → corpus → document and see a highlighted span from URL params.
- [ ] Highlight offsets are exact for text containing emoji and accented characters (test on the
      slicing helper).
- [ ] Pages follow Next.js 16 Cache Components rules (no build warnings about uncached dynamic data).
- [ ] Usable at 375 px width (no horizontal page scroll outside the document text).
- [ ] `pnpm check` passes.

## Technical notes

- Read `node_modules/next/dist/docs/01-app/01-getting-started/` (layouts, server/client components,
  fetching data, caching) before building pages.
- Large documents (~500 KB): render in segments or virtualize if scrolling is slow; measure first.

## Test and eval plan

Unit test for the highlight-slicing helper; manual check of pages.

## Demo

Open a 10-K at Item 7 with a highlighted paragraph.
