# Performance

## Backend

- **N+1:** eager-load with `with()` / `withCount()` (as in `ContactsController::index` with `->with('organization')`). Delete query-running model accessors (`legacyComputedFieldN`) rather than calling them in loops.
- **Pagination:** list pages use `->paginate(10)->withQueryString()`. Never `->get()` an unbounded table for a page. Cap option lists (`IvrAccountContext::organizationOptions` uses `limit(200)`).
- **Select only what you render:** use `get(['id', 'name'])` or map to explicit props. Avoid `select *` and avoid sending the `payload` JSON column unless it's displayed.
- **No blocking calls in requests:** remove `sleep()` (god services). Move slow external syncs (CRM, webhooks) to queued jobs.
- **No process-global caches:** `public static $sharedRuntimeCache` leaks across requests in long-lived workers and isn't tenant-safe. Use `Cache::` with tenant-scoped keys if caching is needed.
- **Indexes:** filter and sort columns used by migrated modules (`account_id`, `organization_id`, `name`, `started_at`) need indexes. Add them in the module's migration.

## Frontend

- **Polling:** use `router.reload({ only: [...] })` at a reasonable interval (the hub uses 20s), clean it up on unmount, and consider pausing while `document.hidden`. Never stack intervals by re-creating them on every keystroke (the legacy `useEffect(..., [search])` without cleanup does exactly that).
- **Search inputs:** throttle or debounce before `router.get` (`lodash/throttle` at 150ms in `Pages/Contacts/Index.tsx`).
- **Partial props:** for expensive dashboard props, use `only` reloads and, on the server, closures or lazy props so unused props aren't computed.
- **Bundle size:** `app.tsx` uses a lazy `import.meta.glob`, so each page is its own chunk. Deleting the about 430 unrendered legacy pages (and other dead files) cuts build time and `dist` size; take the opportunity during migration. Import lodash by path, and don't add heavy chart or UI libraries while `IvrHubCharts` covers the need.
- **Rendering:** use stable keys, and memoize derived data (`useMemo`) only when profiling or obvious cost justifies it.
