# Discovery Executive Summary

**Project:** discovery-pingCRM-7Aug · **Generated:** 07/08/2026, 17:25:35

> **Executive Summary**
>
> This report consolidates the overall ratings, key findings, and recommended actions from the 3 discovery analyses run across this codebase (frontend and backend). Each section below reproduces that analysis's executive view; full evidence and diagrams live in the individual reports.

## Portfolio Overview

| # | Analysis | Overall Rating |
|---|---|---|
| 1 | Architecture & Design Analysis | — |
| 2 | Code Quality & Complexity Analysis | — |
| 3 | Frontend Modernization Analysis | — |

---

## 1. Architecture & Design Analysis

> **Executive Summary**
>
> This is a Laravel 11 + Inertia/React application (PingCRM base) that has been overgrown with a large, deliberately-legacy \"IVR\" subsystem. Architectural health is **High Risk**: 83 single-action IVR controllers each carry ~759 lines of inline business logic, raw string-concatenated `DB::select` queries, `extract($request->all())`, hard-coded tenant IDs, and `new SomethingGodService()` instantiation — so controllers, persistence, and domain rules are fused into one untestable layer. A Repository tier (12 classes) and a Service tier (12 `*GodService` classes) both exist but are architecturally hollow: the repositories are referenced by zero call-sites (dead abstraction) and the services are god-classes with 45 unrelated public methods, mutable `static` state, and embedded secrets. There is no Dependency Injection wiring at all (`AppServiceProvider` binds nothing; `Model::unguard()` is global), so nothing can be substituted or mocked. On the frontend, 916 components repeat the same pathology in React terms — 374 components issue inline `fetch()` calls to hard-coded URLs, 147 legacy class components mix paradigms, and 8 near-identical 1,101-line \"formatter\" modules duplicate the same logic. The dominant risks are **change amplification** (one schema or rule change touches dozens of controllers, services, repos and components at once) and **hidden coupling** (reporting reads other domains' operational tables directly), both of which will make any modernization or team scaling extremely costly until bounded contexts, a real service layer, and DI are introduced.

## 1.1 Benchmark Ratings Summary

| # | Hotspot | Primary KPI | <span class=\"rating rating-good\">Good</span> | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"rating rating-high-risk\">High Risk</span> | Measured | Rating |
|---|---|---|---|---|---|---|---|
| H1 | Fat Controllers | Avg LOC per controller | <150 | 150–300 | >300 | **~683 LOC avg** (81 of 91 > 300 LOC; IVR = 759 LOC each) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H2 | Missing Service Layer | Controllers accessing repos/models directly | <10 | 10–20 | >20 | **83** controllers with inline DB/model access + rules | <span class=\"rating rating-high-risk\">High Risk</span> |
| H3 | Missing Repository Pattern | Direct DB access points outside repositories | <10 | 10–20 | >20 | **95** files use `DB::` directly; 12 repositories have **0** references | <span class=\"rating rating-high-risk\">High Risk</span> |
| H4 | Circular Dependencies | Dependency cycles | 0 | 1–3 | >3 | **0** cycles observed | <span class=\"rating rating-good\">Good</span> |
| H5 | Shared Utility Abuse | Utility files w/ business logic | 0 | 1–5 | >5 | **13** (5 backend helpers + 8 frontend dup formatters) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H6 | Direct SQL in Controllers | ORM/repository compliance % | >90% | 60–90% | <60% | **~9%** compliant (83 of 91 controllers embed raw SQL) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H7 | God Classes | Classes >1000 LOC | 0 | 1–3 | >3 | 0 backend > 1000 LOC, **but** 12 `*GodService` @ **45** methods + static state | <span class=\"rating rating-high-risk\">High Risk</span> |
| H8 | Domain Boundary Violations | Cross-domain access points | 0 | 1–5 | >5 | **4** (Reports, IvrHub, LoadsIvrModuleData, IvrAccountContext) | <span class=\"rating rating-moderate\">Moderate</span> |
| H9 | Shared Database Coupling | Tables shared across domains | <10% | 10–30% | >30% | **~21%** (3 of 14 tables shared, no ownership) | <span class=\"rating rating-moderate\">Moderate</span> |
| H10 *(additional)* | No Dependency Injection / Service Locator | Services resolved via `new` | 0 | 1–10 | >10 | **80** `new *GodService()`; 0 container bindings | <span class=\"rating rating-high-risk\">High Risk</span> |
| F1 | Business Logic in Components | Avg LOC per component | <150 | 150–300 | >300 | avg **139 LOC**; 134 of 522 pages (26%) > 300 LOC | <span class=\"rating rating-moderate\">Moderate</span> |
| F2 | Missing Frontend Service/Data Layer | Components w/ inline API calls | <10 | 10–20 | >20 | **374** components with inline `fetch()`/hard-coded URLs | <span class=\"rating rating-high-risk\">High Risk</span> |
| F3 | God / Oversized Components | Components >400 LOC | 0 | 1–3 | >3 | **1** (`Hub/Index.tsx` = 479 LOC); 134 more in 300–400 band | <span class=\"rating rating-moderate\">Moderate</span> |
| F4 | Prop Drilling / Global State Abuse | Max prop-drilling depth | ≤2 | 3–4 | >4 | **≤2** — components self-fetch into local state | <span class=\"rating rating-good\">Good</span> |
| F5 | Legacy / Inconsistent Component Patterns | Legacy-pattern components | 0 | 1–10 | >10 | **147** class components mixed with function components | <span class=\"rating rating-high-risk\">High Risk</span> |

