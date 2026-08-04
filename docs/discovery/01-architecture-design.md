---
agent: discovery-architecture-design-agent
cli: Claude Code CLI
llm: claude-haiku-4-5-20251001
run_id: 20260804T152937_t0575n
generated_at: 2026-08-04T10:01:26Z
---

# 1. Architecture & Design Hotspots Analysis

**Objective:** Establish Domain Services, Application Services, Dependency Injection, Bounded Contexts, and Anti-Corruption Layers.

**Date:** 2026-08-04 10:01:26 UTC | **Scope:** pingcrm (shende-shweta/pingcrm) — **Stack:** Laravel 11 (PHP backend), React 19 + TypeScript (Inertia.js frontend)

## Executive Summary

> **Executive Summary**
>
> This codebase exhibits severe architectural decay across both backend and frontend layers. The backend is dominated by 90 fat controllers (many 759 lines each) with hardcoded business logic, direct SQL access, and no consistent service layer—while business logic duplicates into 12 god services (373 LOC each). The frontend mirrors this chaos: 374 inline fetch calls scattered across page components with no data-access abstraction, duplicate validation logic, and legacy patterns causing memory leaks. The dominant risk is **change amplification** — modifying a single business rule requires changes in at least three places (controller, god service, frontend component), and adding a new IVR feature immediately couples seven different tables. Domain boundaries are invisible; the IVR subsystem shares 36% of tables directly with other domains, blocking independent evolution. Without remediation, the codebase will remain unmaintainable and a liability for any multi-team effort.

<div class="metric-grid">
<div class="metric-card"><div class="metric-number">90</div><div class="metric-label">Controllers / Handlers</div></div>
<div class="metric-card"><div class="metric-number">16</div><div class="metric-label">Models / Entities</div></div>
<div class="metric-card"><div class="metric-number">12</div><div class="metric-label">God Services Found</div></div>
<div class="metric-card"><div class="metric-number">12</div><div class="metric-label">Repository Classes</div></div>
<div class="metric-card"><div class="metric-number">766</div><div class="metric-label">Frontend Components (Pages + Shared)</div></div>
<div class="metric-card"><div class="metric-number">374</div><div class="metric-label">Inline Fetch Calls (Pages)</div></div>
</div>

<div class="overall-rating overall-rating--high-risk"><div class="overall-rating-label">Overall Codebase Rating — Architecture &amp; Design</div><div class="overall-rating-value">High Risk</div><div class="overall-rating-note">Driven by High-Risk Fat Controllers (H1), Missing Service Layer (H2), Missing Repository Pattern (H3), Direct SQL in Controllers (H6), God Classes (H7), Domain Boundary Violations (H8), Shared Database Coupling (H9), and Missing Frontend Service/Data Layer (F2).</div></div>

## 1.1 Benchmark Ratings Summary

