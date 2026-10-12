# Testing

## Tools

- **PHPUnit 11** via `php artisan test` (`phpunit.xml`; `tests/Feature`, `tests/Unit`). CI runs it in `tests.yml`. Baseline: 9 passing tests covering Contacts and Organizations only.
- **Vitest 4** via `npm test` (`vitest.config.ts`, `environment: 'node'`, `@` alias). CI doesn't run it. Baseline: one smoke test, `resources/js/test/smoke.test.ts`.
- **Larastan** via `vendor/bin/phpstan analyse` (level 1, `app/` only). CI runs it.
- No React Testing Library or jsdom is installed. To test components, add `@testing-library/react` + `jsdom` and set `environment: 'jsdom'` for those files, in a dedicated commit. Until then, extract logic into pure functions and test those.

## What every migrated IVR module needs

Write a feature test in `tests/Feature/Ivr/<Module>Test.php`, modeled on `tests/Feature/ContactsTest.php` (`RefreshDatabase`, a user with an `Account`, `actingAs`). It must cover:

1. **Index:** the correct Inertia component and prop shape (`assertInertia(fn (Assert $a) => $a->component('Ivr/<Module>/Index')->has('rows.data', n)->has('rows.data.0', fn ($a) => $a->where(...)))`).
2. **Tenancy:** rows from a second account are absent from index, and edit/update/delete on them return 404 or 403.
3. **Validation:** invalid input produces session errors and doesn't persist.
4. **Mutations:** store, update, destroy (and restore) change the DB (`assertDatabaseHas` / `assertSoftDeleted`) and redirect with a flash message.
5. **Auth:** guests are redirected to `/login`.
6. **Legacy removal:** the old `/api/ivr-legacy/<slug>/*` routes return 404 once deleted.

Frontend:
- Write Vitest unit tests for every extracted util or hook (`*.test.ts` next to the file).
- Any interval or polling logic must have a test that proves cleanup (use fake timers).

## Conventions

- Write tests first (Red), confirm they fail for the right reason, then implement (Green).
- Use the factories in `database/factories/` and add one for each migrated IVR model. Don't depend on seeded demo data.
- Feature tests run on SQLite. If a query uses DB-specific SQL (`strftime`), say so in the test or abstract it.
- Never weaken an assertion or delete a test to make a gate pass.
- Report results honestly: say which commands ran, the pass/fail counts, and whether any failure was already in the baseline (see `CLAUDE.md`).