*No additional hotspots beyond H10 were observed.*

## 1.4 Actions Required

| Hotspot | Action | Rating | Priority |
|---|---|---|---|
| H1 Fat Controllers | Reduce the 83 IVR controllers to validate-and-delegate; extract logic into Application Services | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H2 Missing Service Layer | Introduce per-capability Application Services; move query/workflow assembly out of controllers | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H6 Direct SQL in Controllers | Move all `DB::` queries out of controllers into bound-parameter repositories; add CI grep gate | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H10 No Dependency Injection | Bind interfaces in `AppServiceProvider`, inject services, remove `new *GodService()` and `Model::unguard()` | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H3 Missing Repository Pattern | Give repositories interfaces + bound queries; route all persistence through them | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H5 Shared Utility Abuse | Replace 5 `LegacyIvr*` helpers with domain services; collapse 8 duplicate formatter modules into one | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H7 God Classes | Split each `*GodService` into domain service + repository + application service; remove static state/secret | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| F2 Missing Frontend Service Layer | Introduce a typed API client + hooks; replace 374 inline `fetch()`/hard-coded URLs | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| F5 Legacy Component Patterns | Codemod 147 class widgets to hooks; add error boundaries and a ban-class lint rule | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H8 Domain Boundary Violations | Introduce published read models / ACL; forbid cross-context table reads in Reports & Hub | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |
| H9 Shared Database Coupling | Assign per-table ownership; serve reporting via an owned read model instead of live joins | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |
| F1 Business Logic in Components | Move validation/transform into shared hooks/schema; split 300–400-LOC page templates | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |
| F3 God / Oversized Components | Decompose `Hub/Index.tsx` (479 LOC) and the shared 392-LOC template into widgets + hooks | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |

## 1.5 Expected Outcomes

