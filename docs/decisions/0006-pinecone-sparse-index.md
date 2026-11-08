# ADR 0006: Separate Pinecone sparse index with the hosted sparse model

**Status:** accepted · **Date:** 2026-11-07

## Context

Hybrid search needs a lexical retriever. We want the fusion to be ours (ADR 0007), so the two
retrievers must return independent ranked lists.

## Decision

A second document index, `rag-playground-sparse`, whose `chunk_text` field declares
`sparse_embed` with `pinecone-sparse-english-v0` (`max_tokens_per_sequence: 2048` so chunks up to
1024 cl100k tokens are not truncated). Pinecone embeds documents on upsert (≤ 96 per batch) and the
query text at search time. Same namespaces (`cfg-<uuid>`) and same `_id`s as the dense index, so
fusion joins on chunk ID. Search uses a single `sparse_embed` `score_by` clause.

Populated from Phase 2 (P2-01), with a backfill for existing configs.

Docs (verified 2026-11-07): https://docs.pinecone.io/models/pinecone-sparse-english-v0 ·
https://docs.pinecone.io/guides/search/sparse-vector-search ·
https://docs.pinecone.io/guides/search/integrated-embedding

## Alternatives considered

- **One document index with both a `dense_vector` and a `sparse_embed` field.** The 2026-07 API
  appears to allow it, and since each search takes one `score_by` clause, fusion would still be
  ours. Rejected for now: separate indexes let Phase 1 ship without sparse ingestion, keep each
  index's quotas and failures independent, and match the original brief. Worth revisiting if
  index count becomes a constraint.
- **BM25 in Postgres (`tsvector`)** or a hand-built BM25: more "by hand", but a second retrieval
  stack to operate. Possible Phase 4 comparison (parking lot if raised).
- **Legacy single hybrid index (dotproduct, dense + sparse in one vector):** fuses server-side by
  score scaling, which is exactly what we want to own.

## Consequences

- Sparse embedding tokens count against the plan quota (5M/month per model on Starter).
- Sparse search can return fewer than `candidateK` hits (only documents sharing a term).
