# P4-08: Text-only PDF support (layout-lossy)

**Phase:** 4 | **Status:** todo | **Depends on:** P1-14 | **Size:** M

## Why

Visitors will try PDFs. Supporting text extraction (clearly labeled as layout-lossy) widens use
without pretending to solve layout, tables, or OCR.

## User story

As a visitor, I want to upload a text-based PDF and have its text indexed, with a clear warning that
layout and tables may be lost, so that I can experiment with my own reports.

## Scope

- PDF text extraction library chosen via ADR (e.g. `unpdf` or `pdfjs-dist`); page breaks become
  `\n\n` with page markers stored as metadata (page → char offset map) for citations.
- Reject scanned/image-only PDFs (no text) with a clear message. Caps apply.
- UI badge "layout-lossy".
- Benchmark delta: measure on the 10-K corpus by indexing the SEC PDF renditions (if available) vs
  the HTML-derived fixtures, or record "not measured" with the reason.

## Out of scope

- OCR, images, table reconstruction (non-goals).

## Acceptance criteria

- [ ] Text PDF uploads index; image-only PDF rejected (fixtures for both).
- [ ] Page numbers available on results.
- [ ] ADR written.
- [ ] `pnpm check` passes.

## Technical notes

Extraction must run in the Node runtime within function limits.

## Test and eval plan

Unit tests with small fixture PDFs.

## Demo

Upload a text PDF and see results with page numbers.
