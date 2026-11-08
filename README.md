# RAG Playground

[![CI](https://github.com/stonewerner/rag-playground/actions/workflows/ci.yml/badge.svg)](https://github.com/stonewerner/rag-playground/actions/workflows/ci.yml)

A retrieval evaluation lab. Index documents under different chunking and embedding configs, turn
retrieval knobs (top-k, hybrid alpha, reranking, thresholds), and measure what changed with
recall@k, MRR, and nDCG@k against a labeled benchmark of SEC 10-K filings.

**Status:** Phase 0 (foundations). Nothing is deployed yet.

## Where things are

- `CLAUDE.md`: project rules and orientation for anyone (human or agent) working in this repo.
- `docs/prd.md`: what we are building and why.
- `docs/architecture.md`: how it works.
- `docs/stories/README.md`: the backlog, in execution order.

## Development

```bash
pnpm install
cp .env.example .env.local   # fill in values
pnpm dev                     # http://localhost:3000
pnpm check                   # lint, typecheck, format check, tests
```

Requires Node 22+ and pnpm.

## Benchmark

The benchmark table (dense-only vs. hybrid vs. hybrid + rerank, across chunking strategies) will
live here after Phase 2.
