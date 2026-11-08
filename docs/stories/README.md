# Backlog

The single source of truth for story status. Rows are in **recommended execution order** (story
numbers are already a valid dependency order). Update the row when you start (`in-progress`) and
finish (`done`) a story, along with the story file and the phase `EPIC.md` (see `CLAUDE.md`).

**Statuses:** `todo` · `in-progress` · `blocked` · `review` · `done`
**Sizes:** S ≤ half a day · M ≈ one day · L = one long focused session (split if it grows)
**★ = critical path** to the phase's exit criterion. Phase 2's ★ chain leads to the headline number.

| Phase                                    | Stories    | Exit criterion                                                                           |
| ---------------------------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| [0 Foundations](phase-0/EPIC.md)         | 11         | Deployed empty app with working guest session and DB                                     |
| [1 MVP: retrieval only](phase-1/EPIC.md) | 24         | Guest indexes under two configs, queries, sees rerank movement and latency, replays runs |
| [2 Measure](phase-2/EPIC.md)             | 18         | Reproducible benchmark table and the real X → Y nDCG@10                                  |
| [3 Generate](phase-3/EPIC.md)            | 10         | Answer quality measurable and comparable across retrieval configs                        |
| [4 Depth extensions](phase-4/EPIC.md)    | 9 (subset) | Each shipped extension has a benchmark delta                                             |
| [5 Agentic (optional)](phase-5/EPIC.md)  | 4          | Agentic vs single-shot comparison recorded                                               |
| **Total**                                | **76**     |                                                                                          |

**Parallel tracks worth knowing:** P0-07/08/09 run beside the Phase 0 critical path. In Phase 1, the
corpus track (P1-02 → P1-04) runs beside the chunking track. **The gold-set track (P2-07 → P2-10)
needs only P1-04 and is the project's long pole (Stone's review time), so start it during late
Phase 1.** P2-03 (RRF) and P2-05/P2-06 (judging, metrics) are pure functions that can be built at
any time.

## Phase 0 — Foundations

| ID                                                      | Title                                  | Status | Size | Depends on                 | ★   | Summary                                                            |
| ------------------------------------------------------- | -------------------------------------- | ------ | ---- | -------------------------- | --- | ------------------------------------------------------------------ |
| [P0-01](phase-0/P0-01-env-config-and-validation.md)     | Typed, validated environment config    | done   | S    | —                          | ★   | Zod-validated server-only `env` module covering `.env.example`     |
| [P0-02](phase-0/P0-02-ci-pipeline.md)                   | CI pipeline on GitHub Actions          | review | S    | P0-01                      |     | `pnpm check` + build on every push and PR                          |
| [P0-03](phase-0/P0-03-postgres-drizzle-setup.md)        | Postgres connection and Drizzle setup  | todo   | M    | P0-01                      | ★   | Provider provisioned, pooled client, migrations, `/api/health`     |
| [P0-04](phase-0/P0-04-core-schema-v1.md)                | Core schema v1                         | todo   | M    | P0-03                      | ★   | All core tables in schema `app` with constraints and cascades      |
| [P0-05](phase-0/P0-05-guest-session-cookie.md)          | Guest sessions via signed cookie       | todo   | M    | P0-04                      | ★   | HMAC cookie in `proxy.ts`, lazy session rows                       |
| [P0-06](phase-0/P0-06-vercel-deploy-and-health-page.md) | Vercel deploy pipeline and status page | todo   | M    | P0-03, P0-05               | ★   | Preview + production deploys, `/status`, verified Vercel limits    |
| [P0-07](phase-0/P0-07-stage-timing-and-logging.md)      | Stage timing and structured logging    | todo   | S    | —                          |     | `timeStage` traces and JSON logs, headless-safe                    |
| [P0-08](phase-0/P0-08-blob-storage-module.md)           | Blob storage module                    | todo   | S    | P0-01                      |     | S3-compatible put/get/delete/deletePrefix                          |
| [P0-09](phase-0/P0-09-pinecone-indexes-and-client.md)   | Pinecone indexes and client wrapper    | todo   | M    | P0-01                      |     | Idempotent setup of dense + sparse document indexes; typed wrapper |
| [P0-10](phase-0/P0-10-rate-limits-and-caps.md)          | Rate limits and per-session caps       | todo   | M    | P0-04, P0-05               |     | Postgres fixed-window limiter and cap guards returning 429         |
| [P0-11](phase-0/P0-11-guest-ttl-cleanup-cron.md)        | Guest TTL cleanup cron                 | todo   | M    | P0-04, P0-06, P0-08, P0-09 |     | Daily deletion of idle sessions' namespaces, blobs, rows           |

