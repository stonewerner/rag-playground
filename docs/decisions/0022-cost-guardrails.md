# ADR 0022: Cost guardrails — caps, Postgres rate limits, caches, TTL cleanup

**Status:** accepted · **Date:** 2026-11-07 · **Defaults confirmed:** 2026-11-08 (Q7, Q8)

## Context

A public demo calls paid APIs. The scarcest resources are Pinecone rerank requests (500/month on
Starter), namespaces (100 per index on Starter), and embedding quota.

## Decision

- **Caps** defined once in `src/lib/caps.ts` (defaults, env overrides): upload size, documents per
  session, configs per guest corpus, embedded tokens per session, queries per minute and per day,
  reranks per session per day, global reranks per day, global guest namespaces, new sessions per
  IP-hash per hour. Values in `docs/architecture.md` §15.
- **Rate limits** with fixed-window counters in Postgres (`rate_limit_buckets`, one atomic upsert).
  IPs are stored only as salted hashes.
- **Usage accounting:** every spending call records usage on the session and the run.
- **Caches:** query embeddings and rerank responses (`inference_cache`). Only misses count.
- **Shared corpus presets** absorb most demo traffic; guests cannot create configs on it.
- **TTL cleanup:** daily cron deletes sessions idle past the TTL: namespaces, then blobs, then rows.
- When a cap is hit, the API returns 429 with the cap name, and the UI explains it.

## Alternatives considered

- **Upstash Redis rate limiting:** another vendor for something Postgres does at this scale.
- **Vercel Firewall rules alone:** coarse, IP-based only, no per-session usage.

## Consequences

Every spending route must call the guard helpers; reviews check for it (CLAUDE.md rule 7).
