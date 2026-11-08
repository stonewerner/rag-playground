# P0-06: Vercel deploy pipeline and status page

**Phase:** 0 | **Status:** todo | **Depends on:** P0-03, P0-05 | **Size:** M

## Why

"Ship thin vertical slices": Phase 0 is only done when the empty app is deployed with a working
session and DB. Every later phase demo depends on this pipeline.

## User story

As an interviewer, I want a live URL that works, so that I can see the project without cloning it.

## Scope

- Vercel project (Hobby) linked to `stonewerner/rag-playground` (Q10): preview deploys per PR,
  production on `main`. Stone creates the project and enters secrets; the agent supplies the list.
- Env vars set for Production and Preview (document which values differ; previews may share the
  dev database or use a separate one — decide and record).
- Node version pinned (22.x) and function region near the DB and Pinecone (`us-east-1` if
  Pinecone Starter; record in ADR 0001).
- Migration strategy: migrations run manually (`pnpm db:migrate` against production) before
  merging schema changes; documented in CLAUDE.md. No auto-migrate on build.
- `/status` page: shows build SHA, session ID (short), DB health, and environment name.
- Re-verify Vercel limits (function max duration on the chosen plan with Fluid compute, cron
  frequency limits) and record them in `docs/architecture.md` §17.

## Out of scope

- Custom domain. Cron (P0-11).

## Acceptance criteria

- [ ] Production URL loads the home page and `/status` shows `db: ok` and a session ID.
- [ ] A PR gets a preview URL that works.
- [ ] Vercel plan limits verified from current docs and recorded with links.
- [ ] CLAUDE.md documents the deploy and migration workflow.
- [ ] README has the live URL.
- [ ] `pnpm check` passes.

## Technical notes

- Vercel function limits: https://vercel.com/docs/functions/limitations
- Cron jobs: https://vercel.com/docs/cron-jobs
- Next.js deploy guide: `node_modules/next/dist/docs/01-app/01-getting-started/17-deploying.md`
- Vercel Hobby is for non-commercial use; a personal portfolio qualifies.

## Test and eval plan

Manual verification on preview and production; `/api/health` used as a smoke check.

## Demo

Open the production URL in a private window, then `/status`.