## Phase 1 — MVP: retrieval only

| ID                                                          | Title                                      | Status | Size | Depends on                 | ★   | Summary                                                           |
| ----------------------------------------------------------- | ------------------------------------------ | ------ | ---- | -------------------------- | --- | ----------------------------------------------------------------- |
| [P1-01](phase-1/P1-01-document-normalization-core.md)       | Document normalization core                | todo   | M    | —                          | ★   | NFC markdown, stable UTF-16 offsets, content hash                 |
| [P1-02](phase-1/P1-02-html-to-markdown.md)                  | HTML to markdown conversion                | todo   | M    | P1-01                      |     | Converter chosen by comparison; GFM tables; ADR                   |
| [P1-03](phase-1/P1-03-edgar-fetch-script.md)                | EDGAR fetch script                         | todo   | M    | P0-01                      |     | Polite, cached 10-K download with provenance manifest             |
| [P1-04](phase-1/P1-04-edgar-clean-and-fixtures.md)          | EDGAR cleaning and normalized fixtures     | todo   | L    | P1-02, P1-03               |     | Strip XBRL noise, Item headings, clean tables, committed fixtures |
| [P1-05](phase-1/P1-05-chunk-model-and-tokenizer.md)         | Chunk model, tokenizer, invariants         | todo   | S    | P1-01                      | ★   | Shared types, cl100k token counts, invariant checker, registry    |
| [P1-06](phase-1/P1-06-fixed-token-chunker.md)               | Fixed-token chunker                        | todo   | S    | P1-05                      |     | Baseline token windows snapped to whitespace                      |
| [P1-07](phase-1/P1-07-recursive-chunker.md)                 | Recursive chunker                          | todo   | M    | P1-05                      | ★   | Paragraph/sentence-respecting splits with exact offsets           |
| [P1-08](phase-1/P1-08-heading-aware-chunker.md)             | Heading-aware markdown chunker             | todo   | M    | P1-05, P1-07               | ★   | Section chunks with heading paths; tables kept whole              |
| [P1-09](phase-1/P1-09-embedding-client.md)                  | OpenAI embedding client                    | todo   | M    | P0-01, P0-07               |     | Direct REST, batching, retries, usage; model verified             |
| [P1-10](phase-1/P1-10-index-config-model.md)                | Index config model and creation API        | todo   | M    | P0-04, P0-10, P1-05        |     | Canonical params, hash, namespace, caps                           |
| [P1-11](phase-1/P1-11-ingestion-pipeline-headless.md)       | Headless ingestion pipeline                | todo   | M    | P0-09, P1-06…P1-10         | ★   | Chunk → persist → embed → upsert, idempotent and resumable        |
| [P1-12](phase-1/P1-12-ingestion-job-runner.md)              | Ingestion job runner and progress API      | todo   | M    | P1-11, P0-06               |     | Leased jobs via `after()`, progress route resumes stalled jobs    |
| [P1-13](phase-1/P1-13-shared-edgar-corpus-seed.md)          | Seed shared EDGAR corpus and presets       | todo   | M    | P1-04, P1-11               | ★   | Shared corpus with 5 preset configs, indexed once                 |
| [P1-14](phase-1/P1-14-document-upload.md)                   | Document upload                            | todo   | M    | P0-08, P0-10, P1-01, P1-02 |     | md/txt/html upload with caps and dedupe                           |
| [P1-15](phase-1/P1-15-rerank-client-and-inference-cache.md) | Rerank client and inference cache          | todo   | M    | P0-04, P0-09, P0-10        |     | `bge-reranker-v2-m3` with cached responses and query embeddings   |
| [P1-16](phase-1/P1-16-query-pipeline-headless.md)           | Headless query pipeline (dense + rerank)   | todo   | M    | P0-07, P1-09, P1-15        |     | Timed stages, every candidate with scores and ranks               |
| [P1-17](phase-1/P1-17-pricing-and-run-cost.md)              | Price table and per-run cost               | todo   | S    | P0-07                      |     | Versioned list prices and per-run cost estimate                   |
| [P1-18](phase-1/P1-18-run-persistence-and-api.md)           | Run persistence and query API              | todo   | M    | P0-10, P1-16, P1-17        |     | Immutable run snapshots with all candidates                       |
| [P1-19](phase-1/P1-19-app-shell-and-corpus-browser.md)      | App shell, corpus browser, document viewer | todo   | M    | P0-05, P1-13, P1-14        | ★   | Navigation, corpora, span-highlighting document viewer            |
| [P1-20](phase-1/P1-20-index-config-ui-and-progress.md)      | Index config UI with ingestion progress    | todo   | M    | P1-10, P1-12, P1-19        |     | Create configs, see cost estimate, watch indexing                 |
| [P1-21](phase-1/P1-21-query-panel-and-results.md)           | Query panel and results view               | todo   | M    | P1-18, P1-19               | ★   | Query knobs, ranked chunks with scores and sources                |
| [P1-22](phase-1/P1-22-rank-movement-and-latency-viz.md)     | Rank movement and latency visualization    | todo   | M    | P1-21                      | ★   | Pre/post-rerank slope chart and stage latency bar                 |
| [P1-23](phase-1/P1-23-run-history-and-replay.md)            | Run history and replay                     | todo   | M    | P1-18, P1-21, P1-22        | ★   | View snapshots without vendor calls; re-run and diff              |
| [P1-24](phase-1/P1-24-phase-1-exit-smoke-and-readme.md)     | Phase 1 exit check, smoke test, README     | todo   | S    | all P1                     | ★   | Scripted DoD check on production, README demo script              |

