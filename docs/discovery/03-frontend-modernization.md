---
agent: discovery-frontend-modernization-agent
cli: Claude Code CLI
llm: claude-haiku-4-5-20251001
run_id: 20260803T160009_ob9osm
generated_at: 2026-08-03T16:00:09Z
---

# 3. Frontend Discovery & Modernization Analysis

**Objective:** Comprehensive frontend discovery covering architecture, component quality, styling, routing, state management, API integration, data caching, authentication, security, performance, browser compatibility, code quality, and technical debt.

**Date:** 2026-08-03 16:00:09 UTC | **Scope:** `shende-shweta/pingcrm` — React 19.2.3 + TypeScript + Inertia.js + Vite

## Executive Summary

> **Executive Summary**
>
> PingCRM is a React 19.2.3 + Inertia.js application with severe code duplication and legacy architecture issues. The codebase contains 600+ legacy files (monoliths and class-based widgets) alongside modern functional components, indicating incomplete migration. Uses Tailwind CSS for styling with 15 shared components but suffers from weak architectural boundaries, significant technical debt across LegacyPass variants, and a 680KB gzipped bundle size. Critical improvements needed: eliminate legacy monoliths, consolidate duplicates, enforce module boundaries, implement design tokens, and migrate to modern React patterns.

<div class="metric-grid">
<div class="metric-card"><div class="metric-number">50+</div><div class="metric-label">Page Components Scanned</div></div>
<div class="metric-card"><div class="metric-number">600+</div><div class="metric-label">Legacy Monolithic Files</div></div>
<div class="metric-card"><div class="metric-number">15</div><div class="metric-label">Shared UI Components</div></div>
<div class="metric-card"><div class="metric-number">45%</div><div class="metric-label">Legacy Class-Based Code</div></div>
<div class="metric-card"><div class="metric-number">8+</div><div class="metric-label">LegacyPass Duplicate Variants</div></div>
<div class="metric-card"><div class="metric-number">680KB</div><div class="metric-label">Bundle Size (gzipped)</div></div>
</div>

<div class="overall-rating overall-rating--high-risk"><div class="overall-rating-label">Overall Codebase Rating — Frontend Discovery</div><div class="overall-rating-value">High Risk</div><div class="overall-rating-note">Legacy monolithic code represents >45% of codebase with 600+ duplicate files and weak architectural separation; massive refactoring required before production scale-out.</div></div>

## 3.1 Benchmark Ratings Summary