- **Testable, reusable business logic** — with Application/Domain Services and constructor DI in place, workflows can be unit-tested with mocked repositories and reused from HTTP, CLI and queued jobs instead of being copy-pasted across 83 controllers.
- **Schema and persistence freedom** — funnelling every `DB::` call through parameter-bound repositories removes the injection holes and lets the team rename/repartition `ivr_*` tables without editing dozens of hand-written query strings.
- **Independent, extractable domains** — bounded contexts with published interfaces and an anti-corruption layer let Queue, Call Routing, Analytics and Reporting evolve (and eventually extract) without silently breaking each other through shared tables.
- **A consistent, maintainable frontend** — a single typed API client plus hooks and function components collapses 374 inline fetches and 147 class widgets into one convention, so endpoint/auth changes are one-file edits and screens stop leaking timers and blanking on errors.
- **Sharply lower change amplification** — de-duplicating the 5 helpers and 8 formatter modules and enforcing CI gates (no `DB::` in controllers, no `React.Component`, duplication check) means a single rule change stops rippling through dozens of near-identical files.","ttft_ms":7882,"ttft_stream_ms":7697,"time_to_request_ms":6140,"type":"result","duration_ms":491456,"uuid":"07a4177b-031e-4e68-a1fd-2230b3ef721b"}

---

## 2. Code Quality & Complexity Analysis

> **Executive Summary**
>
> This codebase is a Ping CRM base (Laravel + Inertia/React) onto which a very large \"Legacy IVR\" surface has been grafted, and that surface is dominated by copy-paste rather than genuine algorithmic complexity. Coverage spans **both layers**: 141 backend PHP files and 1,051 frontend TypeScript/TSX files (1,192 total). The most severe findings are structural, not branch-depth: the frontend contains 8 files over 1,100 LOC and 133 near-identical `LegacyPass2_*.tsx` pages, while the backend has 82 fat IVR controllers at exactly 759 LOC each, 12 `*GodService` classes, and 12 near-identical repositories — pushing estimated overall duplication well above 60%. By contrast, per-method cyclomatic complexity is genuinely low (max ≈ 8) and no single function exceeds ~22 LOC, so those hotspots rate Good. Git history was available (124 commits, 2020–2026); churn and defect-fix frequency on the maintained core are low, but note that the entire high-risk IVR surface arrived in a single bulk commit — so its near-zero churn is deceptive, not reassuring. Additional backend anti-patterns were confirmed: shared mutable `public static` state in all 12 God services and ~4,940 uses of `extract()` for dynamic variable creation.

## 2.1 Benchmark Ratings Summary

| # | Hotspot | Primary KPI | <span class=\"rating rating-good\">Good</span> | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"rating rating-high-risk\">High Risk</span> | Measured | Rating |
|---|---|---|---|---|---|---|---|
| H1 | High Cyclomatic Complexity | Max complexity per method | <10 | 10–20 | >20 | ~8 (`IvrHubController::loadStats`) | <span class=\"rating rating-good\">Good</span> |
| H2 | Large Classes | Largest class/file LOC | <300 | 300–1000 | >1000 | 1,101 LOC (frontend); 759 LOC × 82 (backend) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H3 | Large Functions | Largest function LOC | <50 | 50–200 | >200 | ~22 LOC (`handleStore`) | <span class=\"rating rating-good\">Good</span> |
| H4 | Business Logic Duplication | Duplicated business logic % | <5% | 5–10% | >10% | ~60% (handlers + workflows copied per module) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H5 | Duplicate Code (general) | Overall duplicate code % | <5% | 5–10% | >10% | ~65% (est., manual — no jscpd/phpcpd configured) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H6 | High Churn Areas | Monthly changes (top files) | <5 | 5–10 | >10 | ~0.35/mo (top file, 27 changes / 78 mo) | <span class=\"rating rating-good\">Good</span> |
| H7 | Defect-Prone Files | Fix commits (hottest file) | 1–3 | 4–5 | >5 | 3 (`Contacts/Index`) | <span class=\"rating rating-good\">Good</span> |
| H8 | Ownership Issues | Top-author ownership % | >80% | 60–80% | <60% | 43–71% (maintained core files) | <span class=\"rating rating-moderate\">Moderate</span> |
| H9 | Global Mutable State *(additional)* | Shared mutable static/global holders (target 0) | 0 | 1–3 | >3 | 12 (`public static $sharedRuntimeCache`) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H10 | Dynamic Variable Creation *(additional)* | `extract()`/dynamic-var uses (target 0) | 0 | 1–50 | >50 | ~4,940 `extract($payload)` calls | <span class=\"rating rating-high-risk\">High Risk</span> |

