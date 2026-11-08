# ADR 0008: Pinecone-hosted reranker, cached

**Status:** accepted · **Date:** 2026-11-07

## Context

Cross-encoder reranking usually improves precision at the top. Pinecone hosts rerank models behind
the same API key. Rerank requests are the scarcest quota on the free plans.

## Decision

- Use `pc.inference.rerank` with **`bge-reranker-v2-m3`** (the only reranker on Starter/Builder;
  `pinecone-rerank-v0` is deprecated). Limits: 1024 tokens per query+document pair, 100 documents
  per request. Model name comes from config (`PINECONE_RERANK_MODEL`).
- Send the top `depth` candidates (≤ 100) with `topN = depth` so every sent candidate gets a score.
- Cache responses in `inference_cache` keyed by model, query hash, and the ordered candidate IDs
  with text hashes. Count only cache misses against caps.
- Record a `possibly_truncated` flag when query + chunk tokens may exceed the model limit.

Docs (verified 2026-11-07): https://docs.pinecone.io/guides/search/rerank-results ·
https://docs.pinecone.io/models/bge-reranker-v2-m3 · https://docs.pinecone.io/models/cohere-rerank-4-fast

## Alternatives considered

- **Cohere/Voyage/Jina APIs directly:** another vendor key; reserved for the Phase 4 second-reranker
  comparison (`cohere-rerank-4-fast` via Pinecone needs the Standard plan).
- **Self-hosted cross-encoder:** no GPU budget; not the skill being shown.

## Consequences

Chunk size is capped at 1024 tokens. Rerank quota drives the global and per-session caps
(ADR 0022) and the Pinecone plan decision (open question Q3).
