# Phase 0 — Foundations

**Status:** in-progress (1/11 done) · **Stories:** 11

## Goal

A deployed, empty app with the infrastructure every later phase relies on: validated config, a
typed database with the core schema, anonymous guest sessions, blob storage, Pinecone indexes,
rate limits and caps, stage timing, CI, deploys, and TTL cleanup.

## Exit criteria

Deployed empty app with a working guest session and DB: the production URL loads, `/status` shows a
session ID and `db: ok`, CI is green, and the cleanup cron is scheduled.

## Before starting

All Phase 0 questions are resolved (2026-11-08): Supabase Postgres (Q1), Cloudflare R2 (Q2), 72 h
guest TTL (Q7), default caps (Q8), existing GitHub remote + Vercel Hobby (Q10). Stone needs to
create the Supabase project, R2 bucket and token, and Vercel project, and confirm the first push.

## Stories

| ID                                              | Title                                  | Size | Depends on                 | Critical path |
| ----------------------------------------------- | -------------------------------------- | ---- | -------------------------- | ------------- |
| [P0-01](P0-01-env-config-and-validation.md)     | Typed, validated environment config    | S    | —                          | ★             |
| [P0-02](P0-02-ci-pipeline.md)                   | CI pipeline on GitHub Actions          | S    | P0-01                      |               |
| [P0-03](P0-03-postgres-drizzle-setup.md)        | Postgres connection and Drizzle setup  | M    | P0-01                      | ★             |
| [P0-04](P0-04-core-schema-v1.md)                | Core schema v1                         | M    | P0-03                      | ★             |
| [P0-05](P0-05-guest-session-cookie.md)          | Guest sessions via signed cookie       | M    | P0-04                      | ★             |
| [P0-06](P0-06-vercel-deploy-and-health-page.md) | Vercel deploy pipeline and status page | M    | P0-03, P0-05               | ★             |
| [P0-07](P0-07-stage-timing-and-logging.md)      | Stage timing and structured logging    | S    | —                          |               |
| [P0-08](P0-08-blob-storage-module.md)           | Blob storage module                    | S    | P0-01                      |               |
| [P0-09](P0-09-pinecone-indexes-and-client.md)   | Pinecone indexes and client wrapper    | M    | P0-01                      |               |
| [P0-10](P0-10-rate-limits-and-caps.md)          | Rate limits and per-session caps       | M    | P0-04, P0-05               |               |
| [P0-11](P0-11-guest-ttl-cleanup-cron.md)        | Guest TTL cleanup cron                 | M    | P0-04, P0-06, P0-08, P0-09 |               |

P0-07, P0-08, and P0-09 can run in parallel with the critical path.
