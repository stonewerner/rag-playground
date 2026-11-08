# ADR 0003: Postgres + Drizzle ORM

**Status:** accepted · **Date:** 2026-11-07 · **Provider decided:** 2026-11-08 (Supabase, Q1)

## Context

We store sessions, documents with normalized text, index configs, chunks with offsets, immutable
runs with every candidate, and gold labels. The data is relational (cascade deletes on TTL), and
metric computation needs joins over spans.

## Decision

Postgres, accessed through **Drizzle ORM** with `drizzle-kit` migrations committed in `drizzle/`.
All tables live in schema `app`. The runtime connects through a pooled URL (`DATABASE_URL`, with
prepared statements disabled for transaction pooling); migrations and scripts use a direct URL
(`DATABASE_URL_DIRECT`). Drizzle migrations are the only source of schema truth (no dashboard
edits). Driver: `postgres` (postgres.js) unless the chosen provider requires otherwise.

**Provider: Supabase**, used as plain Postgres (no Supabase Auth, Storage, or RLS policies). Agents
may use the Supabase MCP connector to inspect tables and advisors; schema changes still go through
Drizzle migrations only. Neon is the fallback (see open questions Q1).

## Alternatives considered

- **Prisma:** heavier client and generation step; less SQL-transparent.
- **Raw SQL only:** fine for queries, but typed schema and migrations are worth one dependency.
- **Store vectors in Postgres (pgvector):** would remove Pinecone, but the project is about
  measuring retrieval on a production vector DB with hosted sparse and rerank models.

## Consequences

- Dependencies: `drizzle-orm`, `postgres`, dev `drizzle-kit`.
- If Supabase: its auto-generated Data API must not expose our tables (schema `app`); the free tier
  pauses inactive projects (mitigated by the daily cron).
