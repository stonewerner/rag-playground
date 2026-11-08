# ADR 0021: Guest sessions via HMAC-signed cookie

**Status:** accepted · **Date:** 2026-11-07

## Context

Visitors must try the app without signing up, and their data must be isolated and deletable.

## Decision

- Cookie `rp_session = <uuid>.<issuedAtEpochSec>.<base64url HMAC-SHA256>` signed with
  `SESSION_COOKIE_SECRET`, using Web Crypto (no dependency). HttpOnly, Secure (in production),
  SameSite=Lax, Path=/.
- `proxy.ts` verifies the cookie and issues a fresh one if missing or invalid. It does not touch
  the DB.
- Server code calls `requireSession()`, which verifies the cookie and lazily inserts or touches the
  `sessions` row (`last_seen_at`, `expires_at`). Rows are created only on stateful actions, so
  crawlers and one-off page views create nothing.
- If the row was deleted by TTL cleanup, a new row is created under the same ID (data is gone).
- Secret rotation: verify against current and previous secrets.

## Alternatives considered

- **iron-session / jose:** fine libraries, but signing one ID is ~40 lines with Web Crypto.
- **Auth providers:** out of scope (no real accounts).

## Consequences

Sessions are bearer tokens: anyone with the cookie is that guest. Acceptable for anonymous demo data.
