# P1-13: Seed the shared EDGAR corpus and preset configs

**Phase:** 1 | **Status:** todo | **Depends on:** P1-04, P1-11 | **Size:** M

## Why

Every guest gets a meaningful corpus instantly, and the benchmark runs on fixed, shared presets.
Indexing once and sharing read-only also guards the bill.

## User story

As a visitor, I want the 10-K corpus ready to query with a few chunking presets, so that I can
experiment without uploading anything.

## Scope

- `scripts/corpus-seed.ts` (`pnpm corpus:seed`): upsert the shared corpus (`slug: edgar-10k`), insert
  documents from `fixtures/edgar/` (dedupe by content hash; metadata from the manifest), create
  preset index configs from `scripts/presets.ts`, and index every document under every preset by
  calling `indexDocument` directly (no job runner), with progress output.
- Initial presets (adjust in this story if cost or namespace math says otherwise):
  `fixed_token 512/64`, `recursive 512/64`, `heading_aware 512/64`, `heading_aware 256/32`,
  `heading_aware 1024/128`, all `text-embedding-3-small@1536`.
- Idempotent: re-running indexes only what is missing; `--force-config <id>` reindexes one.
- Print a cost summary (tokens embedded, estimated dollars).

## Out of scope

- Sparse indexing of presets (P2-01 backfills). Gold set (Phase 2).

## Acceptance criteria

- [ ] Fresh run creates 1 shared corpus, all documents, all presets, and fully indexed namespaces;
      record counts per namespace match `chunks` counts (script verifies and prints).
- [ ] Re-run is a no-op (no embedding calls).
- [ ] Presets are `is_preset = true` and the corpus `is_shared = true`.
- [ ] Production seeded once; tokens and cost recorded here.
- [ ] CLAUDE.md commands table updated.
- [ ] `pnpm check` passes.

## Technical notes

- Expect roughly 100k tokens per filing; 5 filings × 5 presets ≈ 2.5M embedding tokens (≈ $0.05 at
  te3-small prices). Pinecone write units are the more relevant quota; check after the run.

## Test and eval plan

Integration test of idempotency with fake clients; real run verification.

## Demo

Run the seed against a fresh database and show the summary table.