## Phase 2 — Measure

| ID                                                       | Title                                           | Status | Size | Depends on                 | ★   | Summary                                                   |
| -------------------------------------------------------- | ----------------------------------------------- | ------ | ---- | -------------------------- | --- | --------------------------------------------------------- |
| [P2-01](phase-2/P2-01-sparse-ingestion-and-backfill.md)  | Sparse ingestion and backfill                   | todo   | M    | P1-11, P1-13               |     | Same chunk IDs in the sparse index; backfill presets      |
| [P2-02](phase-2/P2-02-sparse-retrieval-stage.md)         | Sparse retrieval stage                          | todo   | S    | P2-01, P1-16               |     | Sparse-only mode with scores and ranks                    |
| [P2-03](phase-2/P2-03-rrf-fusion.md)                     | Weighted RRF fusion (hand-written)              | todo   | S    | —                          |     | Pure, deterministic, property-tested RRF with alpha       |
| [P2-04](phase-2/P2-04-hybrid-pipeline-and-knobs.md)      | Hybrid query mode and knobs                     | todo   | M    | P2-02, P2-03, P1-21, P1-22 |     | Hybrid mode, alpha slider, dense/sparse/fused ranks in UI |
| [P2-05](phase-2/P2-05-span-relevance-judging.md)         | Span overlap and relevance judging              | todo   | S    | P1-05                      |     | Coverage ≥ τ and span claiming (dedup)                    |
| [P2-06](phase-2/P2-06-retrieval-metrics.md)              | Retrieval metrics and bootstrap CIs             | todo   | M    | P2-05                      |     | recall@k, MRR, nDCG@k, judged@k, CIs, paired deltas       |
| [P2-07](phase-2/P2-07-gold-set-format-and-loader.md)     | Gold set fixture format, validator, loader      | todo   | M    | P1-04, P0-04               | ★   | Versioned JSON with span text and hashes; sync to DB      |
| [P2-08](phase-2/P2-08-gold-span-locator-cli.md)          | Gold span locator CLI                           | todo   | S    | P2-07                      | ★   | Quote → exact offsets; add/show spans                     |
| [P2-09](phase-2/P2-09-draft-edgar-gold-set.md)           | Draft the EDGAR gold set                        | todo   | L    | P2-08                      | ★   | ~50 typed, split questions with minimal evidence spans    |
| [P2-10](phase-2/P2-10-review-and-freeze-gold-set.md)     | Review and freeze gold set v1 (Stone)           | todo   | M    | P2-09                      | ★   | Human review of every question; freeze `edgar-v1`         |
| [P2-11](phase-2/P2-11-per-run-metrics.md)                | Per-run metrics                                 | todo   | M    | P2-06, P2-07, P1-18        | ★   | Metrics on any run linked to a gold question              |
| [P2-12](phase-2/P2-12-labeling-ui.md)                    | Relevance labeling UI                           | todo   | L    | P2-11, P1-21               |     | Label chunks as spans with optional evidence highlight    |
| [P2-13](phase-2/P2-13-batch-eval-runner.md)              | Batch eval runner                               | todo   | M    | P2-11, P2-04               | ★   | Gold set × config → scorecard, cached and resumable       |
| [P2-14](phase-2/P2-14-eval-scorecard-ui.md)              | Eval scorecard UI                               | todo   | M    | P2-13                      |     | Metric tiles with CIs, per-type, per-question drill-down  |
| [P2-15](phase-2/P2-15-compare-same-query.md)             | Compare two configs on the same query           | todo   | M    | P2-04, P2-11               |     | Side-by-side results matched by span overlap              |
| [P2-16](phase-2/P2-16-compare-scorecards-with-deltas.md) | Compare scorecards with deltas and significance | todo   | M    | P2-13, P2-14               |     | Paired-bootstrap deltas, wins/losses, scatter             |
| [P2-17](phase-2/P2-17-benchmark-script.md)               | Benchmark script and committed results          | todo   | M    | P2-13, P2-10               | ★   | Alpha tuned on dev, matrix on test, generated tables      |
| [P2-18](phase-2/P2-18-benchmark-page-and-write-up.md)    | Benchmark page and write-up                     | todo   | S    | P2-17, P2-14, P2-16        | ★   | `/benchmark`, methodology, caveats, README headline       |

