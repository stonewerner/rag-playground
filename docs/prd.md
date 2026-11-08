# Product Requirements: RAG Playground

**Owner:** Stone Werner · **Status:** approved for Phase 0 · **Last updated:** 2026-11-07

## 1. Summary

RAG Playground is a public web app for running retrieval experiments and measuring them. A visitor
indexes documents under different configs (chunker, chunk size, overlap, embedding model), runs
queries while turning retrieval knobs (top-k, dense/sparse/hybrid, fusion weight, reranking,
thresholds), and sees exactly which chunks come back, why, and how fast. Labeled questions turn
those experiments into numbers: recall@k, MRR, and nDCG@k per config, compared side by side.

The demo dataset is a small corpus of SEC 10-K filings with a curated gold set. The product is the
retrieval lab.

## 2. Why (goals)

This is a portfolio project. It exists to demonstrate, on a deployed artifact an interviewer can
click through and question, three skills that applied AI engineering roles hire for:

| Goal                     | Evidence the project must produce                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| G1 Evaluation discipline | A versioned gold set with span labels, hand-built metrics, a dev/test split, confidence intervals, and a CI regression guard |
| G2 Retrieval depth       | Hand-built chunkers and RRF fusion, hybrid + rerank measured against dense-only across chunking strategies                   |
| G3 LLM observability     | Per-stage latency, token counts, and estimated cost on every run                                                             |

**Headline outcome:** "hybrid search with hand-built RRF fusion plus reranking improved nDCG@10 from
X to Y over dense-only on a labeled SEC-filing benchmark." X and Y must be real, reproducible from a
committed script, and explainable in an interview (what moved, on which question types, how
confident we are).

## 3. Non-goals

- Real accounts, OAuth, teams, sharing, or multi-user collaboration.
- Billing or monetization.
- Spreadsheets, PDFs with images, charts, or OCR. (Text-only PDF is an optional Phase 4 item.)
- Fine-tuning any model.
- Agent frameworks before Phase 5. LangChain or LlamaIndex, ever.
- A polished marketing site or mobile-specific design (it should not break on mobile, nothing more).
- Being a general document chat product. Generation exists to measure answer quality per
  retrieval config, not to be a chatbot.

## 4. Users

| User                                                     | What they want                                                          | What they do in ~3 minutes                                                                                                             |
| -------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Interviewer / hiring manager**                         | Evidence Stone understands retrieval and evaluation, not just API calls | Opens the link, sees the benchmark table, runs one query on the EDGAR corpus, toggles rerank and watches ranks move, opens a scorecard |
| **Technical visitor** (engineer evaluating the approach) | To poke at knobs and check the methodology                              | Compares two chunking configs on the same query, reads the methodology, uploads a doc                                                  |
| **Stone** (owner, developer)                             | A lab to run real experiments and produce defensible numbers            | Runs batch evals and the benchmark script, curates the gold set, writes up results                                                     |

Interviewers will ask "how do you know?" The product must always be able to answer with a run, a
metric, or a method note.

## 5. Key flows

### F1. First visit (no signup)

1. Visitor opens the app. A signed guest cookie is set; no data is stored until they act.
2. The home page shows the benchmark headline (from Phase 2), the shared EDGAR corpus, and
   "upload your own".

### F2. Query the shared EDGAR corpus

1. Pick the EDGAR corpus and one of its preset index configs (e.g. heading-aware 512/64).
2. Type a question (or pick a gold question). Set top-k, rerank on/off, rerank depth, threshold.
3. See ranked chunks: text, source document and position, dense score, rerank score, and how each
   chunk's rank moved after reranking. See per-stage latency and estimated cost.
4. The run is saved to history.

### F3. Upload and index your own documents

1. Upload md, txt, or html (within caps). The document is normalized to markdown and stored.
2. Create one or more index configs (chunker, size, overlap). Watch ingestion progress.
3. Query each config; compare.

### F4. Replay a run

1. Open run history. Open any past run: the exact snapshot (configs, results, latencies) renders.
2. "Re-run" executes the same snapshot now and shows what changed.

### F5. Measure (Phase 2)

1. Label returned chunks relevant or not (optionally highlight the exact evidence). Labels are
   stored as source spans, so they apply to every config.
2. Each run against a labeled question shows recall@k, MRR, nDCG@k.
3. Run a batch eval of the gold set against a config: a scorecard with means, confidence intervals,
   per-question-type breakdown, and per-question drill-down.
