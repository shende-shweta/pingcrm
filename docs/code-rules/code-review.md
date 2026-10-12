# Code Review and Module-Migration Checklist

Use this when reviewing any PR, and when doing or reviewing an IVR legacy-module migration. Prioritize findings in this order: **security/tenancy → wiring/reachability → legacy parity → architecture → tests → style.**

## 1. Security and tenancy (blocking)

- [ ] Every new or changed route is in `routes/web.php` behind `auth`. Nothing was added to `routes/api.php` or `routes/generated/`.
- [ ] Every query is scoped to the authenticated account (`Auth::user()->account`, `IvrAccountContext`). No `tenant_id = 1`, and no `account_id` taken from input.
- [ ] Record-level actions verify ownership (scoped binding, scoped query or policy). Watch for copying the unscoped `resolveRouteBinding` from `Contact`/`Organization`.
- [ ] No string-built SQL, no `extract()`, no persisting `$request->all()`. Only `validated()` data is written.
- [ ] No secrets in code or config literals.
- [ ] See `security.md` for the full list.

## 2. Wiring and reachability

- [ ] Every `Inertia::render('X/Y')` has a matching `resources/js/Pages/X/Y.tsx`, and a feature test asserts `->component('X/Y')`.
- [ ] Every new page is reachable: there's a route, a controller render, and a link or menu entry (`Shared/MainMenu.tsx` or the `/ivr/modules` list) where relevant.
- [ ] Every hard-coded URL or `router.*` target exists in `routes/web.php` (`php artisan route:list --path=ivr`).
- [ ] Deleted legacy files really were unreachable: show the grep evidence (no importers in `resources/js`, no `Inertia::render` name in `app/`, no route reference). Remember that `/ivr/{slug}` (constrained to the 18 `IvrModuleController::SLUG_MAP` slugs) redirects to `/ivr/modules?module=<slug>`, which renders `Ivr/Module/Index`. A migrated module's new `/ivr/<slug>/...` routes must not collide with that route, and the slug must be removed from `SLUG_MAP`/`MODULE_META` when the module gets its own pages.
- [ ] The migrated module's lines were removed from `routes/generated/ivr_legacy_api.php`, along with its controllers, god service, repository and legacy frontend files. No half-migrated module is left with both paths live.

## 3. Legacy parity

- [ ] The PR lists the legacy behaviors that were **kept**: user-visible fields, filters (`q` search), soft-delete/restore, import/export or sync if they were real.
- [ ] The PR lists the legacy behaviors that were **intentionally dropped**: SQL injection, hard-coded tenant, swallowed errors, `sleep()`, the 404ing `fetch('/ivr-legacy/...')` calls, client-only duplicate validation, `alert()`.
- [ ] Any data migration is included and reversible (for example backfilling `account_id` from `tenant_id`).
- [ ] The behavior is checked against what the legacy code **actually** does, not what its comments claim.

## 4. Architecture direction

- [ ] Controllers are thin, validation lives in a `FormRequest` or a single shared rule set, and queries use scopes or a repository that's actually called.
- [ ] Pages are typed function components using Inertia props and `router`/`useForm`. No raw `fetch`, no `any` at boundaries, no class components, no `.jsx`.
- [ ] `Shared/` components and `types/` were reused; nothing was duplicated as a numbered variant.
- [ ] No logic was added to generated legacy files, and the generator scripts weren't re-run.
- [ ] See `maintainability.md`, `backend-laravel.md` and `frontend-react-ts.md`.

## 5. Tests and gates

- [ ] The feature test covers index props, tenancy isolation, validation, mutations, guest redirect and removed legacy routes (`testing.md`).
- [ ] Extracted frontend logic has Vitest tests.
- [ ] Gates were **actually run**, with results in the PR: `php artisan test`, `vendor/bin/phpstan analyse`, `npm test`, `npx tsc --noEmit`, `npm run build`.
- [ ] No new `tsc` or ESLint errors in touched files compared with the baseline in `CLAUDE.md`. Touched files should ideally reach zero errors. Pre-existing failures are named as such.
- [ ] Claiming a gate passed without running it is a blocking finding in its own right.

## 6. Style

- [ ] 4-space indentation, matching the surrounding clean code. Untouched files weren't reformatted. See `code-style.md`.
- [ ] The commit, branch and PR format follows `ticket-purpose-flow.md`.
