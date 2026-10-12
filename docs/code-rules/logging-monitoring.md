# Logging and Monitoring

## Backend

- Let exceptions reach Laravel's exception handler (`bootstrap/app.php` → `withExceptions`), which logs them and renders the right response. Don't catch `\Throwable` just to return `['ok' => false, 'err' => $e->getMessage()]` (the legacy pattern), because it hides the failure from logs and leaks internals to the client.
- Catch only exceptions you can handle meaningfully (for example a specific external-service exception), and then either recover or `report($e)` and rethrow / `abort()`.
- Use `Log::` with context arrays, not string concatenation: `Log::warning('IVR import skipped row', ['account_id' => $id, 'row' => $n])`. Never log secrets, passwords, tokens or full request payloads.
- Don't log the SQL (`config('ivr_legacy.allow_sql_debug')` is legacy). Use `DB::listen` or Telescope locally only.
- Health checks: Laravel's `/up` (configured in `bootstrap/app.php`) is the real one. `/api/ivr/health-legacy` returns `"maybe-ok"`; remove it with the legacy API.

## Frontend

- No `console.log` left in committed code. `console.error` only in a central error path, if there is one.
- Never swallow promise rejections (`.catch(() => {})` in the legacy pages). Show an error state or let Inertia's error handling surface it.
- Inertia handles server-side validation errors (`errors`) and flash messages (`Shared/FlashMessages.tsx`), so use them instead of `alert()`.
- There's no React error boundary yet. If you add one, wrap it around the layout (`Shared/Layout.tsx`) in a dedicated, tested change.
