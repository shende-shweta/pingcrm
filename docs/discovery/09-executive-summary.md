# Discovery Executive Summary

**Project:** PingCRM-Discovery · **Generated:** 30/09/2026, 11:39:55

> **Executive Summary**
>
> This report consolidates the overall ratings, key findings, and recommended actions from the 1 discovery analysis run across this codebase (frontend and backend). Each section below reproduces that analysis's executive view; full evidence and diagrams live in the individual reports.

## Portfolio Overview

| # | Analysis | Overall Rating |
|---|---|---|
| 1 | Code Quality & Complexity Analysis | — |

---

## 1. Code Quality & Complexity Analysis

> **Executive Summary**
>
> The PingCRM codebase suffers from extreme code duplication that dwarfs all other quality concerns. Approximately 70.5% of the 187,334 source lines are near-identical copies across 80 IVR controllers (759 LOC each, differing only by module name), 12 \"GodService\" classes, 8 legacyFormatters files, 133 LegacyPass2 React page components, and 147 legacy class widgets. The frontend layer (1,050 files / 107,920 LOC) is disproportionately affected, with duplicated utility files exceeding 1,000 LOC each and 133 single-function components at 387 LOC apiece. Backend duplication centres on a mechanically stamped controller-per-action pattern where every IVR module has 7 identical controllers. Cyclomatic complexity per method is moderate (max ~18), but the sheer volume of copied code makes safe modification nearly impossible. Git churn is low (3 commits in 6 months), indicating the IVR layer was bulk-generated and has not yet been iterated on — the duplication debt will compound the moment feature work begins. Both layers were analysed: 180 PHP files (backend) and 1,050 TS/TSX/JS/JSX files (frontend).

## 2.1 Benchmark Ratings Summary

| # | Hotspot | Primary KPI | <span class=\"rating rating-good\">Good</span> | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"rating rating-high-risk\">High Risk</span> | Measured | Rating |
|---|---|---|---|---|---|---|---|
| H1 | High Cyclomatic Complexity | Max complexity per method | <10 | 10–20 | >20 | ~18 (Hub/Index.tsx component) | <span class=\"rating rating-moderate\">Moderate</span> |
| H2 | Large Classes | Largest class/file LOC | <300 | 300–1000 | >1000 | 1,101 LOC (legacyFormatters*.ts — 8 files) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H3 | Large Functions | Largest function LOC | <50 | 50–200 | >200 | 387 LOC (LegacyPass2 components — 133 files) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H4 | Business Logic Duplication | Duplicated business logic % | <5% | 5–10% | >10% | ~34% (GodServices + IVR controllers) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H5 | Duplicate Code (general) | Overall duplicate code % | <5% | 5–10% | >10% | ~70.5% (132,077 of 187,334 LOC) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H6 | High Churn Areas | Monthly changes (top files) | <5 | 5–10 | >10 | <2/month (top file: composer.lock — 27 all-time) | <span class=\"rating rating-good\">Good</span> |
| H7 | Defect-Prone Files | Fix commits (hottest file) | 1–3 | 4–5 | >5 | 2 (HandleInertiaRequests.php, Users/Edit.vue) | <span class=\"rating rating-good\">Good</span> |
| H8 | Ownership Issues | Top-author ownership % | >80% | 60–80% | <60% | 100% single-author (IVR layer); 52% top-author overall | <span class=\"rating rating-good\">Good</span> |
| H9 | Unsafe Dynamic Variables (additional) | Files using `extract()` on user input | 0 | 1–5 | >5 | 92 files (80 controllers + 12 GodServices) | <span class=\"rating rating-high-risk\">High Risk</span> |

### Hotspot Score breakdown

| Component | Weight | Sub-score (0–100) | Weighted |
|---|---|---|---|
| Cyclomatic Complexity | 25% | 50 | 12.5 |
| Code Churn | 25% | 10 | 2.5 |
| Defect Density | 20% | 15 | 3.0 |
| Class/Function Size | 15% | 75 | 11.25 |
| Business Logic Duplication | 10% | 95 | 9.5 |
| Developer Ownership Risk | 5% | 10 | 0.5 |
| **Hotspot Score** | **100%** | | **39 / 100** |

## 2.5 Actions Required

| Hotspot | Action | Rating | Priority |
|---|---|---|---|
| H2 — Large Classes | Replace 8 legacyFormatters files with single parameterised function; consolidate 80 IVR controllers into 1 generic controller; merge 12 GodServices into 1 service | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H3 — Large Functions | Replace 133 LegacyPass2 components with single data-driven component; split Hub/Index.tsx into sub-components | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H4 — Business Logic Duplication | Create module registry config; implement single IvrModuleService with Command pattern for workflows | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H5 — Duplicate Code (general) | Consolidate all legacy frontend copies (formatters, Pass2 pages, class widgets, hooks) into parameterised originals | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H9 — Unsafe Dynamic Variables | Replace `extract($payload)` with explicit assignment; add Form Request validation; replace raw SQL with query builder | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H1 — High Cyclomatic Complexity | Decompose Hub/Index.tsx into sub-components; extract LoadsIvrModuleData query patterns into service | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |

## 2.6 Expected Outcomes

- **~70% reduction in codebase size** — eliminating duplicated code reduces ~187,000 LOC to ~55,000 LOC, dramatically lowering maintenance burden and build times.
- **Safer modifications** — a single IvrModuleService and IvrModuleCrudController means business-rule changes are made once, not 92 times.
- **Improved static analysis** — removing `extract()` and raw SQL enables PHPStan/Psalm and ESLint to catch real bugs; currently these tools cannot trace variable origins.
- **Faster onboarding** — new developers can understand 1 parameterised pattern instead of navigating 80 identical controller files.
- **Smaller frontend bundle** — replacing 133 LegacyPass2 components and 147 class widgets with data-driven alternatives reduces JS bundle size by an estimated 60+ KB (gzipped).","stop_reason":"end_turn","session_id":"8d234490-a6c9-4803-97b6-a619500ff6c7","total_cost_usd":2.4659875,"usage":{"input_tokens":23,"cache_creation_input_tokens":97860,"cache_read_input_tokens":1283219,"output_tokens":33490,"server_tool_use":{"web_search_requests":0,"web_fetch_requests":0},"service_tier":"standard","cache_creation":{"ephemeral_1h_input_tokens":97860,"ephemeral_5m_input_tokens":0},"inference_geo":"not_available","iterations":[{"input_tokens":1,"output_tokens":2221,"cache_read_input_tokens":87012,"cache_creation_input_tokens":9519,"cache_creation":{"ephemeral_5m_input_tokens":0,"ephemeral_1h_input_tokens":9519},"type":"message"}],"speed":"standard"},"modelUsage":{"claude-haiku-4-5-20251001":{"inputTokens":8328,"outputTokens":17,"cacheReadInputTokens":0,"cacheCreationInputTokens":0,"webSearchRequests":0,"costUSD":0.008413,"contextWindow":200000,"maxOutputTokens":32000},"claude-opus-4-6":{"inputTokens":23,"outputTokens":33490,"cacheReadInputTokens":1283219,"cacheCreationInputTokens":97860,"webSearchRequests":0,"costUSD":2.4575745,"contextWindow":200000,"maxOutputTokens":64000}},"permission_denials":[],"terminal_reason":"completed","fast_mode_state":"off","uuid":"4b09a394-70d8-46cb-b1e2-4035f1775235"}