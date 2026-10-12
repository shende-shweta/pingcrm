---
paths:
  - "resources/js/**"
---

# Frontend: React + TypeScript + Inertia

The frontend is **server-driven through Inertia**. There's no client-side router, no client data-fetching library and no global store. `react-router-dom` is in `package.json` but unused by the clean pages; don't introduce it.

## Data flow

- Data reaches a page as **props** from `Inertia::render`. Type them in the page (`interface Props extends SharedPageProps`) or in `types/index.ts` if several pages share them.
- Read shared data (`auth`, `flash`, `errors`) with `usePage<SharedPageProps>().props`. Known baseline error: `SharedPageProps` doesn't satisfy Inertia 2's `PageProps` constraint (TS2344), which needs a fix in `types/index.ts`, such as extending `PageProps` from `@inertiajs/core`.
- Navigation and filtering use `router.get(url, query, { preserveState: true, preserveScroll: true })`, with throttle or debounce for search inputs (see `Pages/Contacts/Index.tsx`). Use `pickBy` to drop empty params.
- Forms use `useForm`, with `form.post` / `form.put` and `form.errors` for server validation messages (`Pages/Contacts/Create.tsx`, `Edit.tsx`). Don't duplicate server validation on the client except for pure UX hints.
- Use partial reloads for polling: `router.reload({ only: ['stats', 'queues'] })` inside a `setInterval` that's **cleared in the effect cleanup** (`Pages/Ivr/Hub/Index.tsx`).
- **No raw `fetch` or `axios` in components.** If a JSON endpoint is truly needed (e.g. `/ivr/data`), wrap it in one typed function in `utils/` or `hooks/` with an `AbortController` and error handling, and test it.

## Components

- Function components and hooks only. No class components (`legacy/class/*.jsx` is the anti-pattern).
- No `any` on props, state or API results. Use `unknown` and narrow it when the shape really is unknown.
- `useEffect` must declare its full dependency list and clean up timers, listeners and in-flight requests. The legacy pages' `setInterval` without `clearInterval` is a bug, not a pattern to keep.
- Keys must be stable IDs from the data, never hard-coded indexes over generated rows.
- No `alert()`. Use flash messages (server `->with('success', …)`) or inline error UI.
- Reuse `Shared/` (`TextInput`, `SelectInput`, `LoadingButton`, `Pagination`, `SearchFilter`, `Icon`, `TrashedMessage`, …) before creating new primitives.
- Use the `<Head title="…" />` from `@inertiajs/react` on every page, and set `Page.layout = authenticatedLayout` for authenticated pages.

## Routing contract

- `Inertia::render('Ivr/CallFlow/Index')` must have `resources/js/Pages/Ivr/CallFlow/Index.tsx`. A mismatch throws `Inertia page not found` at runtime and isn't caught by `tsc`. Cover it with a feature test (`->component('Ivr/CallFlow/Index')`).
- Hard-coded URLs must match `routes/web.php`. Note that the legacy pages call `/ivr-legacy/...`, which doesn't exist (the real prefix is `/api/ivr-legacy`). Don't "fix" the URL; replace the call with Inertia props.

## Charts

- Reuse `components/ivr/IvrHubCharts.tsx` (`DonutChart`, `SimpleBarChart`, `StackedAreaChart`) before adding a charting dependency.
