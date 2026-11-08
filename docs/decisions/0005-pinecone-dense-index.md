# ADR 0005: Pinecone dense document index with our own vectors

**Status:** accepted · **Date:** 2026-11-07

## Context

Dense retrieval needs a managed vector store with namespaces (one per index config) and per-hit
scores. Pinecone's current API (2026-07) is the **Documents API**; the docs say new projects should
use it, while legacy Vectors/Records indexes keep working.

## Decision

- One Pinecone **document index** per embedding space, starting with `rag-playground-dense` for
  `text-embedding-3-small@1536`. Schema: `embedding` as `dense_vector` (1536, cosine) holding
  vectors **we** compute with OpenAI (ADR 0009), plus stored fields `chunk_text`, `document_id`,
  `index_config_id`, `ordinal`, `start_char`, `end_char`.
- Namespace per index config: `cfg-<uuid>` (ADR 0016). Document `_id` = chunk ID.
- Search with a single `dense_vector` `score_by` clause; read `_score` per hit.
- Use the official TypeScript SDK `@pinecone-database/pinecone` (v9.x, Node ≥ 22) where it covers
  the Documents API; fall back to `fetch` with `X-Pinecone-Api-Version: 2026-07` for anything it
  lacks. Indexes are created by an idempotent script (`pnpm pinecone:setup`), never by the app.

Docs (verified 2026-11-07):
https://docs.pinecone.io/guides/indexes/create-an-index ·
https://docs.pinecone.io/reference/api/2026-07/data-plane/search_documents ·
https://docs.pinecone.io/guides/indexes/move-to-the-documents-api · https://sdk.pinecone.io/typescript/

## Alternatives considered

- **Pinecone integrated dense embedding (`embed`, e.g. llama-text-embed-v2):** less code, but hides
  the embedding step we want to own and compare across models.
- **Legacy vector index API:** still supported, but not recommended for new projects.
- **pgvector:** see ADR 0003.

## Consequences

- A second embedding model with different dimensions needs a second dense index (P4-06).
- Starter limits shape guardrails: 100 namespaces per index, 5 indexes, 2 GB (ADR 0022).
- Upserts of our own vectors: ≤ 1,000 records and ≤ 2 MB per request (≈ 100 records at 1536 dims).
