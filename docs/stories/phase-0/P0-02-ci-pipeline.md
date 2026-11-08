# P0-02: CI pipeline on GitHub Actions

**Phase:** 0 | **Status:** review | **Depends on:** P0-01 | **Size:** S

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

- [ ] Workflow runs on PRs and on `main`, and passes on the current tree. **Not verified:** needs a
      real GitHub Actions run, and the workflow is not pushed. See "Remaining after the next push".
- [ ] A deliberately failing test on a branch makes CI fail (verified once, then reverted). **Not
      verified:** same reason.
- [x] No secrets are required for CI to pass. The workflow references none. Install, `pnpm check`,
      and `pnpm build` passed from a clean copy of the tree with only `PATH`, `HOME`, and `CI` set.
- [x] README shows the CI status badge. (The markup is committed. It shows no status until the
      first run exists.)
- [x] `pnpm check` passes locally.

## Technical notes

- Repo: `git@github.com:stonewerner/rag-playground.git` (Q10). `origin/main` is at `9aa6d4b`
  (pushed 2026-11-08 01:04 ET), which predates P0-01 and this story, so the workflow is not on
  GitHub yet. The next push to `main` needs Stone's go-ahead. GitHub reports the repo as public
  (checked 2026-11-08).
- Use `pnpm/action-setup` and `actions/setup-node` with `cache: pnpm`; pin action major versions.

### Implementation notes (2026-11-08)

- **Action versions**, checked against the latest releases on 2026-11-08:
  [`actions/checkout@v7`](https://github.com/actions/checkout/releases/tag/v7.0.1),
  [`actions/setup-node@v7`](https://github.com/actions/setup-node/releases/tag/v7.1.0),
  [`pnpm/action-setup@v6`](https://github.com/pnpm/action-setup/releases/tag/v6.1.1) (its README
  confirms pnpm v12 support and that omitting `version` uses `packageManager`). Badge URL format:
  [GitHub docs](https://docs.github.com/en/actions/how-tos/monitor-workflows/add-a-status-badge).
- **Build env decision: an empty environment, with no dummy values and no lenient mode.** P0-01's
  `env` validates on first property access, so `next build` needs no secrets. Nothing in `src/app`
  imports it yet. Dummy values would hide a route that wrongly reads `env` during prerendering, and
  could end up in prerendered output. Negative test in a scratch copy: a `GET` route reading
  `env.OPENAI_EMBEDDING_MODEL` with no dynamic API fails `pnpm build` with `EnvValidationError`.
  The reasoning is also in the workflow comments.
- **Fix to `pnpm typecheck`: it is now `next typegen && tsc --noEmit`.** On a clean checkout `tsc`
  failed with `Cannot find name 'LayoutProps'`, because that global type is generated into
  `.next/types` (which is gitignored). It had passed locally only because of a previous build. This
  is the pattern documented in `node_modules/next/dist/docs/01-app/03-api-reference/06-cli/next.md`.
- **Local verification** used a clean copy of the tree to be committed, with no `.env*` besides
  `.env.example`, no generated types, no `.next`, and no `node_modules`:
  `pnpm install --frozen-lockfile`, `pnpm check` (37 tests), and `pnpm build` all exit 0, and the
  lockfile is unchanged. **Limits of that check:** it ran on macOS under Node 26.5.0, because Node
  22 is not installed on this machine, so the Node 22 and Linux paths are unverified until the
  first run. `pnpm-lock.yaml` does include the `linux-x64-gnu` binaries for the native packages.
  `actionlint` is not installed; the YAML was parsed with Ruby and Prettier, and the action inputs
  were compared by hand with each action's `action.yml`.

### Remaining after the next push

The workflow is committed locally only, because the next push is Stone's decision (see the repo
note above). After it:

1. Push to `main`. In the Actions tab, confirm a green `CI` run for that commit, and that the logs
   show Node 22.x and pnpm 12.14.0. This covers the `main` half of the first criterion and the
   Demo.
2. Open a PR from a branch that adds a deliberately failing test. Confirm `CI` runs on the PR and
   fails at `pnpm check`. This covers the second criterion.
3. Revert the failing test on that branch, confirm the run goes green (the PR half of the first
   criterion), then close the PR and delete the branch.
4. Confirm the README badge shows passing. If the repo is made private, the badge is not visible
   outside GitHub.
5. Check off the two criteria, then set `Status: done` here and in the backlog, and update the
   count in `EPIC.md`.

## Test and eval plan

The workflow itself is the test; verify with one red and one green run.

## Demo

Open the Actions tab and show a green run for the latest commit.