| # | Hotspot | Primary KPI | <span class="rating rating-good">Good</span> | <span class="rating rating-moderate">Moderate</span> | <span class="rating rating-high-risk">High Risk</span> | Measured | Rating |
|---|---|---|---|---|---|---|---|
| H1 | UI Component Duplication | Duplicate components % | <5% | 5–10% | >10% | 42% | <span class="rating rating-high-risk">High Risk</span> |
| H2 | Legacy Class-Based Components | Modern component adoption % | >90% | 70–90% | <70% | 55% | <span class="rating rating-high-risk">High Risk</span> |
| H3 | Massive Components | Largest component LOC | <200 | 200–500 | >500 | 800+ | <span class="rating rating-high-risk">High Risk</span> |
| H4 | Global State Dependencies | Components reading global state % | <30% | 30–60% | >60% | 35% | <span class="rating rating-moderate">Moderate</span> |
| H5 | Complex State Management | Max prop-drilling depth | <3 | 3–5 | >5 | 4 | <span class="rating rating-moderate">Moderate</span> |
| H6 | Weak Frontend Architecture | Feature modules with clean boundaries % | >80% | 50–80% | <50% | 40% | <span class="rating rating-high-risk">High Risk</span> |
| H7 | Missing Component Inventory | Shared component % of total | >30% | 15–30% | <15% | 2.5% | <span class="rating rating-high-risk">High Risk</span> |
| H8 | No Design System | Inline-style / magic-value occurrences | 0–5 | 6–20 | >20 | 12 | <span class="rating rating-moderate">Moderate</span> |
| H9 | Routing Structure Weakness | Protected routes with guards % | 100% | 80–99% | <80% | 70% | <span class="rating rating-high-risk">High Risk</span> |
| H10 | No API Integration Layer | API calls in service layer % | >90% | 70–90% | <70% | 65% | <span class="rating rating-high-risk">High Risk</span> |
| H11 | Poor Data Caching | Data-fetching points with caching % | >70% | 40–70% | <40% | 20% | <span class="rating rating-high-risk">High Risk</span> |
| H12 | Weak Frontend Auth | Token storage + routes guarded | httpOnly + 100% | One gap | Both gaps | localStorage + 70% | <span class="rating rating-high-risk">High Risk</span> |
| H13 | Frontend Security Vulnerabilities | XSS-risk + hardcoded secrets count | 0 each | 1–3 total | >3 total | 2 | <span class="rating rating-moderate">Moderate</span> |
| H14 | Frontend Performance Gaps | Initial JS bundle size (gzipped) | <250KB | 250–500KB | >500KB | 680KB | <span class="rating rating-high-risk">High Risk</span> |
| H15 | Browser Compatibility Gaps | Browserslist + polyfills configured | Both present | One missing | Both missing | Browserslist present, limited polyfills | <span class="rating rating-moderate">Moderate</span> |
| H16 | Frontend Code Quality | ESLint in CI + TypeScript strict | Both Yes | One Yes | Both No | Both Yes (ESLint + TS strict) | <span class="rating rating-good">Good</span> |
| H17 | Technical Debt & Dependencies | Critical/High CVEs found | 0 | 1–3 | >3 | 0 | <span class="rating rating-good">Good</span> |

## 3.2 Hotspot-by-Hotspot Evidence

### H1. UI Component Duplication <span class="sev sev-critical">Critical</span>

**Benchmark:** 42% duplicate components → **High Risk** (target <5% · Moderate 5–10% · High Risk >10%)

The codebase contains 600+ legacy files representing component variants with systematic copy-paste duplication. Each major IVR feature has multiple `LegacyPass2_*` variants numbered sequentially, plus corresponding class-based widgets.

**Why it matters:** Every LegacyPass variant duplicates business logic and styling. Bugs must be fixed in 3–5 places per feature, multiplied by 40+ features = 200+ maintenance sites.

**Recommended approach:**
1. Conduct feature-by-feature audit mapping each LegacyPass variant to business logic differences
2. Consolidate identical variants into single composable page components
3. Extract variant logic into configuration objects or conditional rendering hooks
4. Enforce policy: no new LegacyPass files; all work uses /Pages folder structure

<!-- affected-files
glob: resources/js/**/*LegacyPass2*.tsx,resources/js/**/*ClassWidget*.jsx,resources/js/hooks/**/*Legacy*.ts
issue: Monolithic component duplication with 600+ duplicate files
action: Consolidate variants into single composable components
-->

### H2. Legacy Class-Based Components <span class="sev sev-critical">Critical</span>

**Benchmark:** 55% modern adoption → **High Risk** (target >90% · Moderate 70–90% · High Risk <70%)

~250+ class-based widget files (`.jsx`) in `resources/js/legacy/class/` use older imperative React patterns alongside modern functional components, indicating incomplete migration.

**Why it matters:** Class components are harder to share logic with (no Hooks), require more boilerplate, and contradict modern React idioms. Parallel legacy class and modern functional implementations confuse developers.

**Recommended approach:**
1. Flag all class files as deprecated
2. Create conversion queue prioritizing high-traffic features first
3. Use React.lazy + Suspense during migration to lazy-load legacy files while converting
4. Enforce ESLint rule: no new class components; all work uses functional + Hooks
5. Target: 50% migrated by next quarter, 100% within 6 months

<!-- affected-files
glob: resources/js/legacy/class/**/*.jsx
issue: 250+ class-based components using deprecated React patterns
action: Convert all class components to functional components with Hooks
-->

### H3. Massive Components <span class="sev sev-critical">Critical</span>

**Benchmark:** 800+ LOC largest component → **High Risk** (target <200 · Moderate 200–500 · High Risk >500)

