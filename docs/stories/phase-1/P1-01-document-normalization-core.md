# P1-01: Document normalization core

**Phase:** 1 | **Status:** todo | **Depends on:** — | **Size:** M

## Why

Every offset, chunk, and gold span points into normalized text. If normalization is unstable, the
benchmark is invalid. One normalization path means one chunking path (ADR 0020).

## User story

As a developer, I want a pure function that turns md and txt input into normalized markdown with a
content hash, so that every document has stable offsets forever.

## Scope

- `src/pipeline/normalize/text.ts`: `normalizeText(raw: string): string` applying ADR 0020's rules
  in a fixed order (NFC, newline normalization, BOM/control stripping, blank-line collapsing,
  trailing-space trimming).
- `src/pipeline/normalize/index.ts`: `normalizeDocument({ bytes, filename, sourceType })` →
  `{ text, contentHash, normalizationVersion, charCount, title }` for `md` and `txt`. Rejects
  invalid UTF-8. Title = first H1 for md, filename otherwise.
- `NORMALIZATION_VERSION = 1` constant.

## Out of scope

- HTML (P1-02). EDGAR (P1-04). Token counts (P1-05).

## Acceptance criteria

- [ ] Idempotent: `normalizeText(normalizeText(x)) === normalizeText(x)` (property test over
      generated strings including CRLF, NBSP, combining characters, emoji).
- [ ] CRLF and CR become LF; decomposed accents become NFC; BOM removed; `\t` preserved.
- [ ] Invalid UTF-8 bytes are rejected with a clear error.
- [ ] `contentHash` is sha256 hex of the normalized text.
- [ ] Rules and order documented in the module header and match ADR 0020.
- [ ] `pnpm check` passes.

## Technical notes

- Offsets are UTF-16 code-unit indices (JS string indices). Do not convert to code points.
- Use `TextDecoder("utf-8", { fatal: true })`.
- Keep markdown syntax intact (don't strip `#`, `|`, `*`); this is normalization, not rendering.

## Test and eval plan

Unit and property tests (generate random strings with a small hand-written generator; avoid new
dependencies unless an ADR justifies one).

## Demo

Run the normalizer on a CRLF file with accents and show before/after and the hash.
