# P0-02: CI pipeline on GitHub Actions

**Phase:** 0 | **Status:** todo | **Depends on:** P0-01 | **Size:** S

## Why

"Every story ends with tests passing" only holds if a machine checks it. CI is also where the
Phase 4 eval regression guard will run.

## User story

As a developer, I want every push and PR checked by lint, typecheck, format, tests, and build, so
that broken work cannot merge.

## Scope

- `.github/workflows/ci.yml`: on push to `main` and on PRs; Node 22 from `.nvmrc`; pnpm with cache;
  `pnpm install --frozen-lockfile`; `pnpm check`; `pnpm build`.
- Build must succeed without real secrets: provide dummy env values in CI or make build-time env
  validation lenient (decide and document in the workflow comments).
- README badge.

## Out of scope

- Deploys (Vercel Git integration handles them, P0-06).
- Eval runs in CI (P4-02).

## Acceptance criteria

- [ ] Workflow runs on PRs and on `main`, and passes on the current tree.
- [ ] A deliberately failing test on a branch makes CI fail (verified once, then reverted).
- [ ] No secrets are required for CI to pass.
- [ ] README shows the CI status badge.
- [ ] `pnpm check` passes locally.

## Technical notes

- Repo: `git@github.com:stonewerner/rag-playground.git` (Q10). Nothing is pushed yet; the first
  push to `main` needs Stone's go-ahead. GitHub reported the repo as public on 2026-11-08.
- Use `pnpm/action-setup` and `actions/setup-node` with `cache: pnpm`; pin action major versions.

## Test and eval plan

The workflow itself is the test; verify with one red and one green run.

## Demo

Open the Actions tab and show a green run for the latest commit.
