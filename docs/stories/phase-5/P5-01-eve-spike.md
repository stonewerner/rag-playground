# P5-01: eve spike

**Phase:** 5 | **Status:** todo | **Depends on:** P4-01 | **Size:** S

## Why

eve is a preview framework (announced June 2026). A time-boxed spike confirms it fits before we
invest (ADR 0011).

## User story

As a developer, I want a minimal eve agent that calls our headless retrieval as a tool, so that we
know the framework works for this use case on our deployment.

## Scope

- Re-verify eve's current API, versioning, and Vercel runtime constraints.
- Minimal agent: `instructions.md`, one tool `search(query, configId)` wrapping `retrieve`, model
  from config; run locally and on a preview deploy.
- Record findings: effort, limits, cost, observability, and whether to proceed with eve or a
  hand-rolled AI SDK loop (update or supersede ADR 0011).

## Out of scope

- Iterative strategies (P5-02).

## Acceptance criteria

- [ ] Agent answers one gold question by calling the tool at least once, locally and on preview.
- [ ] Decision recorded in ADR 0011 (or a superseding ADR).
- [ ] Time box: 1 day.

## Technical notes

https://vercel.com/blog/introducing-eve · https://github.com/vercel/eve (install via
`npx eve@latest init` per launch coverage; verify).

## Test and eval plan

Manual; findings document.

## Demo

Agent trace for one question.
