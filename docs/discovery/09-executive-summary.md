# Discovery Executive Summary

**Project:** discovery-26-aug · **Generated:** 26/08/2026, 16:42:35

> **Executive Summary**
>
> This report consolidates the overall ratings, key findings, and recommended actions from the 2 discovery analyses run across this codebase (frontend and backend). Each section below reproduces that analysis's executive view; full evidence and diagrams live in the individual reports.

## Portfolio Overview

| # | Analysis | Overall Rating |
|---|---|---|
| 1 | Testing & Quality Assurance Analysis | — |
| 2 | Performance & Sustainability Analysis | — |

---

## 1. Testing & Quality Assurance Analysis

> **Executive Summary**
>
> PingCRM's test suite is critically under-resourced across both its Laravel backend and React/TypeScript frontend. Of 141 PHP source files and 903 frontend TypeScript/TSX files, only 5 test files exist in total — two real backend feature tests (Contacts, Organizations), one PHP unit placeholder that asserts `assertTrue(true)`, one frontend smoke test that asserts `expect(true).toBe(true)`, and a shared TestCase base class. Estimated overall coverage is well below 5%. Entire high-risk domains ship with zero test protection: the authentication flow, the Users module, Reports, and the entire IVR platform (83 controllers, 12 legacy GodServices, 12 repositories); no contract tests exist for any API endpoint or JSON response schema. Frontend Vitest tests are absent from the CI pipeline entirely, meaning the React layer has no automated regression gate. The two real backend feature tests run on CI but no evidence of being a required status check was found, compounding the risk.

## §5.1 Benchmark Ratings Summary

| # | Hotspot | Primary KPI | <span class=\"rating rating-good\">Good</span> | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"rating rating-high-risk\">High Risk</span> | Measured | Rating |
|---|---|---|---|---|---|---|---|
| H1 | Untested Critical Logic | Critical modules with zero tests (target 0) | 0 | 1–3 | >3 | Auth, Users, Reports, IVR (83 controllers), 12 Legacy GodServices, 12 Repositories — **>10 modules** | <span class=\"rating rating-high-risk\">High Risk</span> |
| H2 | Low Test Coverage | Overall coverage % (target >80%) | >80% | 50–80% | <50% | Backend ~2% · Frontend ~0% (test-to-source ratio estimate — no coverage report present) | <span class=\"rating rating-high-risk\">High Risk</span> |
| H3 | Missing Integration Tests | Key service/data boundaries covered % (target >70%) | >70% | 30–70% | <30% | 2 of ~30+ real service/controller boundaries = ~7% | <span class=\"rating rating-high-risk\">High Risk</span> |
| H4 | Missing Contract Tests | Public APIs/contracts with contract tests % (target >80%) | >80% | 40–80% | <40% | 0 contract tests for any endpoint | <span class=\"rating rating-high-risk\">High Risk</span> |
| H5 | Flaky / Skipped Tests | Skipped/flaky test count (target 0) | 0 | 1–5 | >5 | 0 | <span class=\"rating rating-good\">Good</span> |
| H6 | No CI Test Gate | Tests enforced in CI | Required gate | Runs, not required | No CI test run | PHP tests run on PR/push; frontend Vitest **absent from CI entirely** | <span class=\"rating rating-high-risk\">High Risk</span> |
| H7 | Trivial / Assertion-Free Tests (additional) | Tests with no meaningful assertion (target 0). Good: 0 · Moderate: 1 · High Risk: >1 | 0 | 1 | >1 | 2 vanity tests (`ExampleTest.php`, `smoke.test.ts`) with `assertTrue(true)` / `expect(true).toBe(true)` | <span class=\"rating rating-high-risk\">High Risk</span> |

---

## §5.4 Actions Required

