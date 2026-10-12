# API Contract: Inertia Props and Endpoints

In this app the "API" between backend and frontend is mainly **Inertia page props**. Treat them as a typed contract.

## Inertia props

- The controller decides the prop shape explicitly. Use `->through(fn ($m) => [...])` for paginators, `->map->only(...)` for option lists, and arrays for single records. Never return raw Eloquent models, `$request->all()`, or `DB::select` results (which leak every column, including `payload` and `tenant_id`).
- The page declares a matching TypeScript interface. Keep snake_case keys as the server sends them (`deleted_at`, `organization_id`); don't rename them in the client.
- Nullable server fields are `T | null` in TypeScript, and optional relations are `{ … } | null`.
- Pagination: `->paginate(n)->withQueryString()` on the server, `Paginated<T>` from `@/types` on the client, rendered with `Shared/Pagination`.
- Filters: echo the active filters back as a `filters` prop (`Request::all('search', 'trashed')`) so the page can initialize its state.
- Shared props (`auth.user`, `flash.success`, `flash.error`, `errors`) come from `HandleInertiaRequests::share()` and are typed as `SharedPageProps`. Add new shared props there and to the type together, and keep them small, because they're sent on every request.
- Changing a prop's name or shape is a breaking change for that page. Update the controller, the page interface and the feature test (`assertInertia(... ->has('contacts.data.0', fn ($a) => $a->where(...)))`) in the same commit.

## Mutations

- Forms submit with `useForm` to named web routes. Success redirects with a flash message, and validation failures come back automatically as `errors`. Don't return JSON `{ ok: true }` from web routes.

## JSON endpoints

- Add a JSON endpoint only when Inertia can't do the job, for example `/ivr/data` for dashboard polling. Requirements:
  - it lives in `routes/web.php` behind `auth` (session auth),
  - it's named, and returns an explicitly shaped array,
  - and it's scoped through `IvrAccountContext`.
- Prefer `router.reload({ only: [...] })` over a separate JSON route for polling.
- The legacy `/api/ivr-legacy/<slug>/<action>` endpoints are unauthenticated, accept GET for writes and return inconsistent shapes (`{data, module, action}` or `{ok, endpoint}` or `{ok:false, err}`). Don't build new consumers against them. Remove each module's endpoints when it's migrated, after checking nothing calls them. Today, the only callers are dead legacy frontend files using the wrong `/ivr-legacy` prefix.
