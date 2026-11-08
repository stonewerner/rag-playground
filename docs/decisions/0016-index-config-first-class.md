# ADR 0016: Index config is a first-class immutable object with its own namespace

**Status:** accepted · **Date:** 2026-11-07

## Context

Comparing chunking strategies requires the same documents stored several ways at once. The brief
specifies a namespace per (session, index config).

## Decision

- An **index config** row holds canonical `IndexConfigParams`, their hash, a status, and a unique
  `namespace = cfg-<uuid>`. Params never change after creation.
- An index config belongs to exactly one **corpus**; a corpus belongs to a session or is shared.
  So a guest config's namespace is per session by construction, and the shared EDGAR corpus has
  preset configs (`is_preset`) created by the seed script. Guests cannot add configs to the shared
  corpus.
- `unique(corpus_id, params_hash)` prevents duplicate configs. `chunkerVersion` is part of the hash
  so a chunker code change cannot silently mix chunk generations.
- Deleting a config deletes its namespaces (dense and sparse), chunks, and jobs; runs keep their
  snapshot (`index_config_id` set null).

## Alternatives considered

- **Namespace per session with config as metadata filter:** filters on every query, harder cleanup,
  and namespace-level stats lose meaning.
- **Global configs shared across sessions (dedupe by hash):** saves embedding cost but couples
  guests' data lifetimes.

## Consequences

Namespace count is the scaling limit (100 per index on Starter); guarded by caps (ADR 0022).