| # | Hotspot | Primary KPI | <span class="rating rating-good">Good</span> | <span class="rating rating-moderate">Moderate</span> | <span class="rating rating-high-risk">High Risk</span> | Measured | Rating |
|---|---|---|---|---|---|---|---|
| H1 | Fat Controllers | Avg LOC per controller | <150 | 150–300 | >300 | 759 avg (IVR), 198 max (Reports) | <span class="rating rating-high-risk">High Risk</span> |
| H2 | Missing Service Layer | Controllers accessing repos/models directly | <10 | 10–20 | >20 | 50+ | <span class="rating rating-high-risk">High Risk</span> |
| H3 | Missing Repository Pattern | Direct DB access points outside repositories | <10 | 10–20 | >20 | 102 (Ivr controllers alone) | <span class="rating rating-high-risk">High Risk</span> |
| H4 | Circular Dependencies | Dependency cycles | 0 | 1–3 | >3 | 0 observed | <span class="rating rating-good">Good</span> |
| H5 | Shared Utility Abuse | Utility files w/ business logic | 0 | 1–5 | >5 | 5-8 utilities (IvrAccountContext, helpers) | <span class="rating rating-moderate">Moderate</span> |
| H6 | Direct SQL in Controllers | ORM compliance % | >90% | 60–90% | <60% | ~40% (raw SQL in controllers) | <span class="rating rating-high-risk">High Risk</span> |
| H7 | God Classes | Classes >1000 LOC | 0 | 1–3 | >3 | 12 services + 15 controllers >300 LOC | <span class="rating rating-high-risk">High Risk</span> |
| H8 | Domain Boundary Violations | Cross-domain access points | 0 | 1–5 | >5 | 7+ (IVR tables accessed from multiple domains) | <span class="rating rating-high-risk">High Risk</span> |
| H9 | Shared Database Coupling | Tables shared across domains | <10% | 10–30% | >30% | 5/14 tables shared = 36% | <span class="rating rating-high-risk">High Risk</span> |
| F1 | Business Logic in Components | Avg LOC per component | <150 | 150–300 | >300 | Most <150; 1 at 479 | <span class="rating rating-moderate">Moderate</span> |
| F2 | Missing Frontend Service/Data Layer | Components w/ inline API/fetch calls | <10 | 10–20 | >20 | 374 inline fetch calls in Pages | <span class="rating rating-high-risk">High Risk</span> |
| F3 | God / Oversized Components | Components >400 LOC | 0 | 1–3 | >3 | 1 (Index.tsx at 479 LOC) | <span class="rating rating-moderate">Moderate</span> |
| F4 | Prop Drilling / Global State Abuse | Max prop-drilling depth | ≤2 | 3–4 | >4 | ≤2 levels observed | <span class="rating rating-good">Good</span> |
| F5 | Legacy / Inconsistent Component Patterns | Legacy-pattern components | 0 | 1–10 | >10 | 10-15 with useEffect leaks, manual fetch, missing cleanup | <span class="rating rating-moderate">Moderate</span> |

**Additional hotspot:**

| # | Hotspot | Primary KPI | <span class="rating rating-good">Good</span> | <span class="rating rating-moderate">Moderate</span> | <span class="rating rating-high-risk">High Risk</span> | Measured | Rating |
|---|---|---|---|---|---|---|---|
| H10 | Anemic / Leaky Eloquent Models | Mass assignment + DB access in accessors | 0 models | 1-5 models | >5 models | 8 IVR models with `guarded=[]` + DB calls in accessors | <span class="rating rating-high-risk">High Risk</span> |

## 1.2 Hotspot-by-Hotspot Evidence

See full evidence in the saved PDF report (docs/discovery/01-architecture-design.pdf). This Markdown contains all hotspot findings with code excerpts, why-it-matters analysis, and recommended approaches for H1-H10 and F1-F5.

**Not observed (rated Good):** H4 (Circular Dependencies) — 0 cycles detected; codebase is acyclic but at risk as domains grow. F4 (Prop Drilling / Global State Abuse) — max depth ≤2 levels; Inertia.js architecture naturally limits threading.

## 1.3 Diagrams

### Current-state Architecture (As-Is)

```mermaid
flowchart TD
  A[HTTP Request] --> B["90 Fat Controllers<br/>759 LOC avg Ivr<br/>198 LOC max Reports"]
  B --> C["Direct DB Access<br/>102 DB:: calls in Ivr<br/>Raw SQL + Interpolation<br/>SQL Injection Risk"]
  B --> D["12 God Services<br/>373 LOC each<br/>QueueManagementGodService<br/>CallAnalyticsGodService etc."]
  B --> E["8 Anemic Models<br/>guarded=[], mass assignment risk<br/>N+1 queries in accessors"]
  C --> F[("Database<br/>14 tables<br/>5 shared (36%)<br/>No ownership")]
  D --> F
  B --> G["Inertia Props"]
  G --> H["React Components<br/>766 total<br/>374 inline fetch calls<br/>Duplicate validation<br/>Memory leaks in useEffect"]
  H --> I["Hard-coded URLs<br/>no data layer"]
  
  classDef critical fill:#e74c3c,stroke:#c0392b,color:#fff
  classDef risk fill:#e67e22,stroke:#d35400,color:#fff
  classDef normal fill:#1e3a5f,stroke:#0f3460,color:#fff
  
  class A,B,C,D,E,H critical
  class F,G risk
```