| Hotspot | Action | Rating | Priority |
|---|---|---|---|
| H1 — Untested Critical Logic | Write PHPUnit feature tests for `AuthenticatedSessionController` (login, logout, rate-limiting), `UsersController` (CRUD, owner flag), and at least one Index/Store test per IVR module (12 modules × 2 = 24 tests) | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H2 — Low Test Coverage | Enable PHPUnit coverage reporting in CI; set 30% initial gate in `phpunit.xml`; configure `@vitest/coverage-v8` with a 20% branch threshold for the frontend | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| H3 — Missing Integration Tests | Extend `RefreshDatabase` feature tests to `UsersController` mutations and all IVR Index HTTP endpoints; add `LoginRequest` rate-limiter boundary test | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H4 — Missing Contract Tests | Add `AssertableInertia` prop-contract tests for all IVR Index pages asserting `rows`, `filters`, and `legacyMeta` keys; add JSON response shape assertions for `wantsJson()` branches in all 12 IVR modules | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H6 — No CI Test Gate (Frontend) | Add `npm test` (Vitest) and `npx tsc --noEmit` steps to `.github/workflows/tests.yml`; mark the workflow as a required GitHub branch protection status check on `master` | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| H7 — Trivial / Assertion-Free Tests | Replace `tests/Unit/ExampleTest.php` with a real `User` model unit test; replace `resources/js/test/smoke.test.ts` with a `@testing-library/react` component render test | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-medium\">Medium</span> |

---

## §5.5 Expected Outcomes

- Authentication and user-management regressions are caught by automated tests before they reach production, eliminating the risk of silent privilege escalation or account lockout.
- The entire IVR platform (83 controllers, 12 GodServices) has a regression safety net in place before any modernization or refactoring begins, allowing teams to refactor with confidence.
- Frontend Vitest and TypeScript checks run on every CI build, ensuring broken React components or type errors are caught at pull-request time rather than at runtime.
- API and Inertia prop-contract tests prevent breaking changes to JSON response shapes from silently corrupting IVR frontend pages after any backend change.
- A clearly visible, enforced coverage gate (30% initial, rising to 75%) gives the team a measurable quality trend and blocks coverage regressions from merging to `master`.","stop_reason":"end_turn","session_id":"5341f125-6bcb-491c-951f-dfa4b663448a","total_cost_usd":1.3179066999999998,"usage":{"input_tokens":27,"cache_creation_input_tokens":78709,"cache_read_input_tokens":1615969,"output_tokens":23360,"server_tool_use":{"web_search_requests":0,"web_fetch_requests":0},"service_tier":"standard","cache_creation":{"ephemeral_1h_input_tokens":78709,"ephemeral_5m_input_tokens":0},"inference_geo":"not_available","iterations":[{"input_tokens":1,"output_tokens":1832,"cache_read_input_tokens":99363,"cache_creation_input_tokens":533,"cache_creation":{"ephemeral_5m_input_tokens":0,"ephemeral_1h_input_tokens":533},"type":"message"}],"speed":"standard"},"modelUsage":{"claude-haiku-4-5-20251001":{"inputTokens":10301,"outputTokens":16,"cacheReadInputTokens":0,"cacheCreationInputTokens":0,"webSearchRequests":0,"costUSD":0.010381,"contextWindow":200000,"maxOutputTokens":32000},"claude-sonnet-4-6":{"inputTokens":27,"outputTokens":23360,"cacheReadInputTokens":1615969,"cacheCreationInputTokens":78709,"webSearchRequests":0,"costUSD":1.3075256999999998,"contextWindow":200000,"maxOutputTokens":32000}},"permission_denials":[],"terminal_reason":"completed","fast_mode_state":"off","uuid":"f45bcf14-e71e-4c25-8b71-12cf90f5c409"}

---

## 2. Performance & Sustainability Analysis

> **Executive Summary**
>
> The pingcrm codebase exhibits **High Risk** performance and sustainability characteristics dominated by one critical pattern: 12 Legacy \"God Service\" classes (covering every IVR module from AgentDesk to QueueManagement) each contain **45+ workflow methods that unconditionally call `sleep(1)`** — a direct 1-second synchronous blocking delay injected into every write path, guaranteeing multi-second response times on any operation that invokes these services. This alone would cap throughput and inflate server-time cost to unacceptable levels. Compounding this, **81 raw SQL queries using `SELECT * FROM <table>`** without column projection expose the application to unbounded payload growth as tables widen, while **229 legacy React monolith components and 147 class-based React widgets** are bundled eagerly without any code-splitting or lazy loading, ballooning the initial JavaScript payload. A static mutable `$sharedRuntimeCache` array — present in all 12 God Services — grows unboundedly across requests in long-running PHP-FPM workers and silently leaks per-tenant write data between requests. The CI pipeline has partial caching (Composer layer cached, npm `ci` uncached, no incremental frontend builds), and the Heroku single-dyno deploy with `QUEUE_CONNECTION=sync` provides no autoscaling and processes background work synchronously in the request thread. Database performance (N+1, missing indexes) and frontend caching are deferred to the Backend Modernization and Frontend Modernization reports respectively.

