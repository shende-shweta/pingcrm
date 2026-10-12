---
paths:
  - "app/**"
  - "routes/**"
  - "database/**"
  - "config/**"
  - "tests/**"
---

# Backend: Laravel 11 + Inertia

## Routes

- User-facing routes go in `routes/web.php` behind the `auth` middleware, and every route is named. Group IVR modules under `Route::middleware('auth')->prefix('ivr')`.
- Use the full CRUD verbs (`get`, `post`, `put`, `delete`, plus a `put …/restore` for soft deletes) as for contacts. Don't use `Route::match(['get','post'], …)` for mutations.
- Don't add routes to `routes/api.php` or `routes/generated/ivr_legacy_api.php`. When a module is migrated, delete its lines from the generated file.

## Controllers

- Keep them thin, following `ContactsController`: scope the query through the account, validate, persist, then `Redirect::route(...)->with('success', '…')` or `Redirect::back()`.
- Read actions return `Inertia::render('<Area>/<Screen>', [...])` with **explicitly mapped props** (`->through(fn ($m) => [...])`, `->only(...)`). Never pass raw models or `DB::select` rows.
- Use one resourceful controller per module rather than seven invokable `*{Index,Store,…}Controller`s, unless an action is genuinely separate.
- Don't use `$request->wantsJson()` to fork the same action into JSON and Inertia responses (a legacy pattern). Use partial reloads, or a separate named JSON route like `ivr.data` if polling needs it.
- No `new SomeService()` inside an action. Inject dependencies into the constructor or method.

## Validation

- Use `FormRequest` classes (`app/Http/Requests/…`) or `Request::validate([...])`, and persist only `$request->validated()`. Never persist `$request->all()`.
- Scope `exists` rules to the account: `Rule::exists('organizations', 'id')->where('account_id', Auth::user()->account_id)`.

## Models and queries

- Use the Eloquent query builder with bound parameters. Put reusable filters in local scopes (`scopeFilter(array $filters)` with `->when(...)`), following `Contact` and `Organization`.
- Raw SQL only when unavoidable, always with bindings (`selectRaw('… ?', [$v])`), and never with interpolated input. Note: `IvrHubController` uses SQLite-only `strftime`. Isolate DB-specific expressions behind one method if you touch them.
- Declare `$fillable` on new and migrated models and remove `$guarded = []`. **Caveat:** `AppServiceProvider::boot()` calls `Model::unguard()` globally, so `$fillable` is currently not enforced. Removing that call is a dedicated migration step (all models then need correct `$fillable`). Until then, the real protection is passing only validated data.
- No query-running accessors (`legacyComputedFieldN`). Use relations plus `with()` / `withCount()`.
- Use soft deletes where the UI supports restore, and declare `casts()` for dates, JSON (`payload`) and booleans.

## Tenancy

- Every query is scoped to the authenticated user's account: `Auth::user()->account->contacts()`, or `IvrAccountContext::fromRequest($request)->accountId` for IVR.
- Never hard-code a tenant (`$tenantId = 1`, `config('ivr_legacy.default_tenant_id')`).
- Legacy `ivr_<module>s` tables carry `tenant_id` (default 1) plus a nullable `account_id`/`organization_id`. Migrating a module includes backfilling `account_id` and switching reads and writes to it.
- Route model binding: the `resolveRouteBinding` overrides on `Contact`, `Organization` and `User` add `withTrashed()` but **don't scope to the account**. New bindings must, for example via a scoped query or a policy check.

## Errors

- Let exceptions propagate to Laravel's handler. Don't use `try { … } catch (\Throwable $e) { return ['ok' => false, 'err' => $e->getMessage()]; }`, which hides failures and leaks messages.
- Use `abort(404)` / `abort(403)` or `firstOrFail()` for missing or forbidden resources.

## Migrations

- New schema changes are additive migrations with a working `down()`. Never edit a migration that has already run in a shared environment.
- Use the `Schema::hasTable` / `hasColumn` guard style only when you're intentionally matching the existing IVR migrations.
