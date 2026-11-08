# P0-05: Guest sessions via signed cookie

**Phase:** 0 | **Status:** todo | **Depends on:** P0-04 | **Size:** M

## Why

Visitors (interviewers) must use the app with zero friction, and every resource they create must be
attributable to a session so caps and TTL cleanup work.

## User story

As a visitor, I want to start using the app immediately without signing up, so that I can try it
in the first minute.

## Scope

- `src/lib/session/cookie.ts`: sign and verify `rp_session = <uuid>.<issuedAt>.<hmac>` with Web
  Crypto HMAC-SHA256; supports current + previous secret (rotation).
- `src/proxy.ts`: if cookie missing or invalid, set a fresh one; no DB access. Matcher excludes
  static assets.
- `src/lib/session/server.ts`: `getSessionId()` (verify only) and `requireSession()` (verify +
  lazily upsert the `sessions` row, update `last_seen_at`, `expires_at = now + TTL`).
- Store `ip_hash` (HMAC of IP with the cookie secret) on row creation.
- Show the short session ID in the page footer (debug aid).

## Out of scope

- Caps and rate limits (P0-10). Cleanup (P0-11).

## Acceptance criteria

- [ ] First visit sets an HttpOnly, SameSite=Lax cookie (Secure in production).
- [ ] Tampered cookie (any byte changed) is rejected and replaced.
- [ ] Page views alone create no `sessions` rows; the first `requireSession()` call creates one.
- [ ] A deleted session row is recreated under the same ID on the next stateful action.
- [ ] Secret rotation: a cookie signed with the previous secret still verifies.
- [ ] Unit tests for sign/verify (valid, tampered, wrong secret, malformed); integration test for
      lazy row creation.
- [ ] `pnpm check` passes.

## Technical notes

- Next.js 16 Proxy: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` and the
  file-convention reference. Proxy is for optimistic checks only; real checks happen server-side.
- Cookies API in route handlers/server actions: see bundled docs (`cookies()`), and note Cache
  Components implications for dynamic data.
- Constant-time comparison for signatures.

## Test and eval plan

Unit tests for cookie crypto; integration test for `requireSession()` against the test DB.

## Demo

Open the app in a private window, show the cookie in devtools and the session ID in the footer;
edit the cookie and reload to show it is replaced.
