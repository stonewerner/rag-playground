# Phase 2 — Measure

**Status:** todo · **Stories:** 18 · **Do not reorder after Phase 3.**

## Goal

Turn the playground into an evaluation lab: hybrid retrieval with hand-built RRF and an alpha knob,
config-independent span labels, a reviewed EDGAR gold set, per-run and batch metrics with confidence
intervals, side-by-side comparison, and a reproducible benchmark.

## Exit criteria

A reproducible benchmark table (dense-only vs. sparse vs. hybrid vs. hybrid + rerank, across
chunking strategies, on the test split) produced by `pnpm bench`, and the real X → Y nDCG@10 number
with a 95% CI, published on `/benchmark` and in the README.

## Before starting

Confirm Q6 (τ) and Q11 (gold set workflow). Book Stone's review time for P2-10 (2–3 hours).

## Scheduling note

The gold-set track (P2-07 → P2-10) depends only on P1-04 and P0-04 and is the long pole (it needs
Stone's review). Start it as soon as the EDGAR fixtures exist, in parallel with late Phase 1.

## Stories

| ID                                               | Title                                           | Size | Depends on                 | Critical path |
| ------------------------------------------------ | ----------------------------------------------- | ---- | -------------------------- | ------------- |
| [P2-01](P2-01-sparse-ingestion-and-backfill.md)  | Sparse ingestion and backfill                   | M    | P1-11, P1-13               |               |
| [P2-02](P2-02-sparse-retrieval-stage.md)         | Sparse retrieval stage                          | S    | P2-01, P1-16               |               |
| [P2-03](P2-03-rrf-fusion.md)                     | Weighted RRF fusion (hand-written)              | S    | —                          |               |
| [P2-04](P2-04-hybrid-pipeline-and-knobs.md)      | Hybrid query mode and knobs                     | M    | P2-02, P2-03, P1-21, P1-22 |               |
| [P2-05](P2-05-span-relevance-judging.md)         | Span overlap and relevance judging              | S    | P1-05                      |               |
| [P2-06](P2-06-retrieval-metrics.md)              | Retrieval metrics and bootstrap CIs             | M    | P2-05                      |               |
| [P2-07](P2-07-gold-set-format-and-loader.md)     | Gold set fixture format, validator, loader      | M    | P1-04, P0-04               | ★             |
| [P2-08](P2-08-gold-span-locator-cli.md)          | Gold span locator CLI                           | S    | P2-07                      | ★             |
| [P2-09](P2-09-draft-edgar-gold-set.md)           | Draft the EDGAR gold set                        | L    | P2-08                      | ★             |
| [P2-10](P2-10-review-and-freeze-gold-set.md)     | Review and freeze gold set v1 (Stone)           | M    | P2-09                      | ★             |
| [P2-11](P2-11-per-run-metrics.md)                | Per-run metrics                                 | M    | P2-06, P2-07, P1-18        | ★             |
| [P2-12](P2-12-labeling-ui.md)                    | Relevance labeling UI                           | L    | P2-11, P1-21               |               |
| [P2-13](P2-13-batch-eval-runner.md)              | Batch eval runner                               | M    | P2-11, P2-04               | ★             |
| [P2-14](P2-14-eval-scorecard-ui.md)              | Eval scorecard UI                               | M    | P2-13                      |               |
| [P2-15](P2-15-compare-same-query.md)             | Compare two configs on the same query           | M    | P2-04, P2-11               |               |
| [P2-16](P2-16-compare-scorecards-with-deltas.md) | Compare scorecards with deltas and significance | M    | P2-13, P2-14               |               |
| [P2-17](P2-17-benchmark-script.md)               | Benchmark script and committed results          | M    | P2-13, P2-10               | ★             |
| [P2-18](P2-18-benchmark-page-and-write-up.md)    | Benchmark page and write-up                     | S    | P2-17, P2-14, P2-16        | ★             |
