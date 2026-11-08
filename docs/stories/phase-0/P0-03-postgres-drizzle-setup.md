# P0-03: Postgres connection and Drizzle setup

**Phase:** 0 | **Status:** todo | **Depends on:** P0-01 | **Size:** M

## Why

Runs, chunks with offsets, and gold spans are the backbone of every metric. We need a typed,
migration-managed database before any schema work.

## User story

As a developer, I want a typed DB client and a migration workflow, so that schema changes are
reviewable and reproducible.

## Scope

- Provision a Supabase project (decided in Q1); region near Vercel functions and Pinecone
  (`us-east-1`). Use it as plain Postgres only.
- Dependencies: `drizzle-orm`, `postgres`; dev: `drizzle-kit`, `tsx` (ADR 0002).
- `src/db/client.ts`: singleton client for serverless (reuse across invocations; `prepare: false`
  for transaction pooling).
- `drizzle.config.ts` using `DATABASE_URL_DIRECT`; schema file `src/db/schema.ts` with the `app`
  schema declared (`pgSchema("app")`) and no tables yet (tables land in P0-04).
- Scripts: `db:generate`, `db:migrate`, `db:studio`. Update CLAUDE.md commands table.
- `GET /api/health` returning `{ db: "ok" | "error", latencyMs }` via `select 1`.

## Out of scope

- Tables (P0-04). Deploy (P0-06).

## Acceptance criteria

- [ ] `pnpm db:migrate` runs cleanly against an empty database and creates schema `app`.
- [ ] `/api/health` returns `db: "ok"` locally with a real database.
- [ ] The client does not open a new pool per request (verified by reading the code path; comment
      explains the serverless reuse pattern).
- [ ] Schema `app` is not exposed by the Supabase Data API (note in the story), and the Supabase
      advisors have been run once with findings addressed or noted.
- [ ] Connection strings for pooler (6543) and direct/session (5432) documented in `.env.example`
      comments match what Supabase shows today.
- [ ] `pnpm check` passes.

## Technical notes

- Drizzle + Supabase: https://orm.drizzle.team/docs/connect-supabase
- Supabase connection strings and poolers: https://supabase.com/docs/guides/database/connecting-to-postgres
- Supabase Data API exposed schemas: https://supabase.com/docs/guides/api/using-custom-schemas
- Agents may use the Supabase MCP connector to inspect, but schema changes go through Drizzle
  migrations only.

## Test and eval plan

Health route test with a mocked client; manual check against the real DB.

## Demo

`pnpm db:migrate`, then `curl localhost:3000/api/health`.
