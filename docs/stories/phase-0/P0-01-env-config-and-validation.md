# P0-01: Typed, validated environment config

**Phase:** 0 | **Status:** todo | **Depends on:** — | **Size:** S

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

- [ ] `src/lib/env.ts` validates all variables in `.env.example`; error message lists every invalid
      or missing key at once.
- [ ] Importing `env` from a client component fails the build (server-only guard).
- [ ] Unit tests cover: valid env passes, missing required key fails, malformed URL fails, subset
      loading works without unrelated keys.
- [ ] `.env.example` and `env.ts` agree (a test asserts every key in `.env.example` is in the schema).
- [ ] `docs/decisions/0013-zod-validation.md` unchanged or updated if the approach differs.
- [ ] `pnpm check` passes.

## Technical notes

- Next.js 16 env handling: read `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`.
- Never expose server vars via `NEXT_PUBLIC_`.
- `SESSION_COOKIE_SECRET` must decode to ≥ 32 bytes.

## Test and eval plan

Vitest unit tests with injected `process.env`-like objects (don't mutate global env).

## Demo

Remove `OPENAI_API_KEY` from `.env.local`, run a script or route that imports `env`, and show the
clear validation error.
