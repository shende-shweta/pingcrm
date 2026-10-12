# Security

The legacy IVR surface deliberately contains serious vulnerabilities. Migration must remove them, never carry them forward. **Don't deploy the app or expose it publicly while legacy code remains.**

## Known legacy vulnerabilities (remove as each module is migrated)

| Issue | Where |
|---|---|
| SQL injection through string concatenation | Generated `Ivr/*Controller.php` (`"... like '%".$q."%'"`), `app/Repositories/Legacy/*` |
| `extract($request->all())` / `extract($payload)` | Generated controllers, `app/Legacy/Services/*GodService.php` |
| Unauthenticated endpoints (GET allowed for writes) | `/api/ivr-legacy/*` (`routes/generated/ivr_legacy_api.php`), `/api/ivr/health-legacy` |
| Hard-coded secrets and credentials | `config/ivr_legacy.php` (master API key, Salesforce credentials), `private $apiKey` in god services |
| Hard-coded tenant `1` (cross-tenant data) | Generated controllers, `tenant_id` default, `config('ivr_legacy.default_tenant_id')`, legacy pages |
| Mass assignment wide open | `$guarded = []` on `app/Models/Ivr/*`, and **global `Model::unguard()` in `AppServiceProvider`** |
| Unscoped route model binding (IDOR) | `resolveRouteBinding` on `Contact`, `Organization`, `User` (any authenticated user can load another account's record by ID) |
| Auth bypass / weak session config | `config/ivr_legacy.php` (`bypass_auth_for_internal_ips`, `session_lifetime_minutes`, `allow_sql_debug`) |
| Error messages returned to clients | `catch (\Throwable $e) { return ['err' => $e->getMessage()] }` |

## Rules for new and migrated code

- **Auth:** every route is behind `auth` (web session). No new stateless API routes. Check ownership on every record-level action.
- **Tenancy:** derive the account from `Auth::user()` / `IvrAccountContext`; never take `account_id`/`tenant_id` from request input. Validate any `organization_id` input against the user's account, as `IvrAccountContext::fromRequest` does. Every module's feature test must assert that another account's rows are invisible and not editable.
- **SQL:** Eloquent or the query builder with bindings only, never interpolated input in `whereRaw`/`selectRaw`/`orderByRaw`. Allowlist sort columns and directions.
- **Input:** validate everything and persist only `validated()`. Never `extract()` input. Never pass request arrays directly into `create`/`insert`/`update`.
- **Secrets:** read them from `.env` via `config()`. Don't commit real values in `config/*.php`, `.env.example`, tests or fixtures. When you remove a key from `config/ivr_legacy.php`, assume it's compromised and needs rotating if it was ever real.
- **Output:** React escapes by default. Never use `dangerouslySetInnerHTML` with server data. Don't dump objects into the UI (`<pre>{JSON.stringify(rows)}</pre>` in the monolith components can leak `payload`/`tenant_id`).
- **CSRF:** Inertia `router`/`useForm` send the XSRF token automatically. Raw `fetch` POSTs (the legacy monoliths) don't, which is another reason to avoid them.
- **Files:** `ImagesController` / Glide serves `/img/{path}`. Don't widen the allowed paths. Validate uploads by MIME type and size.
- **Logging:** never log passwords, tokens, API keys or full request payloads.

## Reviewing

Treat a migrated module that keeps any item from the table above, or that adds an endpoint without auth and account scoping, as a blocking finding.