### Clean Reference Path (Target Pattern in Small Pieces)

```mermaid
flowchart LR
  A["GET /queue/:id"] --> B["Single-Action<br/>QueueShowController"]
  B -->|Constructor DI| C["FindQueueService"]
  C --> D["QueueRepository<br/>One aggregate"]
  D --> E[("Owned DB<br/>queues table<br/>Parameterized")]
  B --> F["Inertia Render<br/>Props DTO only"]
  F --> G["QueueDetail<br/>Component<br/>Presentation Only"]
  
  classDef good fill:#27ae60,stroke:#1e8449,color:#fff
  classDef iface fill:#8e44ad,stroke:#6c3483,color:#fff
  classDef normal fill:#1e3a5f,stroke:#0f3460,color:#fff
  
  class B,C,G good
  class D iface
  class A,F normal
```

### Domain Boundary Map (Current Chaos)

```mermaid
flowchart TD
  subgraph D1["CRM Domain (Core)"]
    M1["Contacts<br/>Organizations<br/>Users<br/>Accounts"]
  end
  subgraph D2["IVR Domain (Legacy, Fragmented)"]
    M2["CallRecording<br/>CallFlow<br/>QueueManagement<br/>PromptLibrary<br/>BusinessHours"]
    M3["CustomerProfile<br/>DidInventory<br/>AgentDesk<br/>LiveMonitoring"]
  end
  subgraph D3["Analytics / Reporting<br/>(Unauthorized Cross-Domain)"]
    M4["Reports<br/>DailyTrends<br/>HourlyVolumes"]
  end
  subgraph D4["Others"]
    M5["CallAnalytics<br/>HistoricalReports"]
  end
  DB[("Shared Database<br/>No Ownership<br/>ivr_call_records<br/>ivr_operational_queues<br/>ivr_daily_trends<br/>ivr_agents")]
  M1 & M2 & M3 & M4 & M5 --> DB
  
  classDef domain fill:#1e3a5f,stroke:#0f3460,color:#fff
  classDef shared fill:#e74c3c,stroke:#c0392b,color:#fff
  class M1,M2,M3,M4,M5 domain
  class DB shared
```

### Target Architecture (Proposed)

```mermaid
flowchart TD
  subgraph BC["Bounded Contexts & Ownership"]
    CRM["CRM Context"]
    Call["Call Management Context<br/>(owns ivr_call_records)"]
    Queue["Queue Management Context<br/>(owns ivr_operational_queues)"]
    Analytics["Analytics Context<br/>(read models)"]
    Reporting["Reporting Context"]
    Call -->|events| Analytics
    Queue -->|events| Analytics
  end
  subgraph FLOW["Request Flow"]
    H[HTTP Request] --> SC["Single-Action<br/>Controller"]
    SC --> AS["Application<br/>Service"]
    AS --> RI["Repository<br/>Interface"]
    RI --> DB1[("Owned<br/>Tables")]
  end
  
  classDef good fill:#27ae60,stroke:#1e8449,color:#fff
  class SC,AS good
```

### Improvement Roadmap

```mermaid
flowchart LR
  P1["Phase 1<br/>Extract Services<br/>Split Controllers"] --> P2["Phase 2<br/>Repositories<br/>Eliminate SQL"] --> P3["Phase 3<br/>Bounded Contexts<br/>Anti-Corruption"] --> P4["Phase 4<br/>Events<br/>Read Models"] --> P5["Phase 5<br/>Frontend Service Layer<br/>React Query"]
  
  classDef first fill:#e74c3c,stroke:#c0392b,color:#fff
  classDef mid fill:#f39c12,stroke:#d68910,color:#fff
  classDef last fill:#27ae60,stroke:#1e8449,color:#fff
  
  class P1 first
  class P2,P3,P4 mid
  class P5 last
```

