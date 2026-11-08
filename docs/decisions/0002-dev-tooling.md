# ADR 0002: Dev tooling — pnpm, ESLint + Prettier, Vitest, tsx

**Status:** accepted · **Date:** 2026-11-07

## Context

Every story ends with tests passing and a clean lint. Agents need one command that says "done".

## Decision

- **pnpm** (fast, strict dependency graph).
- **ESLint** with `eslint-config-next` (core-web-vitals + typescript) for correctness rules, and
  **Prettier** for formatting, joined by `eslint-config-prettier` so they never conflict.
- **Vitest** for unit tests (fast, native ESM/TS, no Babel). Tests live next to code as `*.test.ts`.
- **tsx** (added when the first script lands, P0-03) to run TypeScript scripts with path aliases.
- `pnpm check` = lint + typecheck + format check + tests. It is the gate for every story and CI.

## Alternatives considered

- **Biome** (lint + format in one tool): fewer packages, but loses Next.js-specific lint rules and
  is less familiar to reviewers. Revisit if ESLint becomes slow.
- **Jest:** slower, needs transform config for ESM/TS.
- **Node's built-in `--experimental-strip-types`** instead of tsx: no tsconfig path alias support.

## Consequences

Four dev dependencies plus tsx later. End-to-end browser tests are parked (Playwright); Phase 1
uses a scripted API smoke test.
