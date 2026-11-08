# Open Questions

Unresolved decisions, each with a recommendation. When Stone answers one, record the answer here
(move it to "Resolved"), update the relevant ADR, and adjust affected stories.

**Blocks Phase 0** = must be answered before the named story starts.

## Open

### Q1. Postgres provider — blocks P0-03

**Options:** Supabase (Postgres only; we don't use its Auth, Storage API, or RLS policies) · Neon
(serverless Postgres, Vercel Marketplace integration, branch per preview deploy).

**Recommendation: Supabase.** Stone already has an account and a Supabase MCP connector is
available to agents in this workspace (inspect tables, run SQL, read advisors), which speeds up
every DB story. Mitigations: tables live in schema `app` so the auto-generated Data API does not
expose them; app traffic uses the transaction pooler (port 6543, `prepare: false`); migrations are
Drizzle's, not Supabase's. Watch item: free projects pause after about a week of inactivity; the
daily cleanup cron touches the DB, which should keep it active (verify in P0-11). Neon is the
fallback if pausing or connection limits bite.

### Q2. Blob storage provider — blocks P0-08

**Options:** Cloudflare R2 (seed default; zero egress, 10 GB free) · Supabase Storage via its S3
endpoint (same vendor as the DB) · Vercel Blob (same vendor as hosting).

**Recommendation: Supabase Storage through its S3-compatible endpoint** if Q1 is Supabase,
otherwise R2. Blob storage here only holds original uploads (≤ 1 MB each, deleted at TTL); the
normalized text lives in Postgres and EDGAR fixtures are committed. One fewer vendor account and
secret set beats R2's zero egress at this scale. The code talks S3 through a tiny interface
(`src/lib/blob.ts`), so switching to R2 is an env change.

### Q3. Pinecone plan — blocks nothing in Phase 0; decide before public launch of Phase 1

Verified 2026-11-07 (https://www.pinecone.io/pricing/,
https://docs.pinecone.io/reference/api/database-limits):

| Plan     | Price             | Reranks/month (`bge-reranker-v2-m3`) | Namespaces/index                          | Other                           |
| -------- | ----------------- | ------------------------------------ | ----------------------------------------- | ------------------------------- |
| Starter  | free              | 500                                  | 100                                       | 5M embed tokens/model/month     |
| Builder  | $20/month flat    | 1,000                                | 1,000 (docs conflict: changelog says 100) | Quotas block instead of billing |
| Standard | $50/month minimum | pay-as-you-go, $2 / 1k               | higher                                    | Cohere Rerank 4 Fast available  |

**Recommendation:** Starter for Phase 0 and Phase 1 development. **Builder** when the Phase 1 demo
goes public: flat price and hard quotas match "guard the bill". Re-evaluate **Standard** at the
start of Phase 2 benchmarking if the rerank quota binds, and for P4-07 (second reranker), which
needs Standard. The rerank cache (P1-15) and caps make Starter/Builder workable.

### Q4. Initial embedding model — confirm before P1-09

**Recommendation: OpenAI `text-embedding-3-small` at 1536 dimensions.** Cheap (about $0.02 per 1M
tokens), strong enough for a meaningful dense baseline, and leaves `text-embedding-3-large` (3072)
or `3-small` at 512 dims as the Phase 4 comparison (P4-06). A search on 2026-11-07 found no newer
OpenAI embedding family, but only secondary sources; P1-09 re-verifies on OpenAI's docs.

### Q5. Reranker model — confirm before P1-15

**Recommendation: `bge-reranker-v2-m3`** (Pinecone hosted). It is the only reranker on Starter and
Builder; `pinecone-rerank-v0` is marked deprecated. Its 1024-token limit per query+document pair
caps useful chunk size at about 900 tokens, so we cap `chunkSize` at 1024 and record when a
candidate may have been truncated. Second reranker for Phase 4: `cohere-rerank-4-fast` (Standard
plan only).

### Q6. Gold-span overlap threshold τ — confirm before P2-05

**Recommendation: τ = 0.5 of the gold span's length** (a chunk counts as relevant if it covers at
least half of the evidence span). Curated spans are minimal evidence, so 0.5 tolerates chunk
boundaries cutting a sentence while rejecting chunks that merely touch the span. The benchmark also
reports τ ∈ {any overlap, 0.5, 1.0} so the headline's sensitivity to τ is visible.

### Q7. Guest TTL — confirm before P0-11

**Recommendation: delete guest data 72 hours after last activity**, swept by a daily cron. Long
enough for an interviewer to come back the next day; short enough to keep namespaces and storage
bounded. Daily sweeps fit Vercel Hobby's cron limits (to be re-verified in P0-06).

### Q8. Per-session caps — confirm before P0-10

**Recommendation** (all overridable via env):

| Cap                            | Value                       | Reason                                                            |
| ------------------------------ | --------------------------- | ----------------------------------------------------------------- |
| Upload size                    | 1 MB                        | Fits a 10-K-sized document; well under Vercel's 4.5 MB body limit |
| Documents per session          | 10                          | Enough to experiment                                              |
| Index configs per guest corpus | 3                           | Namespace budget: 3 × ~25 concurrent sessions ≈ 80 namespaces     |
| Embedded tokens per session    | 400k                        | ~$0.01 OpenAI; the real limit is Pinecone write/embedding quota   |
| Queries per minute / per day   | 20 / 300                    | Human pace, blocks scripts                                        |
| Reranks per session per day    | 30 (cache hits free)        | Rerank quota is the scarcest resource                             |
| Global reranks per day         | 15 (Starter) / 30 (Builder) | Keeps the monthly quota from being drained in one day             |
| Global guest namespaces        | 80 (Starter)                | Leaves room for shared presets under the 100 cap                  |
| New sessions per IP per hour   | 10                          | Stops cookie-clearing abuse                                       |

When a cap is hit, the UI says which cap and suggests the shared corpus, which is always available.

### Q9. EDGAR companies and fiscal year — confirm before P1-03

**Recommendation: five 10-Ks, each company's most recent fiscal year ending in calendar 2025**
(filed late 2025 to early 2026):

| Ticker | Company   | Why                                                                                  |
| ------ | --------- | ------------------------------------------------------------------------------------ |
| KO     | Coca-Cola | Paired with PEP as **hard negatives**: same vocabulary, different facts              |
| PEP    | PepsiCo   | Tests whether retrieval confuses companies (a realistic failure mode)                |
| NVDA   | NVIDIA    | Number-dense, segment tables, fast-changing risk factors                             |
| COST   | Costco    | Non-calendar fiscal year (ends ~Aug/Sep); membership-fee model; different vocabulary |
| NFLX   | Netflix   | Shorter filing, content-amortization accounting; good paraphrase questions           |

Rough size: ~400–600k tokens total, cheap to index under 4–6 presets. Alternates: JPM (very long
filing, banking terms) or MSFT (June fiscal year).

### Q10. GitHub repository and Vercel account — blocks P0-02 and P0-06

**Recommendation:** a **public** GitHub repo (it is a portfolio piece; secrets never enter git),
connected to a Vercel Hobby project with Git integration (preview per PR, production on `main`).
Needed: the repo URL and confirmation that Stone will create the Vercel project and add env vars.

### Q11. Gold set curation workflow — confirm before P2-09

**Recommendation:** an agent drafts ~50 candidate questions with evidence spans using the locator
CLI (P2-08), typed and split; Stone reviews every one and prunes to 30–50 (P2-10, about 2–3 hours
of Stone's time). Human review is what makes the gold set defensible in an interview.

### Q12. Generator and judge models (Phase 3) — decide at Phase 3 start

**Recommendation:** pick one generator and a **different** judge model (reduces self-preference
bias), both through the Vercel AI SDK so the provider is a config value. Decide with current
pricing when Phase 3 starts; not needed earlier.

## Resolved

_None yet._
