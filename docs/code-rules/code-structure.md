# Code Structure

Where code belongs in this Laravel + Inertia + React monolith. Verify against the live tree before relying on any path here.

## Backend (`app/`)

| Concern | Location | Notes |
|---|---|---|
| Web routes | `routes/web.php` | All user-facing routes, behind `auth`, named (`contacts.update`, `ivr.module`). New module routes go here. |
| API routes | `routes/api.php` | Legacy only. Don't add routes here or to `routes/generated/`. |
| Controllers | `app/Http/Controllers/` | Thin: authorize, validate, call model/repository, return `Inertia::render` or a redirect. IVR controllers go in `app/Http/Controllers/Ivr/`. |
| Validation | `app/Http/Requests/` | `FormRequest` per action (see `Auth/LoginRequest.php`). Inline `Request::validate` (as in `ContactsController`) is acceptable for small CRUD, but never duplicate rules across store/update; share them. |
| Tenancy context | `app/Support/IvrAccountContext.php` | Account (and optional organization) taken from the authenticated user. Reuse it; don't hand-roll it again. |
| Shared controller logic | `app/Http/Controllers/**/Concerns/` | Traits like `LoadsIvrModuleData`. Prefer a plain class once a trait grows large. |
| Models | `app/Models/`, `app/Models/Ivr/` | Relations, scopes (`scopeFilter`, `scopeOrderByName`), casts. No raw SQL accessors. |
| Query objects / repositories | `app/Repositories/` (new, non-legacy) | Only when a query is reused or complex. A repository the controller doesn't use is dead code (as `app/Repositories/Legacy/*` is today). |
| Legacy | `app/Legacy/`, `app/Repositories/Legacy/`, generated `Ivr/*{Index,Store,...}Controller.php` | Migration source. Don't add to it; delete per module once migrated. |
| Migrations / seeders | `database/migrations/`, `database/seeders/` | Additive migrations. Seed IVR demo data through `IvrDashboardSeeder` / `IvrModuleSampleSeeder`. |
| Config | `config/*.php` reading `env()` | No literal secrets. `config/ivr_legacy.php` is legacy. |

## Frontend (`resources/js/`)

| Concern | Location | Notes |
|---|---|---|
| Entry | `app.tsx`, `ssr.tsx` | Resolve `./Pages/${name}.tsx`. Keep both in sync. |
| Pages | `Pages/<Area>/<Screen>.tsx` | One file per `Inertia::render('<Area>/<Screen>')`. The name must match exactly or rendering throws at runtime. |
| Layout | `layouts/authenticatedLayout.tsx` → `Shared/Layout.tsx` | Assign with `Page.layout = authenticatedLayout`. |
| Shared UI | `Shared/` | Inputs, `Pagination`, `SearchFilter`, `Icon`, `LoadingButton`, `FlashMessages`, … Check here before writing a new component. |
| Feature components | `components/<feature>/` (e.g. `components/ivr/`) | Used by more than one page in a feature. |
| Types | `types/index.ts` (shared props, `Paginated<T>`), or the page itself for page-only props | |
| Hooks / utils | `hooks/`, `utils/` (new, non-legacy subfolders) | Typed, tested, single purpose. |
| Legacy (dead) | `components/legacy/`, `legacy/class/`, `hooks/legacy/`, `utils/duplicate/`, most of `Pages/Ivr/<Module>/` | Nothing imports the first four. Delete; don't reuse. |
| Tests | Colocated `*.test.ts[x]`, or `resources/js/test/` | Vitest. |

Import with the `@/` alias (`@/Shared/Icon`), not deep relative paths.

## Module migration shape

A migrated IVR module `foo-bar` should end up as:

```
routes/web.php                               # Route group /ivr/foo-bar (auth), named ivr.foo-bar.*
app/Http/Controllers/Ivr/FooBarController.php
app/Http/Requests/Ivr/FooBar{Store,Update}Request.php
app/Models/Ivr/FooBar.php                    # scopes, casts, relations, no raw SQL
resources/js/Pages/Ivr/FooBar/{Index,Create,Edit}.tsx
tests/Feature/Ivr/FooBarTest.php
```

At the same time, delete `FooBar*Controller.php` (the 7 generated ones), the `foo-bar/*` lines in `routes/generated/ivr_legacy_api.php`, `app/Legacy/Services/FooBarGodService.php`, `app/Repositories/Legacy/FooBarRepository.php`, and the `FooBar` legacy frontend files.
