# Phase 1 — MVP: retrieval only

**Status:** todo · **Stories:** 24

## Goal

Dense retrieval with reranking over documents normalized to markdown and chunked three ways, with
everything visible: scores, rank movement after reranking, per-stage latency, cost, and replayable
run history. The shared EDGAR 10-K corpus is available to every guest.

## Exit criteria (definition of done)

A guest opens the app, picks the EDGAR corpus or uploads a markdown file, indexes it under two
chunking configs, runs a query, sees ranked chunks with scores, rerank movement, and per-stage
latency, and can replay any past run. Verified on production by P1-24's smoke script and checklist.

## Before starting

Confirm Q4 (embedding model), Q5 (reranker), Q9 (EDGAR companies and fiscal year). Decide Q3
(Pinecone plan) before the public demo.

## Tracks

- **Corpus:** P1-01 → P1-02 → P1-03 → P1-04 → P1-13
- **Chunking:** P1-05 → P1-06, P1-07 → P1-08
- **Ingestion:** P1-09, P1-10 → P1-11 → P1-12
- **Query:** P1-15 → P1-16 → P1-17 → P1-18
- **UI:** P1-14, P1-19 → P1-20, P1-21 → P1-22 → P1-23 → P1-24

## Stories

| ID                                                  | Title                                      | Size | Depends on                 | Critical path |
| --------------------------------------------------- | ------------------------------------------ | ---- | -------------------------- | ------------- |
| [P1-01](P1-01-document-normalization-core.md)       | Document normalization core                | M    | —                          | ★             |
| [P1-02](P1-02-html-to-markdown.md)                  | HTML to markdown conversion                | M    | P1-01                      |               |
| [P1-03](P1-03-edgar-fetch-script.md)                | EDGAR fetch script                         | M    | P0-01                      |               |
| [P1-04](P1-04-edgar-clean-and-fixtures.md)          | EDGAR cleaning and normalized fixtures     | L    | P1-02, P1-03               |               |
| [P1-05](P1-05-chunk-model-and-tokenizer.md)         | Chunk model, tokenizer, invariants         | S    | P1-01                      | ★             |
| [P1-06](P1-06-fixed-token-chunker.md)               | Fixed-token chunker                        | S    | P1-05                      |               |
| [P1-07](P1-07-recursive-chunker.md)                 | Recursive chunker                          | M    | P1-05                      | ★             |
| [P1-08](P1-08-heading-aware-chunker.md)             | Heading-aware markdown chunker             | M    | P1-05, P1-07               | ★             |
| [P1-09](P1-09-embedding-client.md)                  | OpenAI embedding client                    | M    | P0-01, P0-07               |               |
| [P1-10](P1-10-index-config-model.md)                | Index config model and creation API        | M    | P0-04, P0-10, P1-05        |               |
| [P1-11](P1-11-ingestion-pipeline-headless.md)       | Headless ingestion pipeline                | M    | P0-09, P1-06…P1-10         | ★             |
| [P1-12](P1-12-ingestion-job-runner.md)              | Ingestion job runner and progress API      | M    | P1-11, P0-06               |               |
| [P1-13](P1-13-shared-edgar-corpus-seed.md)          | Seed shared EDGAR corpus and presets       | M    | P1-04, P1-11               | ★             |
| [P1-14](P1-14-document-upload.md)                   | Document upload                            | M    | P0-08, P0-10, P1-01, P1-02 |               |
| [P1-15](P1-15-rerank-client-and-inference-cache.md) | Rerank client and inference cache          | M    | P0-04, P0-09, P0-10        |               |
| [P1-16](P1-16-query-pipeline-headless.md)           | Headless query pipeline (dense + rerank)   | M    | P0-07, P1-09, P1-15        |               |
| [P1-17](P1-17-pricing-and-run-cost.md)              | Price table and per-run cost               | S    | P0-07                      |               |
| [P1-18](P1-18-run-persistence-and-api.md)           | Run persistence and query API              | M    | P0-10, P1-16, P1-17        |               |
| [P1-19](P1-19-app-shell-and-corpus-browser.md)      | App shell, corpus browser, document viewer | M    | P0-05, P1-13, P1-14        | ★             |
| [P1-20](P1-20-index-config-ui-and-progress.md)      | Index config UI with ingestion progress    | M    | P1-10, P1-12, P1-19        |               |
| [P1-21](P1-21-query-panel-and-results.md)           | Query panel and results view               | M    | P1-18, P1-19               | ★             |
| [P1-22](P1-22-rank-movement-and-latency-viz.md)     | Rank movement and latency visualization    | M    | P1-21                      | ★             |
| [P1-23](P1-23-run-history-and-replay.md)            | Run history and replay                     | M    | P1-18, P1-21, P1-22        | ★             |
| [P1-24](P1-24-phase-1-exit-smoke-and-readme.md)     | Phase 1 exit check, smoke test, README     | S    | all P1                     | ★             |
