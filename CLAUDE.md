# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PingCRM fork extended with a large **legacy "Enterprise IVR" surface** (see `DISCOVERY.md`). It is a single Laravel monolith with an Inertia + React frontend — there is no separate SPA or API client app.

- Backend: PHP 8.2+, Laravel 11, `inertiajs/inertia-laravel` 1.x, Sanctum, SQLite locally (`database/database.sqlite`).
- Frontend: React 19 + TypeScript, `@inertiajs/react` 2.x, Tailwind 3, Vite 7 (`laravel-vite-plugin`, with an SSR build), Vitest 4, lodash.

**This repo is a modernization target.** The IVR legacy code (fat controllers, god services, raw SQL, class components, monolith components, duplicated utils, hard-coded secrets) is what we are migrating away from. Never copy a legacy pattern into new or refactored code. Even so, **never deploy this app or expose it publicly** while the legacy code remains: `config/ivr_legacy.php` holds hard-coded credentials, and `/api/ivr-legacy/*` has no auth.

## Commands

```bash
composer install && npm install       # no private registries / tokens needed
php artisan migrate --seed            # local SQLite DB; DatabaseSeeder calls IvrDashboardSeeder + IvrModuleSampleSeeder
php artisan serve                     # backend
npm run dev                           # Vite dev server (run alongside artisan serve)
npm run build                         # vite build && vite build --ssr

php artisan test                      # PHPUnit (tests/Feature, tests/Unit) — CI runs this
php artisan test --filter=ContactsTest
vendor/bin/phpstan analyse            # Larastan, level 1, app/ only — CI runs this
npm test                              # vitest run (resources/js/**/*.test.ts[x])
npx vitest run path/to/file.test.tsx
npx tsc --noEmit                      # typecheck — no npm script for it
npm run fix-code-style                # prettier --write + eslint --fix on resources/js
```

