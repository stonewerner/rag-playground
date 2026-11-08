# ADR 0001: Next.js App Router + TypeScript on Vercel

**Status:** accepted · **Date:** 2026-11-07

## Context

We need one deployable app that serves an interactive UI, server-side API routes that call vendor
APIs with secrets, and scheduled jobs, deployed cheaply and in a way interviewers can click.

## Decision

Next.js 16 (App Router) with TypeScript (strict), deployed on Vercel (Hobby to start). Server work
runs in route handlers and server actions on the Node.js runtime. Guest cookies are issued in
`proxy.ts` (Next 16's replacement for `middleware.ts`). Background continuation uses `after()`.
Scheduled work uses Vercel Cron. Tailwind CSS (scaffold default) for styling; no component library
until a story needs one (parking lot). Package manager: pnpm. Node 22+.

Next.js 16 differs from older versions (Proxy, Cache Components enabled by default in the
scaffold). Agents read `node_modules/next/dist/docs/` before writing Next.js code (`AGENTS.md`).

## Alternatives considered

- **Separate API service (Hono/Fastify) + SPA:** two deployables for no benefit at this scale.
- **Python backend (FastAPI):** strong ML ecosystem, but the pipeline is API calls plus our own
  logic; one language keeps the headless pipeline shareable with UI, scripts, and promptfoo.

## Consequences

- Function duration limits apply to ingestion and batch eval; see ADR 0023 for bounded batches.
- Vendor SDKs must run on Node 22+ (Pinecone SDK v9 requires Node ≥ 22).
- `src/pipeline/` must not import Next.js so it stays usable outside the app.