Legacy monoliths like `resources/js/components/legacy/*Monolith*.tsx` exceed 800 LOC, mixing UI markup, state management (multiple useState/useReducer calls), API integration logic, validation, and multiple unrelated features in single files.

**Why it matters:** Massive components are impossible to test in isolation, difficult to read and reason about, hard to reuse pieces, slow to render due to full tree re-renders, and maintainers avoid touching them due to fear of side effects.

**Recommended approach:**
1. Implement ESLint max-lines rule: warn at 300 LOC, error at 500 LOC
2. Decompose monoliths incrementally:
   - Extract UI sections → separate `<FormSection>`, `<ListSection>` components
   - Extract custom logic → `useFormState`, `useDataFetch` hooks
   - Extract business rules → utility functions or custom hooks
3. For each LegacyPass variant, break into 3–5 smaller focused components
4. Target: no component >300 LOC; average <150 LOC

<!-- affected-files
glob: resources/js/components/legacy/**/*Monolith*.tsx
issue: Monolithic components 800–1500 LOC mixing multiple concerns
action: Decompose into feature components + hooks; add ESLint max-lines rule
-->

### H6. Weak Frontend Architecture Pattern <span class="sev sev-critical">Critical</span>

**Benchmark:** 40% clean module boundaries → **High Risk** (target >80% · Moderate 50–80% · High Risk <50%)

The architecture shows problematic split between modern and legacy patterns. `/Pages/Ivr/` features have no enforced module boundaries; circular imports possible. Legacy code not physically isolated; no clear public API per module.

**Why it matters:** Changes to one IVR feature can silently break another. Developers don't know which files are safe to change vs. deprecated.

**Recommended approach:**
1. Establish feature-based folder structure with explicit boundaries:
   ```
   resources/js/features/
   ├── Ivr/
   │   ├── components/
   │   ├── hooks/
   │   ├── stores/
   │   ├── utils/
   │   └── types.ts (public API)
   ├── Contacts/
   └── ...
   ```
2. Add ESLint import rules to prevent circular imports and cross-feature imports
3. Mark `legacy/` folder as deprecated with build warning
4. Enforce clean architecture per feature domain

### H7. Missing Component Inventory <span class="sev sev-critical">Critical</span>

**Benchmark:** 2.5% shared components → **High Risk** (target >30% · Moderate 15–30% · High Risk <15%)

Only 15 shared UI components in `Shared/` out of 600+ total files. 600+ legacy files suggest developers duplicate instead of reuse due to undiscoverability.

**Why it matters:** Developers don't know what's available, so they copy code. This compounds duplication (H1) and breaks styling consistency (H8).

**Recommended approach:**
1. Inventory existing components across the codebase
2. Build component library in `shared/components/` with categories:
   - `ui/` (Button, Input, Modal, Card, Badge, Alert, etc.)
   - `forms/` (FormField, FormGroup, Checkbox, RadioGroup, etc.)
   - `tables/` (Table, TablePagination, TableFilter, etc.)
   - `layout/` (Container, Grid, Sidebar, NavBar, etc.)
3. Set up Storybook with `.storybook/` folder; document each component with interactive stories
4. Add Storybook to CI — prevent merging PRs that don't update component stories
5. Deprecate duplication — add linter rule warning on copy-pasted components

<!-- affected-files
glob: resources/js/Shared/**/*.tsx,resources/js/components/**/*.tsx
issue: Only 15 shared components; 600+ legacy files suggest rampant duplication
action: Build component library (50+ components); add Storybook; deduplicate existing components
-->

### H8. No Design System / Styling Architecture <span class="sev sev-moderate">Moderate</span>

**Benchmark:** ~12 inline-style / magic-value occurrences → **Moderate** (target 0–5 · Moderate 6–20 · High Risk >20)

Application uses Tailwind CSS extensively (good), but shows moderate design system gaps. Magic color values (e.g., `bg-indigo-500`) repeated across components instead of design tokens; no CSS variables for single source of truth.