## Phase 3 — Generate

| ID                                                            | Title                                            | Status | Size | Depends on          | ★   | Summary                                                      |
| ------------------------------------------------------------- | ------------------------------------------------ | ------ | ---- | ------------------- | --- | ------------------------------------------------------------ |
| [P3-01](phase-3/P3-01-generation-design-and-sdk-setup.md)     | Generation design and AI SDK setup               | todo   | S    | P2-18               | ★   | Models chosen, prompt v1, citation and abstain contract      |
| [P3-02](phase-3/P3-02-answer-generation-stage.md)             | Answer generation stage (headless, streamed)     | todo   | M    | P3-01, P1-16        | ★   | Streamed answers with TTFT and token usage                   |
| [P3-03](phase-3/P3-03-citation-parsing-and-mapping.md)        | Citation parsing and mapping                     | todo   | S    | P3-02               | ★   | Sentences → cited chunks → source spans                      |
| [P3-04](phase-3/P3-04-abstain-path.md)                        | Abstain path                                     | todo   | M    | P3-02, P2-10        |     | Abstain marker, evidence threshold, abstain precision/recall |
| [P3-05](phase-3/P3-05-generation-persistence-and-cost.md)     | Generation persistence and cost                  | todo   | S    | P3-03, P3-04, P1-17 | ★   | Answers, citations, tokens, cost on the run; LLM caps        |
| [P3-06](phase-3/P3-06-streaming-answer-ui.md)                 | Streaming answer UI with inline citations        | todo   | M    | P3-05, P1-21        |     | Streaming panel, citation chips linked to sources            |
| [P3-07](phase-3/P3-07-llm-judge.md)                           | LLM judge: faithfulness and citation correctness | todo   | M    | P3-05               | ★   | Structured, versioned, cached judge with a different model   |
| [P3-08](phase-3/P3-08-judge-calibration.md)                   | Judge calibration against human labels           | todo   | M    | P3-07               | ★   | Stone labels ~40 answers; agreement and kappa report         |
| [P3-09](phase-3/P3-09-answer-quality-in-batch-and-compare.md) | Answer quality in batch eval and compare         | todo   | M    | P3-07, P2-13, P2-16 |     | Answer-quality columns and deltas in scorecards              |
| [P3-10](phase-3/P3-10-phase-3-benchmark-update.md)            | Phase 3 benchmark update                         | todo   | S    | P3-08, P3-09        | ★   | Answer-quality benchmark rows; Phase 4 subset agreed         |

