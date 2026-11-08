# P1-02: HTML to markdown conversion

**Phase:** 1 | **Status:** todo | **Depends on:** P1-01 | **Size:** M

## Why

Guests upload HTML and the EDGAR corpus is HTML. Converting to markdown keeps one chunking path and
preserves the structure (headings, tables) the heading-aware chunker relies on.

## User story

As a visitor, I want to upload an HTML page and have it indexed with its headings and tables intact,
so that structure-aware chunking works on it.

## Scope

- Choose the converter after a short comparison on two inputs (a generic article page and one
  10-K section): candidates `turndown` + `turndown-plugin-gfm`, `node-html-markdown`. Criteria: GFM
  tables, heading fidelity, speed, maintenance. Record the choice in ADR 0020 (or a new ADR).
- HTML parser for pre-cleaning if needed (e.g. `cheerio`/`linkedom`), only if the converter cannot
  drop scripts, styles, hidden elements, and nav/footer boilerplate itself.
- `src/pipeline/normalize/html.ts`: `htmlToMarkdown(html): string`, then `normalizeText`.
- Wire `sourceType: "html"` into `normalizeDocument`.

## Out of scope

- EDGAR-specific cleanup (inline XBRL, page artifacts, item headings): P1-04 builds on this.

## Acceptance criteria

- [ ] Headings h1–h6 become ATX headings; lists, links (text kept), emphasis preserved.
- [ ] Tables become GFM tables; empty spacer cells collapsed; a table with colspan renders without
      crashing (best effort, documented).
- [ ] `<script>`, `<style>`, `<noscript>`, and `display:none` / `hidden` elements dropped.
- [ ] Snapshot tests on 3 small committed HTML fixtures in `src/pipeline/normalize/__fixtures__/`.
- [ ] Dependency choice recorded in an ADR with the comparison notes.
- [ ] `pnpm check` passes.

## Technical notes

- turndown: https://github.com/mixmark-io/turndown · GFM plugin:
  https://github.com/mixmark-io/turndown-plugin-gfm
- node-html-markdown: https://github.com/crosstype/node-html-markdown
- Must run in Node (route handlers and scripts), not only in the browser.

## Test and eval plan

Snapshot tests plus targeted assertions (table row count, heading levels).

## Demo

Convert a saved Wikipedia-like page and show the markdown with a rendered table.
