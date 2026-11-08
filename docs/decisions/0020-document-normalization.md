# ADR 0020: Normalize every input to markdown with stable offsets

**Status:** accepted · **Date:** 2026-11-07

## Context

Chunk offsets and gold spans must point at the same text forever. Different input formats would
otherwise need different chunking paths.

## Decision

- Every input becomes **normalized markdown**: UTF-8 decode, Unicode NFC, `\n` newlines, BOM and
  control characters removed (except `\n`, `\t`), 3+ blank lines collapsed to 2, trailing spaces
  trimmed. HTML → markdown (GFM tables); md and txt pass through the text rules.
- **Offsets are JS string indices (UTF-16 code units)** into the normalized text.
- Documents are **immutable**: `content_hash = sha256(normalized_text)` and `normalization_version`
  are stored; a rule change yields a new document version.
- EDGAR 10-K HTML is handled by an offline script that commits normalized fixtures (inline XBRL,
  tables, and item headings need special handling).

## Alternatives considered

- **Chunk the original format** (HTML-aware chunking): multiple chunking paths, unstable offsets.
- **Code-point offsets:** language-neutral, but every slice in JS would need conversion.

## Consequences

The HTML converter is a dependency (chosen in P1-02 with this ADR updated). Any normalization change
requires re-anchoring gold spans (script support in P2-07).
