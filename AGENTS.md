# PingCRM / Enterprise IVR — Agent Guide

This file is the repo-level contract for AI coding and review agents working in this repository (a Laravel 11 + Inertia + React/TypeScript monolith). `CLAUDE.md` carries the commands, gate baseline, and architecture map; `docs/code-rules/` carries the detailed standards. Keep all three consistent.

## Purpose

The codebase has two styles side by side:

- **Legacy (generated) IVR surface**: fat invokable controllers under `app/Http/Controllers/Ivr/*{Index,Store,Update,Destroy,Import,Export,Sync}Controller.php`, `app/Legacy/` god services and helpers, `app/Repositories/Legacy/`, open-mass-assignment models in `app/Models/Ivr/`, the unauthenticated `/api/ivr-legacy/*` routes, and on the frontend `Pages/Ivr/<Module>/*`, `components/legacy/*Monolith*`, `legacy/class/*.jsx`, `hooks/legacy/`, `utils/duplicate/`.
- **Clean / newer areas**: the original PingCRM CRUD (Contacts, Organizations, Users, Auth) and the IVR dashboard tier (`IvrHubController`, `IvrModuleController` + `LoadsIvrModuleData`, `App\Support\IvrAccountContext`, `ReportsController`, `Pages/Ivr/Hub`, `Pages/Ivr/Module`, `Pages/Reports`, `Shared/`).

This repo is a **modernization target**. Move code toward the clean style, one IVR module at a time. The legacy security flaws are not features to preserve. Still, don't deploy the app or expose it publicly until they're gone.

## Reference Implementations

Use these as templates, in this order:

- Backend CRUD: `app/Http/Controllers/ContactsController.php`, `OrganizationsController.php`, `Auth/AuthenticatedSessionController.php` + `app/Http/Requests/Auth/LoginRequest.php`, models `Contact` / `Organization` (scopes such as `filter()` / `orderByName()`).
- Backend IVR read models and tenancy: `Ivr/IvrHubController.php`, `Ivr/IvrModuleController.php`, `Ivr/Concerns/LoadsIvrModuleData.php`, `app/Support/IvrAccountContext.php`.
- Frontend pages: `resources/js/Pages/Contacts/*`, `Pages/Organizations/*`, `Pages/Ivr/Module/Show.tsx`, `Pages/Ivr/Hub/Index.tsx` (intervals with cleanup, `router.reload({ only })`), shared UI in `resources/js/Shared/`, shared prop types in `resources/js/types/index.ts`.
- Tests: `tests/Feature/ContactsTest.php`, `tests/Feature/OrganizationsTest.php`.

These templates are not defect-free. The IVR tier has no tests, large controllers, and SQLite-only `strftime` SQL, and `tsc` reports a `SharedPageProps` / `PageProps` mismatch. Check the current code before you mirror a pattern, and never copy a defect just because a reference does it.

## Staged Refactor Workflow

For non-trivial refactor work, use:

`Refactor-Planner -> Tester -> Developer -> Reviewer -> Commit/PR`

These roles are prompt conventions; nothing in the repo enforces them. Name the stage you're working in.

### Refactor-Planner

- Clarify the user-facing goal and acceptance criteria for the module.
- Map the legacy surface for the module: which generated controllers, `/api/ivr-legacy/<slug>/*` routes, god-service methods, models/tables, and `Pages/Ivr/<Module>/*` files exist, and which are actually **reachable** (routes registered, `Inertia::render` names, frontend imports). Most legacy frontend files are imported by nothing.
- Decide layer ownership: web route + controller, `FormRequest`, model scope / repository, Inertia page, `Shared/` component, typed util.
- Identify behaviors that must keep parity versus legacy defects that should be dropped. Examples of defects to drop: SQL injection, hard-coded tenant `1`, swallowed errors, the 404ing `fetch('/ivr-legacy/...')` calls. Call these out explicitly so nobody mistakes a dropped defect for a regression.
- Plan the `tenant_id` → `account_id` tenancy move (columns exist but are nullable; a backfill is needed).

### Tester (Red)

