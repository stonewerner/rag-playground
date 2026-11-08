# ADR 0018: Relevance labels are source spans, not chunk IDs

**Status:** accepted (τ open: open-questions Q6) · **Date:** 2026-11-07

## Context

Chunks differ per index config. A label on a chunk ID is meaningless for any other config, which
would make cross-config metrics invalid. This is the most important design decision for Phase 2.

## Decision

- A **gold span** is `(document_id, start_char, end_char, grade)` in the document's normalized text
  (ADR 0020 defines offsets). Phase 1 already stores each chunk's offsets.
- A chunk c is relevant to gold span g when `cov(c, g) = |c ∩ g| / |g| ≥ τ`, default **τ = 0.5**.
- Curated spans are minimal evidence (a sentence, a table row with header, a short passage).
- UI labeling stores the highlighted evidence inside a chunk, or the whole chunk span with
  `is_coarse = true`. Marking "not relevant" stores a `grade = 0` span (judged).
- Curated gold sets are committed fixtures with span text and document content hash; a test proves
  every span still slices to its stored text.
- Guest labels on the shared corpus are session-scoped and never modify the curated set.

## Alternatives considered

- **Chunk-ID labels:** invalid across configs.
- **Question-level labels with answer strings (string match):** brittle for paraphrased evidence
  and numbers formatted differently.
- **Any-overlap rule:** lets a chunk that touches one character of the evidence count as relevant.

## Consequences

Coverage favors larger chunks (they cover more spans); the benchmark states this bias and reports
τ sensitivity (any, 0.5, 1.0). Metric definitions: ADR 0019.
