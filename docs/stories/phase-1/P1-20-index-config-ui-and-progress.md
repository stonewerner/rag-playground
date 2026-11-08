# P1-20: Index config UI with ingestion progress

**Phase:** 1 | **Status:** todo | **Depends on:** P1-10, P1-12, P1-19 | **Size:** M

## Why

Creating two configs over the same documents and watching them index is the visible half of
"ingestion-time knobs" and part of the Phase 1 exit criterion.

## User story

As a visitor, I want to create index configs for my uploads and watch them index, so that I can
compare chunking strategies on my own content.

## Scope

- On "My uploads": a form for chunker, chunk size, overlap (embedding model shown, fixed in Phase 1),
  with an explanation that these are ingestion-time knobs and creating one re-embeds documents.
- Estimated tokens and cost before submit (from document token counts).
- Config list with status badges; per-document progress bars that poll the progress route every
  2 s while indexing; error display for failed jobs.
- Shared corpus: preset list, read-only.

## Out of scope

- Deleting configs (parking lot unless trivial). Sparse toggle (P2-01).

## Acceptance criteria

- [ ] A guest with one uploaded doc creates two configs and sees both reach `ready`.
- [ ] Cap errors (config count, namespace cap, embed budget) show the cap name and next step.
- [ ] Polling stops when all jobs finish or the page is hidden.
- [ ] `pnpm check` passes.

## Technical notes

Client component for the polling; server action or route for creation (follow the bundled docs on
mutating data).

## Test and eval plan

Unit tests for the estimate helper; manual walkthrough.

## Demo

Upload a markdown file, create `heading_aware 256/32` and `fixed_token 512/64`, watch both index.
