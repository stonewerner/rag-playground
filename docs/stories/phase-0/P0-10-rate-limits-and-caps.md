# P0-10: Rate limits and per-session caps

**Phase:** 0 | **Status:** todo | **Depends on:** P0-04, P0-05 | **Size:** M

## Why

"Guard the bill" is not optional for a public demo. Caps must exist before any route spends money.

## User story

As the owner, I want every spending action checked against per-session and global limits, so that
no visitor can run up costs or exhaust shared quotas.

## Scope

- `src/lib/caps.ts`: cap definitions with defaults from `docs/architecture.md` §15 and env
  overrides (`CAP_*`).
- `src/lib/ratelimit.ts`: `hit(key, windowSec, limit)` using one atomic
  `INSERT … ON CONFLICT (key, window_start) DO UPDATE SET count = count + 1 RETURNING count`;
  returns `{ allowed, remaining, resetAt }`.
- Guard helpers: `assertQueryAllowed(session)`, `assertRerankAllowed(session)` (per-session daily +
  global daily), `assertUploadAllowed(session, bytes)`, `assertConfigAllowed(session)` (per-corpus
  count + global namespace count), `assertEmbedBudget(session, estimatedTokens)`,
  `assertNewSessionAllowed(ipHash)`.
- `CapExceededError` → HTTP 429 JSON `{ error: "cap_exceeded", cap, limit, resetAt }` via a shared
  route-handler wrapper.
- Usage recording helpers that increment `sessions.embed_tokens_used` and
  `sessions.rerank_requests_used`.

## Out of scope

- Wiring into specific routes (each spending story does that). Inference caches (P1-15).

## Acceptance criteria

- [ ] Concurrent `hit()` calls never exceed the limit (integration test with parallel calls).
- [ ] Each guard has unit tests for allow and deny paths.
- [ ] 429 response shape documented and tested.
- [ ] Open questions Q8 values confirmed or adjusted in `caps.ts` and `docs/architecture.md`.
- [ ] `pnpm check` passes.

## Technical notes

- Window start = `floor(now / window) * window`. Prune old buckets in the cleanup cron (P0-11).
- Global counters use keys like `global:rerank:day`.

## Test and eval plan

Integration tests against the test DB; unit tests for guard logic with a fake limiter.

## Demo

A script fires 25 query-guard calls in a minute for one session and shows the 21st denied with
`resetAt`.
