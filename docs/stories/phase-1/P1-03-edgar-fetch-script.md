# P1-03: EDGAR fetch script

**Phase:** 1 | **Status:** todo | **Depends on:** P0-01 | **Size:** M

## Why

The shared 10-K corpus is the benchmark's foundation. Fetching it reproducibly, politely, and with
provenance (accession numbers, URLs) makes the benchmark auditable.

## User story

As the owner, I want one command that downloads the chosen 10-K filings with provenance, so that
the corpus can be rebuilt from scratch.

## Scope

- `scripts/edgar/fetch.ts` (`pnpm edgar:fetch`): for each company in `scripts/edgar/companies.ts`
  (ticker, CIK, target fiscal year — from open question Q9), read the EDGAR submissions JSON,
  find the 10-K for the target fiscal year, download the primary document HTML.
- Polite client: `User-Agent` from `SEC_USER_AGENT`, ≤ 5 requests/second (SEC max is 10), retries
  with backoff on 429/5xx, local cache in `.cache/edgar/` (skip download if cached).
- Write `.cache/edgar/raw-manifest.json` with ticker, CIK, company name, form, fiscal year (from
  `reportDate`), filing date, accession number, primary document URL, byte size, sha256 of raw HTML.

## Out of scope

- Cleaning and conversion (P1-04). Exhibits and XBRL financial data APIs.

## Acceptance criteria

- [ ] `pnpm edgar:fetch` downloads all filings on a clean cache and is a no-op on re-run.
- [ ] Requests carry the declared User-Agent; throttling verified by a unit test with a fake clock.
- [ ] Raw manifest written with every field above.
- [ ] Q9 resolved in `docs/open-questions.md` (companies and fiscal year confirmed by Stone).
- [ ] `pnpm check` passes.

## Technical notes

Verified 2026-11-07: SEC fair access requires a declared User-Agent and caps at 10 requests/second
(https://www.sec.gov/os/accessing-edgar-data).

- Submissions API: `https://data.sec.gov/submissions/CIK##########.json` (10-digit zero-padded CIK);
  overview at https://www.sec.gov/search-filings/edgar-application-programming-interfaces
- Archive URL pattern: `https://www.sec.gov/Archives/edgar/data/<cik>/<accession-no-dashes>/<primaryDocument>`
- Verify field names (`filings.recent.form`, `primaryDocument`, `reportDate`, `accessionNumber`)
  against a live response before coding.

## Test and eval plan

Unit tests for filing selection on a recorded submissions JSON fixture and for the throttle.

## Demo

`pnpm edgar:fetch` on an empty cache: log lines per company, then the raw manifest.