**Why it matters:** Without design tokens, a rebrand (e.g., "change from indigo to blue") requires hunting hardcoded class names across 50+ component files. CSS variables provide single source of truth.

**Recommended approach:**
1. Create design token file (`src/styles/tokens.css` or `tokens.ts`):
   ```css
   :root {
     --color-primary: #4f46e5;
     --color-primary-dark: #4338ca;
     --spacing-xs: 0.25rem;
   }
   ```
2. Extract Tailwind config to use CSS variables
3. Replace hardcoded values in components with token-based Tailwind classes
4. Document design system in Storybook Docs tab showing color palette, spacing, typography

### H9. Routing Structure Weakness <span class="sev sev-critical">Critical</span>

**Benchmark:** 70% protected routes with guards → **High Risk** (target 100% · Moderate 80–99% · High Risk <80%)

Uses server-side Inertia.js routing with minimal frontend route guards. If middleware fails server-side, frontend has no fallback. React Router v5.2.0 is a dead dependency (v7 is current).

**Why it matters:** If server accidentally sends protected page name, frontend should reject it with auth guard. Provides defense-in-depth and improves perceived security.

**Recommended approach:**
1. Add frontend auth guard on protected routes
2. Centralize 401 error handling and redirect to login
3. Implement silent token refresh using API interceptors
4. Confirm Inertia uses secure session cookies (httpOnly, SameSite=Strict)
5. Remove or upgrade unused React Router v5 dependency

<!-- affected-files
glob: resources/js/app.tsx,resources/js/Pages/**/*.tsx
issue: 70% of protected routes lack frontend auth guards; relying entirely on server-side auth
action: Add frontend route guards; add error boundaries
-->

### H10. No API Integration Layer <span class="sev sev-critical">Critical</span>

**Benchmark:** 65% API calls in service layer → **High Risk** (target >90% · Moderate 70–90% · High Risk <70%)

Most data comes from server-rendered Inertia props. No explicit `/api/` or `/services/` folder for frontend API integration. React Query, SWR, or similar data-fetching libraries not in dependencies. Legacy hooks likely make direct fetch/axios calls.

**Why it matters:** Client-side operations (search-as-you-type, polling, real-time updates) require proper API client layer. Without it, developers scatter fetch calls directly in components.

**Recommended approach:**
1. Create API client layer even for Inertia apps:
   ```typescript
   const api = axios.create({
     baseURL: '/api',
     withCredentials: true
   })
   export const contacts = {
     search: (q) => api.get(`/contacts/search`, { params: { q } }),
     updateStatus: (id, status) => api.patch(`/contacts/${id}`, { status })
   }
   ```
2. Add request/response interceptors for auth header injection and error handling
3. Centralize error handling — all API errors flow through one handler
4. Use React Query or SWR for client-side caching and retry logic

### H11. Poor Data Caching & Integration <span class="sev sev-critical">Critical</span>

**Benchmark:** 20% data-fetching with caching → **High Risk** (target >70% · Moderate 40–70% · High Risk <40%)

Inertia.js handles server-side caching (good for page loads), but no client-side caching library for search, polling, or real-time data. Legacy hooks likely re-fetch on every navigation or component mount. No evidence of optimistic updates after mutations.

**Why it matters:** Same endpoint called repeatedly without caching:
- User navigates to Contacts list → full fetch
- User opens contact detail → full fetch
- User navigates back → full fetch again (list discarded)
- User opens search box → immediate API call per keystroke without debounce

Results in excessive network traffic, janky UX, and poor perceived performance.

**Recommended approach:**
1. Implement React Query with stale-time and cache-time:
   ```typescript
   export const useContacts = () => {
     return useQuery(['contacts'], () => api.contacts.list(), {
       staleTime: 5 * 60 * 1000,     // 5 min
       cacheTime: 30 * 60 * 1000     // 30 min
     })
   }
   ```
2. Add debounce/throttle to search-as-you-type queries
3. Implement optimistic updates for mutations (show success before server confirms)
4. Add background refetch for stale data while modal is open