- Write failing PHPUnit feature tests first, modeled on `ContactsTest`. Cover the Inertia component name and props, account isolation (another account's rows are invisible), validation errors, and soft-delete/restore if relevant.
- Add colocated Vitest tests (`*.test.ts[x]`) for any extracted frontend logic.
- Confirm each test fails for the right reason before implementation starts.

### Developer (Green)

- Implement the smallest change that satisfies the tests.
- Backend: thin controllers on `routes/web.php` behind `auth`, `FormRequest` validation, Eloquent with bound parameters, `$fillable` on models, tenancy via `IvrAccountContext` / `Auth::user()->account`, secrets via `config()` backed by `.env`, and real exceptions (no `extract()`, no `sleep()`, no static mutable caches, no `try { } catch (\Throwable) { return ['ok' => false] }`).
- Frontend: typed `.tsx` function components that render server props, with navigation and mutation through Inertia `router` / `useForm`. No raw `fetch`, no `any` at prop boundaries, effects cleaned up, no class components.
- Delete the module's legacy files once reachability is proven, and remove its lines from `routes/generated/ivr_legacy_api.php`. Don't re-run the generator scripts in `tools/`.
- Run the gates (`php artisan test`, `vendor/bin/phpstan analyse`, `npm test`, `npx tsc --noEmit`, `npm run build`) and report the real results against the baseline in `CLAUDE.md`.

### Reviewer

- Apply `docs/code-rules/code-review.md`.
- Prioritize, in order: security and tenancy, wiring and reachability, legacy parity, architecture direction, tests, then style.
- Block the change if it claims a gate passed without running it, or if it adds new errors to the baseline.

### PR Feedback Follow-Up

- Triage each comment as required, optional, already handled, or out of scope.
- Apply only the requested fix unless it exposes a nearby correctness issue. Add or adjust tests first for behavioral changes, then review again.

## Commit Message Format

This is a team convention; no commitlint or husky enforces it here:

`TICKET-ID (type): summary`, e.g. `1234 (refactor): move call-flow CRUD to web routes`.

Allowed types: `feat`, `fix`, `hotfix`, `docs`, `style`, `refactor`, `test`, `chore`, `merge`, `enhance`. Branches: `type/TICKET-ID-kebab-summary`. If no ticket ID comes from the prompt or the branch name, ask before committing. Use `0000` as a placeholder only if the user explicitly accepts it.

## Target Direction

Prefer:

- One resourceful web route set per module, with Inertia pages instead of a parallel JSON API.
- Thin controllers; validation in `FormRequest`; queries in model scopes or a repository that the controller actually uses.
- Every query scoped to the authenticated account.
- TypeScript-only frontend code with typed page props, function components and hooks.
- Reuse of `Shared/` components and `types/` before creating new ones; extract shared code only once duplication is proven.
- Small composable files over the generated 700–1,100-line files.
- Tests alongside every migrated module.

## Avoid Reinforcing Legacy Patterns

Don't introduce or preserve these in touched code:

- String-concatenated SQL (`DB::select("... '".$q."'")`, `whereRaw` with user input).
- `extract()` on request data, `$request->all()` passed into inserts, or `$guarded = []`.
- Hard-coded tenant IDs, credentials, or API keys (`config/ivr_legacy.php`, `private $apiKey = ...`).
- Routes without `auth`, or new routes in `routes/api.php` / `routes/generated/`.
- God services, static mutable caches, `sleep()` in request paths, or catch-all exception swallowing.
- Raw `fetch` / `axios` in components, `setInterval` / listeners without cleanup, or `any` props.
- New class components or `.jsx` files, `alert()`, inline `style={{}}` instead of Tailwind classes.
- Copying a `legacyFormattersN` / `*LegacyN` hook variant instead of writing one typed util.
- Edits to generated legacy files beyond what deleting them requires.

If a temporary compatibility bridge is unavoidable, keep it at the boundary and call it out in the PR.

## Review Expectations

Default to a direction-of-travel review, not just a defect scan:

1. Is the module converging on the PingCRM CRUD / IVR hub-module architecture?
2. Is tenancy enforced from the authenticated user and covered by a test?
3. Are the legacy route, controllers, service and frontend files for the module removed, with reachability proven?
4. Are responsibilities split across route, controller, request, model/repository and page?
5. Were tests added, and were the gates run with honest results?

## Change Scope Guidance

Bounded, module-by-module progress is the goal. A full rewrite is not required.

Acceptable: migrating one module end to end, deleting provably dead legacy files, a narrow adapter around a legacy table during the tenancy backfill, or fixing a baseline gate error in a file you own.

Not acceptable: moving legacy code into new filenames without changing its coupling, extending a generated controller or god service, leaving the old `/api/ivr-legacy/<slug>/*` routes live after the module is migrated, or reformatting untouched files.