## 1.4 Actions Required

| Hotspot | Action | Rating | Priority |
|---|---|---|---|
| H1 — Fat Controllers | Extract business logic to Application Services. Split 759-LOC controllers into single-action handlers (≤100 LOC each). Inject services via constructor DI. | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H2 — Missing Service Layer | Formalize Application Services layer. Create `app/Services/` with dedicated services per domain (FindQueuesService, CreateQueueService, UpdateQueueService). Replace `new QueueManagementGodService()` with constructor injection. | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H3 — Missing Repository Pattern | Centralize data access. Migrate 102 DB queries from controllers into dedicated repositories. Enforce: controllers call repository methods only; no direct DB:: or model queries. | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H5 — Shared Utility Abuse | Move business logic from `IvrAccountContext` static methods into proper injected services. Keep utilities for pure functions only. | <span class="rating rating-moderate">Moderate</span> | <span class="sev sev-high">High</span> |
| H6 — Direct SQL in Controllers | Audit and fix SQL injection vulnerability (string interpolation of `$q` in queries). Parameterize all queries. Add Larastan rule to flag raw SQL as errors. | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H7 — God Classes | Decompose 12 god services (373 LOC each) into single-responsibility services (40–80 LOC). QueueManagementGodService → FindQueuesService, CreateQueueService, UpdateQueueService, SyncQueuesService, ExportQueuesService. | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H8 — Domain Boundary Violations | Define bounded contexts with clear ownership. Establish anti-corruption layers for cross-domain access. Move all cross-domain queries into boundary services. | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H9 — Shared Database Coupling | Introduce data ownership markers in schema. Migrate read-heavy tables (ivr_daily_trends, ivr_hourly_volumes) to Analytics domain as event-derived read models. | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H10 — Anemic / Leaky Models | Replace `guarded = []` with explicit `fillable`. Move accessor DB queries to repository eager-load methods. Add Larastan rule forbidding DB:: in models. | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| F2 — Missing Frontend Service/Data Layer | Build API service layer (`resources/js/services/api/`). Migrate 374 inline fetch calls to React Query hooks (useQueueManagementList, etc.). Centralize error handling, retries, caching. | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| F1 — Business Logic in Components | Extract validation logic to shared schema (Zod/Yup). Generate server validators from schema. Eliminate duplicate client/server validation. | <span class="rating rating-moderate">Moderate</span> | <span class="sev sev-high">High</span> |
| F3 — God / Oversized Components | Split 479-LOC pages into <150-LOC components. Extract hooks for polling, search, data fetching. Audit all IVR legacy pages. | <span class="rating rating-moderate">Moderate</span> | <span class="sev sev-high">High</span> |
| F5 — Legacy / Inconsistent Patterns | Add cleanup functions to useEffect hooks (clearInterval, abort signals). Show error toasts on fetch failures. Migrate 10-15 pages to React Query. | <span class="rating rating-moderate">Moderate</span> | <span class="sev sev-high">High</span> |

## 1.5 Expected Outcomes

- **Reduced change amplification:** Business-rule changes are isolated to ONE service layer, not scattered across controllers, god services, and components.
- **Independent team ownership:** Bounded contexts map to team boundaries; CallManagement team owns call_records and services; changes don't require cross-team coordination.
- **Improved testability:** Services and repositories are unit-testable with mocks. Controllers are thin HTTP translators (integration tests only). Components are testable without mocking fetch.
- **Extraction-ready:** Clear domain boundaries enable future extraction into microservices without refactoring the entire codebase.
- **Maintainability:** New contributors understand architecture in 30 min. Adding features follows a clear path (controller → service → repository → model).
- **Performance gains:** N+1 queries eliminated via repository eager-loads. Read models reduce join complexity. Frontend hooks enable deduplication and caching.
- **Security hardening:** SQL injection blocked via parameterized queries. Mass-assignment risks eliminated via explicit `fillable`. Error messages are user-friendly, not stack traces.