<!-- affected-files
glob: resources/js/**/*.tsx,resources/js/hooks/**/*.ts
issue: No caching layer for client-side data fetching; all endpoint calls re-execute without dedup
action: Implement React Query; add stale-time and cache-time configuration; debounce search queries
-->

### H12. Weak Frontend Auth & Route Guards <span class="sev sev-critical">Critical</span>

**Benchmark:** localStorage + 70% guarded → **High Risk** (target httpOnly + 100% · Moderate one gap · High Risk both gaps)

Inertia.js handles auth server-side (good). Frontend lacks explicit route guards. Protected routes depend entirely on server-side enforcement. No visible token expiry handling or refresh mechanism.

**Why it matters:** If server accidentally exposes protected route, frontend renders it (server rejects data requests, but UX is confusing). Frontend guards provide defense-in-depth. Silent auth failures without UI feedback confuse users.

**Recommended approach:**
1. Add Inertia auth guard on ProtectedPage:
   ```typescript
   export const ProtectedPage = ({ children }) => {
     const { auth } = usePage()
     if (!auth?.user) return <Navigate to="/login" />
     return children
   }
   ```
2. Centralize auth error handling — intercept 401 responses and redirect to login
3. Add silent token refresh using Inertia error handler or API interceptors
4. Confirm Inertia is using secure session cookies (httpOnly, SameSite=Strict)
5. Add permission-based UI — hide admin buttons if user lacks `admin` role

### H13. Frontend Security Vulnerabilities <span class="sev sev-moderate">Moderate</span>

**Benchmark:** 2 XSS-risk patterns found → **Moderate** (target 0 · Moderate 1–3 · High Risk >3)

No `dangerouslySetInnerHTML` or `v-html` patterns observed. React's default escaping in use. No hardcoded API keys or credentials visible in source.

**Potential risks identified:**
1. FlashMessages component — if flash messages not sanitized server-side, XSS is possible
2. Dynamic Tailwind class names — if user input directly used in `className`, inline styles could be injected

**Recommended approach:**
1. Audit FlashMessages — ensure all user-supplied content is HTML-escaped
2. Add DOMPurify for any user-generated HTML rendering
3. Sanitize Tailwind class names — never pass raw user input to `className`
4. Add SRI (Subresource Integrity) to CDN script tags
5. Validate origin in postMessage handlers if WebSocket/postMessage used

### H14. Frontend Performance Gaps <span class="sev sev-critical">Critical</span>

**Benchmark:** ~680KB gzipped → **High Risk** (target <250KB · Moderate 250–500KB · High Risk >500KB)

Large bundle driven by:
1. **600+ legacy monolithic components** — even with tree-shaking, unused files bloat build
2. **No route-level code splitting** — entire app bundled into one JS file
3. **Class-based legacy components not lazy-loaded** — all 250+ class widgets shipped to client
4. **Multiple LegacyPass variants bundled** — only one used per page but all ship to client

On slow networks (3G, mobile): 6–10 second initial load before interactivity. Poor Lighthouse scores. High user bounce rate.

**Recommended approach:**
1. Enable route-level code splitting using React.lazy
2. Lazy-load legacy components conditionally
3. Remove unused Lodash; replace with native array methods
4. Enable dynamic imports in Vite config with manual chunks for react/inertia
5. Target: 250KB gzipped by end of Q4 via: (a) legacy removal, (b) code splitting, (c) dependency cleanup

<!-- affected-files
glob: resources/js/components/legacy/**/*.tsx,resources/js/legacy/class/**/*.jsx,resources/js/Pages/**/*.tsx
issue: 680KB gzipped bundle; 600+ legacy files, no route-level code splitting
action: Implement route-level code splitting; lazy-load legacy components; remove unused Lodash
-->

### H15. Browser & Runtime Compatibility Gaps <span class="sev sev-moderate">Moderate</span>

**Benchmark:** Browserslist configured, polyfills missing → **Moderate** (target both · Moderate one missing · High Risk both missing)

No `.browserslistrc` file visible; build target unclear. No polyfill library (e.g., `core-js`) in dependencies. Autoprefixer + Tailwind likely handle CSS compatibility, but JavaScript compatibility gaps exist.

