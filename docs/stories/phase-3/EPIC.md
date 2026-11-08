# Phase 3 — Generate

**Status:** todo · **Stories:** 10

## Goal

A generation toggle that streams an answer from retrieved chunks with inline citations mapped to
chunks (and therefore source spans), an explicit abstain path, LLM-as-judge scores for faithfulness
and citation correctness (calibrated against human labels), and tokens and cost per run.

## Exit criteria

Answer quality is measurable and comparable across retrieval configs: scorecards and the benchmark
include faithfulness, citation correctness, abstain accuracy, tokens, and cost, reproducible from
caches.

## Before starting

Resolve Q12 (generator and judge models). Book Stone's labeling time for P3-08 (1–2 hours).

## Stories

| ID                                                    | Title                                            | Size | Depends on          | Critical path |
| ----------------------------------------------------- | ------------------------------------------------ | ---- | ------------------- | ------------- |
| [P3-01](P3-01-generation-design-and-sdk-setup.md)     | Generation design and AI SDK setup               | S    | P2-18               | ★             |
| [P3-02](P3-02-answer-generation-stage.md)             | Answer generation stage (headless, streamed)     | M    | P3-01, P1-16        | ★             |
| [P3-03](P3-03-citation-parsing-and-mapping.md)        | Citation parsing and mapping                     | S    | P3-02               | ★             |
| [P3-04](P3-04-abstain-path.md)                        | Abstain path                                     | M    | P3-02, P2-10        |               |
| [P3-05](P3-05-generation-persistence-and-cost.md)     | Generation persistence and cost                  | S    | P3-03, P3-04, P1-17 | ★             |
| [P3-06](P3-06-streaming-answer-ui.md)                 | Streaming answer UI with inline citations        | M    | P3-05, P1-21        |               |
| [P3-07](P3-07-llm-judge.md)                           | LLM judge: faithfulness and citation correctness | M    | P3-05               | ★             |
| [P3-08](P3-08-judge-calibration.md)                   | Judge calibration against human labels           | M    | P3-07               | ★             |
| [P3-09](P3-09-answer-quality-in-batch-and-compare.md) | Answer quality in batch eval and compare         | M    | P3-07, P2-13, P2-16 |               |
| [P3-10](P3-10-phase-3-benchmark-update.md)            | Phase 3 benchmark update                         | S    | P3-08, P3-09        | ★             |