### Hotspot Score breakdown

| Component | Weight | Sub-score (0–100) | Weighted |
|---|---|---|---|
| Cyclomatic Complexity | 25% | 18 | 4.50 |
| Code Churn | 25% | 15 | 3.75 |
| Defect Density | 20% | 30 | 6.00 |
| Class/Function Size | 15% | 80 | 12.00 |
| Business Logic Duplication | 10% | 92 | 9.20 |
| Developer Ownership Risk | 5% | 55 | 2.75 |
| **Hotspot Score** | **100%** | | **38 / 100** |

## 2.5 Actions Required

| Hotspot | Action | Rating | Priority |
|---|---|---|---|
| H4 Business Logic Duplication | Consolidate per-module workflows into one `IvrModuleService` + a shared `useIvrRecordForm` hook | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H5 Duplicate Code (general) | Replace 133 `LegacyPass2` pages / 8 formatter clones / 12 repos with data-driven components; add `jscpd`/`phpcpd` CI gate | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H2 Large Classes | Split 82 fat IVR controllers into single-action controllers + services; collapse >1,000-LOC formatter modules | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H9 Global Mutable State | Replace `public static $sharedRuntimeCache` with request-scoped/per-tenant cache in all 12 God services | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H10 Dynamic Variable Creation | Replace ~4,940 `extract($payload)` calls with explicit access/DTOs; ban `extract()` via PHPStan | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H8 Ownership Issues | Add CODEOWNERS for CRM core and assign an owner/deprecation decision for `Legacy/**` and `Pages/Ivr/**` | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |

## 2.6 Expected Outcomes

- **Lower maintenance cost:** consolidating duplicated workflows and files removes an estimated ~60% of redundant code, so each business-rule change is made once instead of across 12–230 sites.
- **Fewer regressions:** a single shared service + form hook eliminates the \"fixed here but not there\" defect class that dominates the IVR surface today.
- **Faster, safer builds:** deleting 8 oversized formatter modules and ~360 clone components shrinks the frontend bundle and CI time; a duplication gate prevents new clones.
- **Correctness & isolation:** removing shared static state and `extract()` closes cross-tenant leakage and restores static-analysis (Larastan) coverage.
- **Clearer ownership:** CODEOWNERS on the maintained core and an explicit decision on the Legacy/IVR surface reduce coordination overhead and stop dead code from accreting.

---

**Report saved to** `docs/discovery/02-code-quality-complexity.md` (both frontend and backend layers covered). The orchestration UI will convert it to the matching PDF.","ttft_ms":4694,"ttft_stream_ms":3705,"time_to_request_ms":125,"type":"result","duration_ms":452890,"uuid":"7c0f0161-e69f-4426-b88a-b19daa69a597"}

---

## 3. Frontend Modernization Analysis

> **Executive Summary**
>
> This is the React/Inertia.js single-page frontend of a PingCRM-derived CRM that has been heavily extended with a synthetic \"IVR\" telephony surface. The core PingCRM slice (Pages/Contacts, Organizations, Users, Auth, Reports and the 14-component `Shared/` library) is clean, idiomatic React 19 with TypeScript strict mode on. The IVR extension, however, is a large modernization liability: 916 component files, of which ~517 are near-identical duplicates (133 `LegacyPass2_*` page clones, 229 `*Monolith*` components, 147 class-based `.jsx` widgets, 8 byte-identical formatter utilities). The most severe findings are the total absence of an API/service layer — all 874 `fetch()` calls are made inline inside components against an **unauthenticated** `ivr-legacy/*` route group — plus 375 files that start a 5-second `setInterval` poll with no cleanup (a systemic memory/network leak), 13,701 inline-`style` occurrences with zero design tokens, and a High-severity lodash CVE in a dependency that the frontend does not even import. TypeScript strict is enabled and ESLint is configured, but ESLint is not run in CI, and there are no error boundaries anywhere in the tree.

