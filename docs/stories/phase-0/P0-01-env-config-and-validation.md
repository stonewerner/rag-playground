# P0-01: Typed, validated environment config

**Phase:** 0 | **Status:** done | **Depends on:** — | **Size:** S

## Why

Every later story reads secrets and tunables (Pinecone, OpenAI, DB, caps). One validated module
stops misconfiguration from surfacing as a confusing vendor error mid-pipeline, and is the first
place Zod earns its place (ADR 0013).

## User story

As a developer, I want the app to fail fast with a clear message when an env var is missing or
malformed, so that misconfiguration never reaches a vendor call.

## Scope

- Add `zod` as a dependency.
- `src/lib/env.ts`: Zod schema for every variable in `.env.example`; parsed once, exported as a
  typed `env` object; server-only (import `server-only` guard or equivalent).
- Separate optional groups so scripts can load a subset (e.g. EDGAR scripts need only
  `SEC_USER_AGENT`): export `loadEnv(subset)` or per-group parsers.
- Cap overrides parsed as integers with defaults left to `src/lib/caps.ts` (P0-10).

## Out of scope

- Using any of the values (later stories).
- Secret management in Vercel (P0-06).

## Acceptance criteria

- [x] `src/lib/env.ts` validates all variables in `.env.example`; error message lists every invalid
      or missing key at once. (Schema and loader live in the headless `src/lib/env-schema.ts`;
      `env.ts` is the server-only app entry point. See Implementation notes.)
- [x] Importing `env` from a client component fails the build (server-only guard). Verified with a
      throwaway client component: `next build` fails with "'server-only' cannot be imported from a
      Client Component module". A unit test keeps the guard as the first import.
- [x] Unit tests cover: valid env passes, missing required key fails, malformed URL fails, subset
      loading works without unrelated keys.
- [x] `.env.example` and `env.ts` agree (a test asserts every key in `.env.example` is in the schema).
      The test checks both directions, and that commented-out keys are exactly the optional ones.
- [x] `docs/decisions/0013-zod-validation.md` unchanged or updated if the approach differs.
      (Unchanged: the approach matches.)
- [x] `pnpm check` passes.

## Technical notes

- Next.js 16 env handling: read `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`.
- Never expose server vars via `NEXT_PUBLIC_`.
- `SESSION_COOKIE_SECRET` must decode to ≥ 32 bytes.

### Implementation notes (2026-11-08)

- **Two modules.** `src/lib/env-schema.ts` is headless (no Next.js, no `server-only`): the group
  schemas, `loadEnv(groups, source = process.env)`, `EnvValidationError`, and the `EnvFor<G>` /
  `AppEnv` types. `src/lib/env.ts` starts with `import "server-only"` and exports `env`, which holds
  the `APP_ENV_GROUPS`. The split is needed because `server-only` is resolved by the Next compiler
  only. Outside Next (tsx scripts, Vitest, drizzle-kit config) it cannot be imported.
- **Groups:** `db`, `dbDirect`, `blob`, `pinecone`, `openai`, `session`, `cron`, `sec`, `caps`.
  The app's `env` covers all except `dbDirect` (migrations and scripts) and `sec` (EDGAR scripts),
  so Vercel does not need script-only variables. Scripts call `loadEnv(["sec"])` and so on.
- **Lazy validation.** `env` is a Proxy that validates every app key on first property access, not
  at import, so `next build` works without secrets (CI, P0-02). Verified: a route handler that
  imports `env` and calls `await connection()` before reading it builds with no env set. A `GET`
  handler that reads `env` without a dynamic API is prerendered at build and therefore fails the
  build when secrets are missing. Later stories should read `env` only in dynamic code
  (`await connection()`, `cookies()`, request-time handlers).
- **Rules:** values are trimmed and blanks count as missing. Uncommented `.env.example` keys are
  required. The commented-out `CAP_*` keys are optional non-negative integers (0 = off switch;
  defaults stay in `src/lib/caps.ts`, P0-10). URLs must parse with the right protocol and a host.
  `SESSION_COOKIE_SECRET` must be padded standard base64 that decodes to ≥ 32 bytes (decode with
  `atob`, as `openssl rand -base64 32` prints). `CRON_SECRET` must be ≥ 32 characters.
  `SEC_USER_AGENT` must contain a contact email and not the `example.com` placeholder.
  `GUEST_SESSION_TTL_HOURS` must be a positive integer. Error messages never include values.
- **Demo tooling:** `pnpm env:check [group ...]` (`scripts/check-env.ts`) loads `.env.local`, then
  `.env` (shell variables win, as in Next.js) and prints every problem. This added `tsx` (already
  decided in ADR 0002 and listed for P0-03) a story early. pnpm's build-script policy needed
  `esbuild: false` in `pnpm-workspace.yaml`; tsx runs fine without esbuild's postinstall.
- **Demo run:** no `.env.local` exists yet, so the demo ran with a full valid env exported in the
  shell and `OPENAI_API_KEY=` blank. It printed `OPENAI_API_KEY: missing` and exited 1.
  `pnpm env:check sec` passes with only `SEC_USER_AGENT` set.

## Test and eval plan

Vitest unit tests with injected `process.env`-like objects (don't mutate global env).

## Demo

Remove `OPENAI_API_KEY` from `.env.local`, run a script or route that imports `env`, and show the
clear validation error.