4. Compare two configs: same query side by side, or two scorecards with deltas and significance.

### F6. Generate (Phase 3)

1. Toggle generation: a streamed answer with inline citations mapped to chunks, or an explicit
   abstention when the context is insufficient.
2. Faithfulness and citation-correctness scores (LLM judge), tokens, and cost appear on the run and
   in batch scorecards.

## 6. Functional requirements by phase

Each phase is an epic in `docs/stories/phase-N/EPIC.md`. Summary:

| Phase | Name                     | Delivers                                                                                                                                         | Exit criterion                                                                                            |
| ----- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| 0     | Foundations              | Scaffold, DB schema, guest sessions, blob, Pinecone indexes, caps and rate limits, timing, deploy, TTL cleanup                                   | Deployed empty app with working guest session and DB                                                      |
| 1     | MVP: retrieval only      | Normalization, 3 chunkers, index configs, ingestion, EDGAR corpus, dense query + rerank, rank-movement and latency views, run history and replay | DoD in Phase 1 EPIC (guest indexes under two configs, queries, sees rerank movement and latency, replays) |
| 2     | Measure                  | Sparse retrieval, hand-built RRF + alpha, span labels, gold set, metrics, batch eval, compare, benchmark                                         | Reproducible benchmark table and the real X→Y nDCG@10 number                                              |
| 3     | Generate                 | Streamed cited answers, abstain path, LLM judge, tokens and cost                                                                                 | Answer quality measurable and comparable across retrieval configs                                         |
| 4     | Depth extensions         | Subset of: promptfoo CI, contextual headers, query rewriting, second embedding model, second reranker, text-only PDF, tracing                    | Each shipped extension has a recorded benchmark delta                                                     |
| 5     | Agentic retrieval (opt.) | eve agent with iterative retrieval vs. single-shot                                                                                               | Agentic vs. single-shot comparison recorded                                                               |

Phase 2 must not be reordered after Phase 3. Measurement comes before generation.

## 7. Non-functional requirements

- **Cost:** the public demo runs on free or flat-rate tiers where possible. Hard per-session caps,
  rate limits, inference caches, and daily cleanup. No single visitor can cause meaningful spend.
  Target steady-state cost: under $25/month excluding any Pinecone plan upgrade.
- **Latency:** a dense query with rerank on the EDGAR corpus returns in under 2 s p50 (excluding
  cold starts). Latency is always shown, never hidden.
- **Reproducibility:** benchmark results are produced by a committed script from committed fixtures
  (normalized corpus + gold set with content hashes), record the git SHA and model versions, and
  reuse cached query embeddings and rerank responses.
- **Privacy:** guests are anonymous. IPs are only stored as salted hashes for abuse limits. Guest
  data is deleted after the TTL.
- **Correctness:** chunk offsets, span overlap, and metric code have exhaustive unit tests with
  hand-computed expected values.

## 8. Success metrics

| Metric                               | Target                                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Benchmark exists and is reproducible | `pnpm bench` regenerates the README table from a clean checkout                                         |
| Headline delta                       | A real nDCG@10 delta (dense-only → hybrid + rerank) on the test split, with a 95% CI, whatever its size |
| Gold set                             | 30–50 reviewed questions, typed, dev/test split, span-labeled                                           |
| Demo path                            | An interviewer reaches "query + rank movement + metrics" in under 60 seconds from the landing page      |
| Cost                                 | No month over budget; caps verified by tests                                                            |
| Explainability                       | Every number on the results page links to the runs that produced it                                     |

A small or negative delta is still a success if it is real and explained. Do not tune on the test
split to manufacture a bigger number.

## 9. Risks

| Risk                                                                | Mitigation                                                                                        |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Scope creep (the main risk)                                         | Parking lot; stories must cite which goal they serve                                              |
| Gold set too small or biased (e.g. lexical overlap favors sparse)   | Typed questions incl. paraphrase; report per-type; CIs; dev/test split                            |
| Pinecone free-tier quotas (500 reranks/month, 100 namespaces/index) | Rerank cache, per-session and global caps, shared corpus presets, plan decision in open questions |
| EDGAR HTML is noisy (inline XBRL, tables)                           | Dedicated preprocessing script with quality checks; committed fixtures                            |
| Metric bugs make the headline number wrong                          | Hand-computed test vectors; span-dedup rules documented in ADR 0019                               |
| Vendor API drift (models renamed or deprecated)                     | Model names in config; verify docs per story; record versions on runs                             |