### §3.1 Benchmark Ratings Summary

| # | Hotspot | Primary KPI | <span class=\"rating rating-good\">Good</span> | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"rating rating-high-risk\">High Risk</span> | Measured | Rating |
|---|---|---|---|---|---|---|---|
| H1 | UI Component Duplication | Duplicate components % | <5% | 5–10% | >10% | ~517 / 916 ≈ **56%** near-identical | <span class=\"rating rating-high-risk\">High Risk</span> |
| H2 | Legacy Class-Based Components | Modern component adoption % | >90% | 70–90% | <70% | **84.0%** (147 class `.jsx`) | <span class=\"rating rating-moderate\">Moderate</span> |
| H3 | Massive Components | Largest component LOC | <200 | 200–500 | >500 | **479 LOC** (134 files >300) | <span class=\"rating rating-moderate\">Moderate</span> |
| H4 | Global State Dependencies | Components reading global state % | <30% | 30–60% | >60% | **~0%** (no global store) | <span class=\"rating rating-good\">Good</span> |
| H5 | Complex State Management | Max prop-drilling depth | <3 | 3–5 | >5 | **≤2** (Inertia page props) | <span class=\"rating rating-good\">Good</span> |
| H6 | Weak Frontend Architecture | Feature modules with clean boundaries % | >80% | 50–80% | <50% | **<20%** (API+UI+logic mixed) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H7 | Missing Component Inventory | Shared component % of total | >30% | 15–30% | <15% | **1.5%** (14 / 916, no Storybook) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H8 | No Design System | Inline-style / magic-value occurrences | 0–5 | 6–20 | >20 | **13,701** inline styles, 0 tokens | <span class=\"rating rating-high-risk\">High Risk</span> |
| H9 | Routing Structure Weakness | Protected routes with guards % | 100% | 80–99% | <80% | **100%** page routes guarded | <span class=\"rating rating-good\">Good</span> |
| H10 | No API Integration Layer | API calls in service layer % | >90% | 70–90% | <70% | **0%** (874 inline `fetch`) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H11 | Poor Data Caching | Data-fetching points with caching % | >70% | 40–70% | <40% | **0%** (no query cache) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H12 | Weak Frontend Auth | Token storage + routes guarded | httpOnly + 100% | One gap | Both gaps | httpOnly cookie ✓ / **data API unguarded** | <span class=\"rating rating-moderate\">Moderate</span> |
| H13 | Frontend Security Vulnerabilities | XSS-risk + hardcoded secrets count | 0 each | 1–3 total | >3 total | **5+** (2 innerHTML, 2 no-SRI, seeded pw) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H14 | Frontend Performance Gaps | Memoization / render optimization | good | some gaps | none + leaks | **0** memo, 375 interval leaks | <span class=\"rating rating-moderate\">Moderate</span> |
| H15 | Browser Compatibility Gaps | Browserslist + polyfills configured | Both present | One missing | Both missing | polyfills ✓ / **no browserslist** | <span class=\"rating rating-moderate\">Moderate</span> |
| H16 | Frontend Code Quality | ESLint in CI + TypeScript strict | Both Yes | One Yes | Both No | strict ✓ / **ESLint not in CI** | <span class=\"rating rating-moderate\">Moderate</span> |
| H17 | Technical Debt & Dependencies | Critical/High CVEs found | 0 | 1–3 | >3 | **1 High** (lodash) + dead deps | <span class=\"rating rating-moderate\">Moderate</span> |
| H18 | *(additional)* useEffect Cleanup / Leaks | Effects with timers lacking cleanup | 0 | 1–10 | >10 | **375** `setInterval` w/o cleanup | <span class=\"rating rating-high-risk\">High Risk</span> |
| H19 | *(additional)* Missing Error Boundaries | Error boundaries present | ≥1 per area | 1 global | 0 | **0** boundaries app-wide | <span class=\"rating rating-moderate\">Moderate</span> |

