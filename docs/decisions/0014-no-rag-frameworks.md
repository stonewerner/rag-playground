# ADR 0014: No RAG frameworks

**Status:** accepted · **Date:** 2026-11-07

## Context

The project demonstrates that Stone can build and measure retrieval systems. Frameworks hide the
parts interviewers ask about (chunk boundaries, fusion math, metric definitions) and add churn.

## Decision

No LangChain, LlamaIndex, Haystack, or similar. We write the chunkers, normalization rules, RRF,
metric computations, pipeline orchestration, ingestion jobs, and caching ourselves. Vendors provide
embedding models, vector storage, sparse and rerank models, and LLMs. Libraries are fine for
plumbing that is not the skill (HTML parsing, tokenization, S3 signing), each with an ADR or a note
in its story.

## Alternatives considered

LlamaIndex TS for loaders and chunkers: faster start, but the chunkers are the point.

## Consequences

More code to write and test; every line of the core is explainable.
