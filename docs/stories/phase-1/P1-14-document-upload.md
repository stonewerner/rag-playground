# P1-14: Document upload

**Phase:** 1 | **Status:** todo | **Depends on:** P0-08, P0-10, P1-01, P1-02 | **Size:** M

## Why

Uploading your own document is half of the Phase 1 exit criterion and shows the pipeline is general,
not tuned to one corpus.

## User story

As a visitor, I want to upload a markdown, text, or HTML file, so that I can run retrieval
experiments on my own content.

## Scope

- `POST /api/uploads` (multipart): `requireSession`, `assertUploadAllowed` (size, doc count),
  detect type by extension and sniffing (md, txt, html only), normalize, reject empty results,
  create the guest corpus lazily ("My uploads"), store the original in blob storage, insert the
  document (dedupe by content hash → return existing).
- If the corpus already has index configs, enqueue ingestion jobs for the new document (subject to
  `assertEmbedBudget`).
- Upload UI: file picker + drag-and-drop on the corpus page, error messages for each cap.
- `GET /api/corpora/:id/documents`: list with title, type, size, tokens, created time.

## Out of scope

- PDF (P4-08). Deleting documents (parking lot unless trivial).

## Acceptance criteria

- [ ] md, txt, html upload successfully; other types return 415 with a clear message.
- [ ] Oversized files return 413/429 with the cap name; the 11th document hits the doc-count cap.
- [ ] Duplicate upload returns the existing document, no new row.
- [ ] Original blob stored under `sessions/<id>/originals/<docId>`.
- [ ] Token count stored on the document.
- [ ] `pnpm check` passes.

## Technical notes

- Route handlers and `request.formData()`: `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- Vercel request body limit (~4.5 MB) is above our 1 MB cap; verify in P0-06's limits note.

## Test and eval plan

Integration tests for each rejection path and the happy path with fake blob storage.

## Demo

Upload a README.md and see it listed with its token count.
