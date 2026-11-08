# Architecture Decision Records

One file per decision: `NNNN-kebab-title.md`. Short: context, decision, alternatives considered,
consequences. A new dependency or architectural change needs an ADR (see `CLAUDE.md`). To change a
decision, add a new ADR that supersedes the old one and set the old one's status to
`superseded by NNNN`.

| ADR                                            | Title                                                                 | Status                   |
| ---------------------------------------------- | --------------------------------------------------------------------- | ------------------------ |
| [0001](0001-nextjs-app-router-on-vercel.md)    | Next.js App Router + TypeScript on Vercel                             | accepted                 |
| [0002](0002-dev-tooling.md)                    | Dev tooling: pnpm, ESLint + Prettier, Vitest, tsx                     | accepted                 |
| [0003](0003-postgres-and-drizzle.md)           | Postgres + Drizzle ORM                                                | accepted (Supabase)      |
| [0004](0004-blob-storage.md)                   | S3-compatible blob storage behind a small interface                   | accepted (Cloudflare R2) |
| [0005](0005-pinecone-dense-index.md)           | Pinecone dense document index with our own vectors                    | accepted                 |
| [0006](0006-pinecone-sparse-index.md)          | Separate Pinecone sparse index with hosted sparse model               | accepted                 |
| [0007](0007-hand-written-rrf-fusion.md)        | Hybrid fusion: hand-written weighted RRF                              | accepted                 |
| [0008](0008-pinecone-hosted-reranker.md)       | Pinecone-hosted reranker, cached                                      | accepted                 |
| [0009](0009-openai-embeddings-direct-rest.md)  | OpenAI embeddings via direct REST                                     | accepted                 |
| [0010](0010-generation-vercel-ai-sdk.md)       | Generation via Vercel AI SDK (Phase 3)                                | accepted                 |
| [0011](0011-eve-for-agentic-retrieval-only.md) | eve only for Phase 5 agentic retrieval                                | accepted                 |
| [0012](0012-promptfoo-for-ci-regression.md)    | promptfoo for CI regression evals                                     | accepted                 |
| [0013](0013-zod-validation.md)                 | Zod at every boundary                                                 | accepted                 |
| [0014](0014-no-rag-frameworks.md)              | No RAG frameworks (LangChain, LlamaIndex)                             | accepted                 |
| [0015](0015-ingestion-vs-query-knobs.md)       | Ingestion-time vs query-time knobs                                    | accepted                 |
| [0016](0016-index-config-first-class.md)       | Index config is a first-class immutable object with its own namespace | accepted                 |
| [0017](0017-immutable-run-snapshots.md)        | Runs are immutable snapshots                                          | accepted                 |
| [0018](0018-span-based-relevance-labels.md)    | Relevance labels are source spans                                     | accepted (τ open: Q6)    |
| [0019](0019-retrieval-metric-definitions.md)   | Retrieval metric definitions                                          | accepted                 |
| [0020](0020-document-normalization.md)         | Normalize every input to markdown with stable offsets                 | accepted                 |
| [0021](0021-guest-sessions-signed-cookie.md)   | Guest sessions via HMAC-signed cookie                                 | accepted                 |
| [0022](0022-cost-guardrails.md)                | Cost guardrails: caps, Postgres rate limits, caches, TTL cleanup      | accepted                 |
| [0023](0023-resumable-ingestion-jobs.md)       | Ingestion as resumable Postgres-backed jobs                           | accepted                 |