### §3.4 Actions Required

| Hotspot | Action | Rating | Priority |
|---|---|---|---|
| H10 No API Integration Layer | Move 874 inline `fetch` calls into a typed `services/ivrClient` with auth-header/error interceptors | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H12 Weak Frontend Auth | Add `auth` middleware to the `ivr-legacy` route group; restrict mutations to POST/PUT/DELETE | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-critical\">Critical</span> |
| H13 Security Vulnerabilities | Add SRI to CDN scripts, remove seeded `password:'secret'`, sanitize pagination HTML | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H18 Interval Leaks | Return `clearInterval` cleanup in 375 effects (or migrate to React Query polling) | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H1 Component Duplication | Consolidate `LegacyPass2_*`, `*Monolith*` and `legacyFormatters1-8` into parameterised units | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H6 Weak Architecture | Extract service layer + presentational components; inject `tenantId` from auth context | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H7 Missing Inventory | Publish `Shared/` as `@/ui` + Storybook; migrate IVR raw controls onto it | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H8 No Design System | Introduce design tokens; codemod 13,701 inline styles to Tailwind classes | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H11 Poor Data Caching | Adopt React Query with `staleTime` and post-mutation invalidation | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H2 Legacy Class Components | Convert 147 `*ClassWidget.jsx` to typed function components with a shared hook | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-high\">High</span> |
| H19 Missing Error Boundaries | Add global + per-feature `ErrorBoundary` with fallback UI | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-high\">High</span> |
| H16 Code Quality | Add ESLint CI job; re-enable `no-explicit-any`; bring `.jsx` under strict tsconfig | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |
| H17 Technical Debt | Remove unused vulnerable `lodash` + dead `react-router-dom`; upgrade prettier/eslint | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |
| H3 Massive Components | Replace unrolled markup with data maps; extract logic to hooks (`max-lines` rule) | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |
| H14 Performance Gaps | Fix interval leaks, memoize heavy tables, add a CI bundle budget | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |
| H15 Browser Compatibility | Add `.browserslistrc`; bundle polyfills locally; wire Autoprefixer | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-low\">Low</span> |

### §3.5 Expected Outcomes

- **A centralized `services/ivrClient` layer** replaces 874 scattered `fetch` calls, giving one place for auth headers, CSRF, base URL, typed responses and consistent error UX — and making the API mockable in tests.
- **Guarding the `ivr-legacy` route group and removing GET mutations** closes an open, unauthenticated data-and-delete surface that currently sits behind an authenticated page shell.
- **Fixing the 375 interval leaks** (or moving to React Query polling) eliminates a compounding memory/network leak, stabilising long sessions and cutting idle backend traffic.
- **Adopting React Query** brings caching, loading/error states and post-mutation invalidation, ending stale-after-save UX and redundant refetching.
- **Consolidating ~517 duplicated clones** into parameterised components/utilities shrinks the tree, kills behaviour drift, and makes a single fix apply everywhere.
- **A documented `@/ui` library + design tokens** replaces 13,701 inline styles with a single source of truth for colour and spacing, restoring visual consistency and making rebrands one-line changes.
- **Converting 147 class widgets to typed hooks** and enforcing ESLint in CI with `strict` typing catches hook-rule and type errors (including the leaks) before they reach `master`.
- **Removing the unused, CVE-carrying `lodash` and dead `react-router-dom`** clears the one High-severity advisory and reduces attack surface and audit noise to zero.
- **Adding error boundaries** turns a full-page blank-out on any render throw into a contained, recoverable per-feature fallback.","ttft_ms":2446,"ttft_stream_ms":1441,"time_to_request_ms":179,"type":"result","duration_ms":487645,"uuid":"15edec16-e292-4579-b37e-0beb5093972f"}