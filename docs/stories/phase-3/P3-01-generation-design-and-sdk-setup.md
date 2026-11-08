# P3-01: Generation design and AI SDK setup

**Phase:** 3 | **Status:** todo | **Depends on:** P2-18 | **Size:** S

## Why

Generation exists to measure answer quality per retrieval config. Fixing the model, prompt format,
citation syntax, and abstain contract up front keeps answers comparable across runs.

## User story

As a developer, I want the generator model, prompt, citation format, and abstain contract decided
and wired, so that generation stories build on a stable contract.

## Scope

- Resolve open question Q12: generator model and a different judge model, with current prices.
- Add `ai` (AI SDK 7) and one provider package; record versions in ADR 0010.
- Prompt v1 in `src/pipeline/generation/prompts/answer-v1.md`: numbered context blocks
  (`[1] (KO-FY2025 › Item 7 › Liquidity) …`), instructions to cite with `[n]` after each claim,
  to use only the context, and to abstain with an exact marker (e.g. `INSUFFICIENT_CONTEXT`) when
  the context does not support an answer.
- `promptVersion` = sha256 of the template; stored on every generation.
- Generation config added to `QueryConfig`: `generation: { enabled, model, promptVersion,
maxContextChunks, maxOutputTokens } | null`.

## Out of scope

- Implementation of streaming, parsing, judging (later stories).

## Acceptance criteria

- [ ] ADR 0010 updated (models, SDK version, provider); Q12 resolved.
- [ ] Prompt template committed with a worked example in its header.
- [ ] A smoke script streams one answer for a fixed context and prints usage.
- [ ] `pnpm check` passes.

## Technical notes

- https://vercel.com/blog/ai-sdk-7 · https://ai-sdk.dev/docs — verify `streamText`, usage fields,
  and structured-output APIs for v7 before coding.
- Check model pricing pages and add entries to `src/lib/pricing.ts`.

## Test and eval plan

Smoke script only; unit tests come with P3-02.

## Demo

Smoke script streaming a cited answer to the terminal.