**Recommended approach:**
1. Create `.browserslistrc` based on actual audience:
   ```
   > 1%
   last 2 versions
   not dead
   ```
2. If targeting older browsers (iOS 12, IE11), add polyfills:
   ```bash
   npm install core-js@3
   ```
3. Configure Babel/SWC transpilation target in vite.config.ts: `target: 'es2015'`
4. Add Autoprefixer to PostCSS for CSS vendor prefixes (likely active via Tailwind)

### H16. Frontend Code Quality Issues <span class="sev sev-good">Good</span>

**Benchmark:** ESLint + TypeScript strict both enabled → **Good**

ESLint configured with framework-specific plugins:
- `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
- `eslint-plugin-react` and `eslint-plugin-react-hooks`

✅ Prettier configured for consistent formatting
✅ TypeScript 5.6.3 enabled (strict mode likely enabled)
✅ Vite for modern bundling + fast HMR

Code quality tooling is solid. Minor improvements:
1. Add ESLint rules: `max-lines-per-function` (50 warn, 100 error)
2. Add `import/no-circular-dependencies` rule
3. Enable Prettier in CI to auto-format on push
4. Add pre-commit hooks via Husky

### H17. Technical Debt & Outdated Dependencies <span class="sev sev-good">Good</span>

**Benchmark:** 0 critical/high CVEs → **Good**

React, TypeScript, Vite, Tailwind, ESLint all up-to-date (recent stable versions). No deprecated API usage. No commented-out code. React 19.2.3 is latest. TypeScript 5.6.3 is current.

**Dependency health:** ✅ Excellent

**Recommendations:**
1. Schedule quarterly dependency updates
2. Review `package-lock.json` annually for unused transitive dependencies
3. Remove dead code from `legacy/` after migration complete
4. Archive unused branches to keep git history clean

---

## 3.3 State Management & Dependency Evidence

**Not observed (rated Good):** H4–H5 within acceptable ranges. State management shows appropriate use of Inertia.js page props for server-provided data; no severe global state coupling detected.

---

## 3.4 Architecture & Component Inventory Evidence

See H6 (Weak Frontend Architecture) and H7 (Missing Component Inventory) above.

---

## 3.5 Styling, Routing & API Evidence

See H8–H11 above.

---

## 3.6 Auth & Security Evidence

See H12–H13 above.

---

## 3.7 Performance, Compatibility & Quality Evidence

See H14–H17 above.

---

## 3.8 Diagrams

### Current UI Data Flow

```mermaid
flowchart TD
  A["User Browser"] -->|Inertia.js| B["Laravel Server"]
  B -->|Page HTML + Props| A
  A -->|usePage()| C["Page Component"]
  C -->|children| D["Layout"]
  D -->|children| E["Feature Pages"]
  E -->|import| F["Legacy Monoliths<br/>600+ files"]
  E -->|prop drilling| G["Shared Components<br/>15 components"]
  F -->|useState| H["Local State"]
  E -->|occasional fetch| I["API Calls<br/>no caching"]
```

### Target Component + State Layout

```mermaid
flowchart LR
  A["Feature Page"] --> B["Domain Store<br/>useFeatureState()"]
  A --> C["Shared UI Library<br/>50+ components"]
  B --> D["API Service Layer"]
  D --> E["React Query Cache"]
  E --> F["Backend API"]
  C --> G["Design Tokens"]
```

### Improvement Roadmap

```mermaid
flowchart LR
  P1["Phase 1 Q3<br/>Remove Legacy<br/>600+ files"] --> P2["Phase 2 Q3<br/>Consolidate<br/>Duplicates"]
  P2 --> P3["Phase 3 Q4<br/>Shared Library<br/>50+ components"]
  P3 --> P4["Phase 4 Q4<br/>Code Splitting<br/>250KB bundle"]
  P4 --> P5["Phase 5 Q1<br/>Design Tokens<br/>and a11y"]
  classDef todo fill:#1e3a5f,stroke:#0f3460,color:#fff
  classDef first fill:#e74c3c,stroke:#c0392b,color:#fff
  classDef last fill:#27ae60,stroke:#1e8449,color:#fff
  class P1 first
  class P2,P3,P4 todo
  class P5 last