CI (`.github/workflows/`): `tests.yml` (composer + npm ci + `npm run build` + `php artisan test`), `static-analysis.yml` and `coding-standards.yml` (Laravel's shared reusable workflows — Larastan and Pint), plus `qa-ephemeral-runner.yml` (manual dispatch for scoped test runs). Pint is not in `composer.json`, so it only runs in CI. CI does not run Vitest, `tsc`, or ESLint.

### Known baseline gate state (verify before relying on it)

These failures were already there before any modernization work. Don't attribute them to your change, but don't add to them either:

- `npx tsc --noEmit` fails with ~1,500 errors. Almost all are `TS6133` (unused locals) in generated `resources/js/Pages/Ivr/<LegacyModule>/*.tsx`. The non-legacy ones are: `SharedPageProps` not satisfying Inertia's `PageProps` (`Shared/FlashMessages.tsx`, `Layout.tsx`, `MainMenu.tsx`), `preserveScroll` on `router.reload` in `Pages/Ivr/Hub/Index.tsx`, and `vite.config.ts`/`vitest.config.ts` needing `@types/node`.
- ESLint (`.eslintrc.cjs`) enforces `indent: 2`, and `.prettierrc` sets `tabWidth: 2`. But `.editorconfig` and the existing code use **4 spaces**, so ESLint reports thousands of `indent` errors even on clean files. Don't run `fix-code-style` across the tree, because it would reformat every file. Run it only on files you own, and match the 4-space style until the configs are reconciled.
- Vitest has only `resources/js/test/smoke.test.ts`. PHPUnit covers only Contacts and Organizations.

Report a gate as passing only if you actually ran it. When a gate fails, say whether the failure was already in this baseline or is new.

## Architecture

### Request flow

`routes/web.php` (session + `auth` middleware) → controller → `Inertia::render('Folder/Page', $props)` → `resources/js/app.tsx` resolves `./Pages/${name}.tsx` via `import.meta.glob` (and `ssr.tsx` does the same). Data reaches the page as typed props, and mutations go back through `router.get/post/put/delete` or `useForm` to web routes that redirect with `->with('success', …)` flash messages. `app/Http/Middleware/HandleInertiaRequests.php` shares `auth.user` and `flash`. Their frontend types are `SharedPageProps` in `resources/js/types/index.ts`.

`routes/api.php` (stateless, throttled, **no auth**) only includes `routes/generated/ivr_legacy_api.php` and `/api/ivr/health-legacy`.

### Code tiers. Know which one you're touching.

**Clean/modern (use these as templates):**
- Original PingCRM CRUD: `ContactsController`, `OrganizationsController`, `UsersController`, `Auth/AuthenticatedSessionController` + `Requests/Auth/LoginRequest`, with pages under `resources/js/Pages/{Contacts,Organizations,Users,Auth}` and shared UI in `resources/js/Shared/`. Queries are always scoped through `Auth::user()->account`, validation is explicit, props are mapped explicitly, and these areas have feature tests in `tests/Feature/`.
- The newer IVR dashboard: `Ivr/IvrHubController` (`/ivr`, `/ivr/data`), `Ivr/IvrModuleController` + `Concerns/LoadsIvrModuleData` (`/ivr/modules`, `/ivr/{slug}` for the 18 slugs in `SLUG_MAP`), `App\Support\IvrAccountContext` (tenant = authenticated user's `account_id`), `ReportsController`. Pages are `Pages/Ivr/Hub`, `Pages/Ivr/Module`, `Pages/Reports`, and `components/ivr/IvrHubCharts.tsx`. They read the `ivr_agents`, `ivr_call_records`, `ivr_operational_queues`, `ivr_hourly_volumes` and `ivr_daily_trends` tables. Caveats: no tests yet, the controllers are large (`IvrHubController` is about 380 lines), and the hub uses SQLite-only `strftime` in `selectRaw`.

**Legacy, generated by `tools/generate-legacy-enterprise-ivr*.{php,mjs}` (migration source, don't extend):**
- `app/Http/Controllers/Ivr/<Module>{Index,Store,Update,Destroy,Import,Export,Sync}Controller.php`: 82 invokable controllers of about 760 lines each. They concatenate raw SQL, call `extract($request->all())`, hard-code `$tenantId = 1`, swallow exceptions, and copy-paste `legacyEndpointN` methods.
- `app/Legacy/Services/*GodService.php` (static mutable cache, `sleep()`, hard-coded keys), `app/Legacy/Helpers/LegacyIvr*.php`, `app/Repositories/Legacy/*Repository.php` (SQL injection patterns, never used by the controllers), `app/Models/Ivr/*` (`$guarded = []`, N+1 accessors), `config/ivr_legacy.php`. Each of the 47 legacy tables is `ivr_<snake_module>s` (`id, tenant_id default 1, name, payload json, soft deletes`). `2026_07_28_130000_add_account_id_to_ivr_tables` adds nullable `account_id`/`organization_id`, so migrating tenancy from `tenant_id` to `account_id` also needs a data backfill.
- `routes/generated/ivr_legacy_api.php`, regenerated by `tools/sync-ivr-legacy-routes.php`. It maps `/api/ivr-legacy/<slug>/<action>` (GET and POST) to those controllers.
- Frontend: `resources/js/Pages/Ivr/<Module>/` holds about 510 page files across 47 module folders, of which only about 82 are rendered by any controller. The rest are `components/legacy/*Monolith*.tsx`, `legacy/class/*ClassWidget*.jsx`, `hooks/legacy/use*Legacy*.ts` and `utils/duplicate/legacyFormatters*.ts`. These use raw `fetch`, leak intervals, use `any`, have no error handling, and duplicate validation. **Nothing imports `components/legacy`, `legacy/class`, `hooks/legacy` or `utils/duplicate`.** They are dead code. Legacy pages also `fetch('/ivr-legacy/...')` without the `/api` prefix, so those calls 404 today.

Re-running the generator scripts overwrites legacy files. Don't run them after modernization has started unless you've been asked to.

### Path alias

Only one: `@` → `resources/js`. It's defined in `vite.config.ts`, `vitest.config.ts` and `tsconfig.json`; keep all three in sync if you add one. Note that `tsconfig.json` only includes `.ts`/`.tsx` files, so the `.jsx` class widgets are never typechecked.

## Code rules in `docs/code-rules/`

`docs/code-rules/` is the single source of truth for coding standards and the review checklist. `.claude/rules/*.md` are symlinks into it so Claude Code auto-loads them. Edit the files in `docs/code-rules/`, never the symlinks. `AGENTS.md` is the repo-level contract for AI agents, so keep shared guidance consistent with it.

Read the relevant rule files before writing, editing or reviewing code:
- Always: `code-structure.md`, `code-style.md`, `maintainability.md`.
- Frontend (`resources/js`): `frontend-react-ts.md`.
- Backend (`app`, `routes`, `database`, `config`): `backend-laravel.md`.
- `api-contract.md` for Inertia props, controller responses and JSON endpoints.
- `security.md` for auth, tenancy, SQL, validation, secrets and mass assignment.
- `testing.md` when adding or editing tests.
- `performance.md` for queries, N+1, polling, intervals and bundle size.
- `logging-monitoring.md` for error handling and logging.
- `ticket-purpose-flow.md` before any commit, branch or PR.
- `code-review.md` when reviewing, or for any legacy-module migration (wiring, reachability, parity, gates).

Treat any structural claim in these docs as unverified until you've checked it against the live code.

## Commits and branches

There's no commitlint or husky in this repo, so nothing enforces this convention; it's what the team uses:
- Commit messages: `TICKET-ID (type): summary`, e.g. `12208 (refactor): move call-flow queries to repository`. Types are `feat|fix|hotfix|docs|style|refactor|test|chore|merge|enhance`. Keep commits atomic, write the subject in the present tense and under about 72 characters, and add a `Closes: TICKET-ID` footer when the commit closes the ticket.
- Branch names: `type/TICKET-ID-kebab-summary`. Branch from the current base branch (`master` today), keep it up to date before review, and delete it after merge.
- Take `TICKET-ID` from the driving Jira or Redmine ID. If there isn't one, ask; don't invent one.

## Legacy module modernization

Migrate one IVR module at a time (for example `call-flow`) end to end:
1. **Backend.** Replace the 7 generated controllers with a resourceful controller or a few thin ones on `routes/web.php` behind `auth`. Use `FormRequest` validation, scope the tenant through `IvrAccountContext` or `Auth::user()->account`, move queries into Eloquent scopes or a real repository with bound parameters, set `$fillable` on the model, and remove `extract()`, `sleep()`, the static cache and the swallowed exceptions. Pull secrets from `config/ivr_legacy.php` into `.env`.
2. **Frontend.** One typed page per screen under `Pages/Ivr/<Module>/`, following `Pages/Contacts` and `Pages/Ivr/Module/Show.tsx`. Use Inertia props and `router`/`useForm` instead of raw `fetch` to `/ivr-legacy`, type the props in the page or `types/`, and reuse `Shared/` components.
3. **Remove** that module's generated controllers, routes in `routes/generated/ivr_legacy_api.php`, god service, repository, legacy pages, monoliths, class widgets and hooks, but only after a reachability check (`grep` for imports, `Inertia::render` names and route usage) shows they're unused.
4. **Test.** Add a feature test like `tests/Feature/ContactsTest.php` (asserting Inertia component and props, tenancy isolation and validation), plus Vitest tests for any extracted frontend logic.

Reference templates are the PingCRM CRUD tier and the IVR hub/module tier listed above. They're cleaner than the legacy code but not flawless, so check the actual code before copying a pattern.