## §7.1 Benchmark Ratings Summary

| # | Hotspot | Primary KPI | <span class=\"rating rating-good\">Good</span> | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"rating rating-high-risk\">High Risk</span> | Measured | Rating |
|---|---|---|---|---|---|---|---|
| P1 | Algorithm Efficiency | High-complexity algorithm sites | 0 | 1–5 | >5 | 0 — no nested O(n²)+ loops found | <span class=\"rating rating-good\">Good</span> |
| P2 | Database Performance | Deferred → Backend Modernization (H14/H10) | — | — | — | See Backend Modernization | — (deferred) |
| P3 | API Performance | Response-latency hotspots (blocking chains / oversized payloads) | 0 | 1–5 | >5 | 540 blocking sleep(1) calls + 81 SELECT * endpoints | <span class=\"rating rating-high-risk\">High Risk</span> |
| P4 | Memory Efficiency | High-memory sites (unbounded caches, full-load, retention/leaks) | 0 | 1–3 | >3 | 12 God Services with unbounded static array caches | <span class=\"rating rating-high-risk\">High Risk</span> |
| P5 | CPU Efficiency | CPU-intensive operations on hot paths | 0 | 1–5 | >5 | 1 — image processing on every request with no dedicated cache/CDN path | <span class=\"rating rating-moderate\">Moderate</span> |
| P6 | Concurrency | Parallelizable CPU-bound work + pool sizing | 0 | 1–5 | >5 | 0 — no CPU-bound sequential work identified | <span class=\"rating rating-good\">Good</span> |
| P7 | Caching | Deferred → Backend Modernization H14 / Frontend Modernization H11 | — | — | — | See those reports | — (deferred) |
| P8 | Resource Utilization | Over-provisioned / idle resource configs | 0 | 1–3 | >3 | 1 — single always-on Heroku dyno; QUEUE_CONNECTION=sync; no autoscaling | <span class=\"rating rating-moderate\">Moderate</span> |
| P9 | Network Efficiency | Excessive-traffic sites (chatty/duplicate calls, no compression) | 0 | 1–5 | >5 | 81 SELECT * endpoints + 229 legacy components serialising full rows to debug pre output | <span class=\"rating rating-high-risk\">High Risk</span> |
| P10 | Build Efficiency | Build/test pipeline efficiency | efficient | partial | slow / no caching | Composer cached; npm ci uncached; 904 TSX/TS files with no code-splitting | <span class=\"rating rating-moderate\">Moderate</span> |
| P11 | Logging Efficiency | Excessive-logging sites in hot paths | 0 | 1–10 | >10 | 0 explicit hot-loop logs; LOG_LEVEL=debug default in .env.example | <span class=\"rating rating-moderate\">Moderate</span> |
| P12 | Sustainability | Resource-optimization posture | optimized | partial | wasteful | Single always-on dyno, QUEUE_CONNECTION=sync, no autoscaling, no carbon-aware scheduling | <span class=\"rating rating-high-risk\">High Risk</span> |
| P13 | Uncancelled async fetch (additional) | Async fetch calls without AbortController / cleanup | 0 | 1–5 | >5 | 147 class-based React widgets in componentDidMount with bare fetch() and no cancellation | <span class=\"rating rating-high-risk\">High Risk</span> |

## §7.5 Actions Required