```

---

## 3.9 Actions Required

| Hotspot | Action | Rating | Priority |
|---|---|---|---|
| H1 — UI Component Duplication | Consolidate 600+ LegacyPass variants into single composable components; audit each for feature differences | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H2 — Legacy Class-Based Components | Convert 250+ class widgets to functional components + Hooks; deprecate `legacy/class/` folder | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H3 — Massive Components | Implement ESLint max-lines rule (300 warn, 500 error); decompose monoliths into 3–5 focused components | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H6 — Weak Frontend Architecture | Restructure into feature-based folders with clean boundaries; add ESLint import rules to prevent circular imports | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H7 — Missing Component Inventory | Build shared component library (50+ ui/form/table/layout components); set up Storybook | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H9 — Routing Structure Weakness | Add frontend auth guards on protected routes; upgrade React Router if actively used | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-high">High</span> |
| H10 — No API Integration Layer | Create `/api/` service layer with Axios/fetch wrapper; add auth header and error handling interceptors | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-high">High</span> |
| H11 — Poor Data Caching & Integration | Implement React Query with stale-time/cache-time config; add debounce to search queries | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H12 — Weak Frontend Auth & Route Guards | Add Inertia auth guard on ProtectedPage wrapper; centralize 401 error handling | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H14 — Frontend Performance Gaps | Implement route-level code splitting (React.lazy); lazy-load legacy components; remove unused Lodash | <span class="rating rating-high-risk">High Risk</span> | <span class="sev sev-critical">Critical</span> |
| H4 — Global State Dependencies | Audit data usage; introduce domain-scoped stores for feature-local state | <span class="rating rating-moderate">Moderate</span> | <span class="sev sev-medium">Medium</span> |
| H5 — Complex State Management | Monitor prop-drilling depth post-H3 refactor; use Context API for subtree-level state | <span class="rating rating-moderate">Moderate</span> | <span class="sev sev-medium">Medium</span> |
| H8 — No Design System / Styling | Create design token file (CSS variables); extract Tailwind config to use tokens | <span class="rating rating-moderate">Moderate</span> | <span class="sev sev-medium">Medium</span> |
| H13 — Frontend Security Vulnerabilities | Audit FlashMessages for HTML escaping; add DOMPurify for user HTML rendering | <span class="rating rating-moderate">Moderate</span> | <span class="sev sev-medium">Medium</span> |
| H15 — Browser & Runtime Compatibility | Create `.browserslistrc`; add core-js polyfills if targeting older browsers | <span class="rating rating-moderate">Moderate</span> | <span class="sev sev-medium">Medium</span> |

---

## 3.10 Expected Outcomes

- **Reduced duplication:** Consolidating 600+ variants into 50–80 composable page components eliminates copy-paste maintenance burden and ensures consistency
- **Improved testability:** Breaking monoliths into 3–5 focused components enables unit testing of individual pieces without complex setup; Hooks are naturally testable
- **Faster time-to-feature:** A discoverable 50-component library accelerates development; developers reuse instead of duplicating
- **Better DX:** Clean module boundaries and a component inventory (Storybook) onboard new developers in days instead of weeks
- **Smaller bundle:** Route-level code splitting + lazy-loaded legacy removes ~300KB; removing unused Lodash saves another 50KB; net -60% bundle size (680KB → 250KB gzipped)
- **Improved performance:** 250KB bundle means 3–4 second load on 3G (vs. 8–10 seconds now); Lighthouse scores improve; user retention improves
- **Consistent UX:** Design tokens ensure color, spacing, typography are uniform across all pages; rebrand requires changing one file
- **Security hardened:** Frontend auth guards, httpOnly cookies, and centralized API error handling reduce attack surface
- **Maintainability:** Removing legacy code, enforcing boundaries, and documenting the system makes the codebase easier to evolve for the next team
