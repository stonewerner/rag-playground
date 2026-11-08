# CLAUDE.md — RAG Playground

Read this first. It is the contract for every session (human or agent) working in this repo.

@AGENTS.md

## Why this project exists

Stone is a full-stack engineer (~3 years) moving into applied AI engineering ("Software Engineer,
Applied AI" roles: RAG pipelines, retrieval systems, LLM workflows, eval harnesses). He already has
real RAG and agent experience. This project closes three specific gaps with one deep, deployed,
defensible artifact:

1. **Evaluation discipline**: gold sets, retrieval metrics, LLM-as-judge, regression testing.
2. **Retrieval depth**: hybrid search, reranking, embedding tradeoffs, measured rather than assumed.
3. **LLM observability**: per-stage latency, tokens, cost.

The headline outcome is a real, reproducible, explainable number: _"hybrid search with hand-built
RRF fusion plus reranking improved nDCG@10 from X to Y over dense-only on a labeled SEC-filing
benchmark."_ It comes from Phase 2. Judge every decision by: **does this make the retrieval/eval
story deeper and more defensible?**

## What we are building

A web app that is a **RAG playground and retrieval evaluation lab**. Guests get an anonymous session
(signed cookie), pick the preloaded SEC EDGAR 10-K corpus or upload md/txt/html, index documents
under one or more **index configs**, run queries while turning **query knobs**, and see ranked
chunks with scores, rank movement, and per-stage latency. Runs are persisted and replayable.
Labels become a gold set; the app computes recall@k, MRR, and nDCG@k and compares configs side by
side. Phase 3 adds streamed, cited generation scored by an LLM judge. Finance is the demo dataset,
not the product.

## Guiding principles (enforced in every story and review)

1. **Depth over breadth.** One use case, done rigorously.
2. **Measure, don't eyeball.** Retrieval changes are expressed as metric deltas on the gold set.
3. **Build the core by hand.** Vendors provide embeddings, vector storage, and rerank models. We
   write the chunkers, RRF fusion, metric computations, and pipeline orchestration.
4. **Avoid redundant tooling.** No LangChain or LlamaIndex. Every dependency earns its place in an
   ADR (`docs/decisions/`).
5. **Ship thin vertical slices.** Each phase ends deployed and demoable.
6. **Guard the bill.** Public demo: caps, rate limits, caching, and TTL cleanup are not optional.
7. **Scope creep is the main risk.** When in doubt, add it to `docs/parking-lot.md`, not a story.

## Stack (decided; see ADRs)

| Concern           | Choice                                                        | ADR  |
| ----------------- | ------------------------------------------------------------- | ---- |
| App               | Next.js 16 App Router + TypeScript on Vercel, pnpm            | 0001 |
| Tooling           | ESLint + Prettier, Vitest, tsx for scripts                    | 0002 |
| DB                | Postgres + Drizzle ORM (provider open; Supabase recommended)  | 0003 |
| Blob              | S3-compatible behind a small interface (provider open)        | 0004 |
| Dense vectors     | Pinecone document index, our OpenAI vectors (`dense_vector`)  | 0005 |
| Sparse vectors    | Separate Pinecone document index, `sparse_embed` hosted model | 0006 |
| Fusion            | Weighted Reciprocal Rank Fusion, **written by us**            | 0007 |
| Rerank            | Pinecone hosted reranker (`bge-reranker-v2-m3`), cached       | 0008 |
| Embeddings        | OpenAI embeddings via direct REST (`fetch`), no SDK           | 0009 |
| Generation (P3)   | Vercel AI SDK, streamed, plain LLM call                       | 0010 |
| Agentic (P5 only) | eve (Vercel agent framework). Not used before Phase 5         | 0011 |
| CI evals (P4)     | promptfoo over headless pipeline functions                    | 0012 |
| Validation        | Zod at every boundary                                         | 0013 |
| Frameworks        | None for RAG. No LangChain/LlamaIndex                         | 0014 |

Pinecone uses the **Documents API (2026-07)**, not the legacy Vectors/Records APIs. Next.js 16
differs from older versions (e.g. `middleware.ts` is now `proxy.ts`, Cache Components is on): read
the bundled docs in `node_modules/next/dist/docs/` before writing Next.js code.

## Core architecture (details in `docs/architecture.md`)

- **Two kinds of knobs.** Ingestion-time knobs (chunker, size, overlap, embedding model/dims,
  contextual headers) change what is stored and require re-chunking and re-embedding. Query-time
  knobs (top-k, mode, alpha, rerank on/off, rerank depth, threshold) run instantly against what is
  indexed. **Never re-embed in response to a query-time knob.** (ADR 0015)
- **Index config is first-class and immutable.** An index config belongs to one corpus and owns one
  Pinecone namespace (`cfg-<uuid>`) in the dense index and, from Phase 2, the sparse index.
  Changing an ingestion knob means a new config. (ADR 0016)
- **Runs are immutable snapshots**: full index config, full query config, query text, every
  candidate with dense/sparse/fused/rerank scores and ranks, per-stage latencies, token counts,
  estimated cost. Replay re-executes the snapshot as a new linked run. (ADR 0017)
- **Relevance labels are source spans, not chunk IDs**: `(document_id, start_char, end_char)` in
  normalized text. A chunk is relevant if it covers ≥ τ of a gold span (τ = 0.5 by default). This
  is what makes cross-config metrics valid. (ADR 0018, metrics in ADR 0019)
- **One normalization path.** Every input becomes NFC markdown with `\n` newlines before chunking.
  Offsets are JS string indices (UTF-16 code units) into that text. Documents are immutable. (ADR 0020)
- **Guest sessions and guardrails.** HMAC-signed cookie, lazy session rows, per-session caps,
  Postgres-backed rate limits, inference caches, daily TTL cleanup of rows, blobs, and namespaces.
  (ADRs 0021, 0022)
- **Ingestion is a resumable Postgres-backed job** processed in bounded batches. (ADR 0023)

## Repo map

```
CLAUDE.md                 this file
AGENTS.md                 Next.js-generated agent rules (imported above)
docs/prd.md               product requirements
docs/architecture.md      data model, pipelines, Pinecone layout, diagrams
docs/decisions/           ADRs (NNNN-title.md); index in docs/decisions/README.md
docs/glossary.md          terms (index config, gold span, RRF, nDCG, ...)
docs/open-questions.md    unresolved decisions with recommendations
docs/parking-lot.md       out-of-scope ideas (not stories)
docs/stories/README.md    backlog index in execution order (source of truth for status)
docs/stories/phase-N/     EPIC.md + one file per story (P{N}-{nn}-{kebab-title}.md)
docs/benchmark/           committed benchmark results (from Phase 2)
src/app/                  Next.js routes (UI + route handlers)
src/lib/                  infrastructure: env, db, session, pinecone, blob, ratelimit, log, pricing
src/db/                   Drizzle schema; migrations live in drizzle/
src/pipeline/             the hand-built core: normalize/, chunking/, embedding/, retrieval/,
                          ingest/, query/, eval/, generation/ (P3)
scripts/                  CLI scripts (Pinecone setup, EDGAR fetch/build, corpus seed, gold, bench)
fixtures/edgar/           normalized 10-K markdown + manifest.json (committed)
fixtures/gold/            curated gold sets (committed, versioned)
```

Keep `src/pipeline/` free of Next.js imports so it runs headless (scripts, tests, promptfoo).

## Workflow rules for agents

1. **Before coding**, read the assigned story file, every story it depends on, and the ADRs and
   architecture sections it references. If a dependency is not `done`, stop and say so.
2. **One story at a time.** When starting: set the story's `Status` to `in-progress` and update the
   row in `docs/stories/README.md`. When finishing: check off each acceptance criterion in the
   story file, set `Status: done`, update the backlog row, and update the phase `EPIC.md` if needed.
3. **Definition of done:** all acceptance criteria checked, `pnpm check` passes (lint, typecheck,
   format, tests), new logic has unit tests, and the story's Demo section works. If a criterion
   cannot be met, leave it unchecked, set `Status: blocked` or `review`, and write why in the story.
4. **New dependency or architectural change → ADR** in `docs/decisions/` (next number, short:
   context, decision, alternatives, consequences) and a row in `docs/decisions/README.md`.
5. **Out-of-scope ideas go to `docs/parking-lot.md`**, not into code, not into the current story.
6. **Verify external API details against current docs** (Pinecone, OpenAI, Vercel, SEC) before
   relying on model names, limits, or endpoint shapes. Cite the link in the story's Technical notes.
   Model names and prices change; code reads them from config, never scattered literals.
7. **Guardrails are part of every user-facing feature**: any route that spends money (embedding,
   rerank, generation, Pinecone writes) must check caps and rate limits and record usage.
8. **Metrics code is load-bearing.** Changes to `src/pipeline/eval/` require hand-computed test
   vectors, and benchmark numbers in docs must be regenerated, not edited by hand.
9. Commit per story with a message referencing the story ID (e.g. `P1-06: fixed-token chunker`).
   Don't push or deploy unless asked.
10. When a decision is ambiguous and expensive to reverse, stop and ask Stone.

## Commands

| Command          | What it does                                       |
| ---------------- | -------------------------------------------------- |
| `pnpm dev`       | Next.js dev server on http://localhost:3000        |
| `pnpm build`     | Production build                                   |
| `pnpm check`     | lint + typecheck + format check + tests (the gate) |
| `pnpm lint`      | ESLint                                             |
| `pnpm typecheck` | `tsc --noEmit`                                     |
| `pnpm format`    | Prettier write                                     |
| `pnpm test`      | Vitest (single run); `pnpm test:watch` to watch    |

Planned (stories add these; update this table when they land): `pnpm db:generate`,
`pnpm db:migrate` (P0-03), `pnpm pinecone:setup` (P0-09), `pnpm edgar:fetch` (P1-03),
`pnpm edgar:build` (P1-04), `pnpm corpus:seed` (P1-13), `pnpm gold:validate`, `pnpm gold:locate`
(P2-07, P2-08), `pnpm bench` (P2-17).

Environment: copy `.env.example` to `.env.local`. Node 22+ (`.nvmrc`), pnpm.