| Hotspot | Action | Rating | Priority |
|---|---|---|---|
| P3 — API Performance | Remove all 540 `sleep(1)` calls from 12 legacy God Services; replace `SELECT *` with column-projected Eloquent queries; dispatch remote-sync logic to Laravel queue | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| P4 — Memory Efficiency | Remove `public static $sharedRuntimeCache` from all 12 God Services; replace with `Cache::put()` with TTL if cross-request state is genuinely needed | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| P13 — Uncancelled async fetch | Add `AbortController` / `componentWillUnmount` cleanup to all 147 class-based legacy React widgets; deduplicate sibling fetches using a shared parent or Inertia props | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| P9 — Network Efficiency | Replace 81 `DB::select(\"select * from ...\")` with projected queries; remove `JSON.stringify({rows, legacyMeta})` debug pre blocks from 229 legacy monolith components; add gzip to Apache2 | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| P12 — Sustainability | Switch `QUEUE_CONNECTION=redis`; add `worker` dyno to Procfile; enable gzip in `public/.htaccess`; configure `LOG_CHANNEL=stderr` for Heroku; evaluate autoscaling | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| P5 — CPU Efficiency | Add `Cache-Control: public, max-age=31536000` headers to Glide image responses; place CDN in front of `/images/` route | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |
| P8 — Resource Utilization | Configure Heroku autoscaling or add Heroku Scheduler to scale down during off-peak windows; evaluate separate worker dyno configuration | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |
| P10 — Build Efficiency | Add npm dependency cache step to CI workflow keyed on `package-lock.json`; introduce `React.lazy()` route-based code-splitting for legacy IVR modules | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |
| P11 — Logging Efficiency | Change `LOG_LEVEL=warning` in `.env.example`; switch to `LOG_CHANNEL=stderr` for Heroku to avoid synchronous file I/O | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-low\">Low</span> |

## §7.6 Expected Outcomes

- **Eliminating the 540 `sleep(1)` calls** will reduce IVR write response times from 1+ second to sub-50ms, unblocking Heroku PHP-FPM workers and increasing write path throughput by approximately 20×.
- **Removing unbounded static caches and projecting SQL columns** will stabilise PHP-FPM worker memory, eliminating crash-restart cycles under load and reducing per-request DB bandwidth by an estimated 60–80% on wide IVR tables.
- **Removing `JSON.stringify(rows)` debug blocks from 229 components and adding gzip compression** will reduce Inertia.js page payload size significantly, improving Time-to-Interactive and reducing bandwidth cost per page view.
- **Introducing a Redis queue with a worker dyno** decouples write-path latency from background processing, enabling HTTP responses to return immediately and allowing independent scaling of web and worker capacity based on actual load.
- **Adding npm dependency caching and route-based code-splitting** will reduce CI build time and shrink the initial JS bundle, lowering client-side CPU/energy consumption per page visit and improving Core Web Vitals scores for all routes.","stop_reason":"end_turn","session_id":"5d80ddcc-4ddf-4449-83d8-eed67682aa3b","total_cost_usd":2.1883325000000005,"usage":{"input_tokens":40,"cache_creation_input_tokens":118991,"cache_read_input_tokens":3340385,"output_tokens":30693,"server_tool_use":{"web_search_requests":0,"web_fetch_requests":0},"service_tier":"standard","cache_creation":{"ephemeral_1h_input_tokens":118991,"ephemeral_5m_input_tokens":0},"inference_geo":"not_available","iterations":[{"input_tokens":1,"output_tokens":2550,"cache_read_input_tokens":139560,"cache_creation_input_tokens":618,"cache_creation":{"ephemeral_5m_input_tokens":0,"ephemeral_1h_input_tokens":618},"type":"message"}],"speed":"standard"},"modelUsage":{"claude-haiku-4-5-20251001":{"inputTokens":11676,"outputTokens":16,"cacheReadInputTokens":0,"cacheCreationInputTokens":0,"webSearchRequests":0,"costUSD":0.011756,"contextWindow":200000,"maxOutputTokens":32000},"claude-sonnet-4-6":{"inputTokens":40,"outputTokens":30693,"cacheReadInputTokens":3340385,"cacheCreationInputTokens":118991,"webSearchRequests":0,"costUSD":2.1765765000000004,"contextWindow":200000,"maxOutputTokens":32000}},"permission_denials":[],"terminal_reason":"completed","fast_mode_state":"off","uuid":"a72d4234-a865-41dd-893b-5a8a9ebd086c"}