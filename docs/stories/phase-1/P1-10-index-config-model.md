# P1-10: Index config model and creation API

**Phase:** 1 | **Status:** todo | **Depends on:** P0-04, P0-10, P1-05 | **Size:** M

## Why

Index configs are the first-class object that makes chunking comparisons possible (ADR 0016).
Canonical params and hashing prevent duplicate work and silent mixing of chunk generations.

## User story

As a visitor, I want to define an index config (chunker, size, overlap), so that I can index the
same documents several ways and compare them.

## Scope

- `src/pipeline/config/index-config.ts`: Zod `IndexConfigParams` per `docs/architecture.md` §2,
  with bounds (size 128–1024, overlap ≤ size/2), defaults, `canonicalize()` (sorted keys, chunker
  version filled from the registry), and `paramsHash()` (sha256 of canonical JSON).
- `src/lib/index-configs.ts`: `createIndexConfig(corpusId, params, { isPreset })` → row with
  `namespace = cfg-<uuid>`, status `pending`; returns the existing row if the hash already exists.
- `POST /api/corpora/:id/index-configs` for guest corpora: requires session ownership, calls
  `assertConfigAllowed`, creates the config, enqueues jobs for all documents (job runner from
  P1-12; until then, create `queued` job rows only).
- Shared corpus: guests get 403; presets are created only by the seed script.
- Human-readable default name, e.g. `heading-aware · 512/64 · te3-small`.

## Out of scope

- UI (P1-20). Running the jobs (P1-11/P1-12).

## Acceptance criteria

- [ ] Equivalent params in different key order hash identically; any change in a param or chunker
      version changes the hash (tests).
- [ ] Creating the same config twice returns the same row (test).
- [ ] Guests cannot create configs on the shared corpus or another session's corpus (tests).
- [ ] Config count cap and global namespace cap enforced (tests).
- [ ] `pnpm check` passes.

## Technical notes

Embedding model and dimensions default from env (`OPENAI_EMBEDDING_MODEL`) and must exist in the
dense-index registry (one entry in Phase 1).

## Test and eval plan

Unit tests for schema and hashing; integration tests for the route.

## Demo

`curl` the route twice with reordered JSON and show one config row.