## Phase 4 — Depth extensions (pick a subset)

| ID                                                      | Title                                | Status | Size | Depends on   | ★   | Summary                                                |
| ------------------------------------------------------- | ------------------------------------ | ------ | ---- | ------------ | --- | ------------------------------------------------------ |
| [P4-01](phase-4/P4-01-headless-pipeline-entrypoints.md) | Headless pipeline entrypoints        | todo   | S    | P2-13        |     | One documented API into the pipeline for harnesses     |
| [P4-02](phase-4/P4-02-promptfoo-regression-suite.md)    | promptfoo regression suite in CI     | todo   | M    | P4-01        |     | CI fails when nDCG@10 drops below baseline − tolerance |
| [P4-03](phase-4/P4-03-contextual-chunk-headers.md)      | Contextual chunk headers             | todo   | M    | P2-17        |     | Title + heading path in embedded text; measured        |
| [P4-04](phase-4/P4-04-multi-query-rewriting.md)         | Multi-query rewriting                | todo   | M    | P2-17, P3-01 |     | N paraphrases fused with RRF; measured per type        |
| [P4-05](phase-4/P4-05-hyde.md)                          | HyDE                                 | todo   | M    | P4-04        |     | Hypothetical-answer embeddings; measured               |
| [P4-06](phase-4/P4-06-second-embedding-model.md)        | Second embedding model               | todo   | M    | P2-17        |     | Dense index registry; quality vs cost vs dims          |
| [P4-07](phase-4/P4-07-second-reranker.md)               | Second reranker comparison           | todo   | M    | P2-17        |     | Cohere Rerank 4 Fast (Standard plan) vs bge            |
| [P4-08](phase-4/P4-08-text-only-pdf.md)                 | Text-only PDF support (layout-lossy) | todo   | M    | P1-14        |     | Text extraction with page map; scanned PDFs rejected   |
| [P4-09](phase-4/P4-09-otel-tracing.md)                  | OpenTelemetry tracing (optional)     | todo   | M    | P0-07        |     | Stage timings exported as OTel spans                   |

## Phase 5 — Agentic retrieval (optional)

| ID                                                    | Title                             | Status | Size | Depends on   | ★   | Summary                                               |
| ----------------------------------------------------- | --------------------------------- | ------ | ---- | ------------ | --- | ----------------------------------------------------- |
| [P5-01](phase-5/P5-01-eve-spike.md)                   | eve spike                         | todo   | S    | P4-01        | ★   | One-day check that eve fits; go/no-go recorded        |
| [P5-02](phase-5/P5-02-agentic-retrieval-agent.md)     | Agentic retrieval agent           | todo   | L    | P5-01        | ★   | Decompose, search iteratively, output ranked evidence |
| [P5-03](phase-5/P5-03-agentic-vs-single-shot-eval.md) | Agentic vs single-shot evaluation | todo   | M    | P5-02, P2-17 | ★   | Same gold set: metrics, cost, latency, variance       |
| [P5-04](phase-5/P5-04-agent-trace-ui.md)              | Agent trace UI                    | todo   | M    | P5-02        |     | Step timeline from the persisted trace                |
