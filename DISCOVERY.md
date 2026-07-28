# Legacy Enterprise IVR – Modernization Discovery Codebase

This repository contains a **functional but intentionally flawed** enterprise IVR (Interactive Voice Response) platform built on **Laravel + React (Inertia)**. It is designed for AI discovery agents, architecture reviews, and modernization planning workshops.

## Purpose

- Simulate a **10–15 year** legacy monolith with multiple team coding styles
- Embed realistic **architecture, security, scalability, and maintainability** issues
- Provide **70k+ PHP** and **100k+ React/TS/JS** lines distributed across hundreds of files

## Regenerating the synthetic legacy surface

```bash
php tools/generate-legacy-enterprise-ivr.php 72000
node tools/generate-legacy-enterprise-ivr.mjs 102000
node tools/generate-legacy-enterprise-ivr-pass2.mjs 52000
php tools/sync-ivr-legacy-routes.php
```

Generated artifacts:

| Area | Location |
|------|----------|
| Fat IVR controllers | `app/Http/Controllers/Ivr/` |
| Legacy models | `app/Models/Ivr/` |
| God services / helpers | `app/Legacy/` |
| Legacy API routes | `routes/generated/ivr_legacy_api.php` |
| React pages | `resources/js/Pages/Ivr/` |
| Class + monolith components | `resources/js/legacy/`, `resources/js/components/legacy/` |

## Application entry points

- **Web hub (authenticated):** `/ivr`
- **Legacy JSON API (unversioned):** `/api/ivr-legacy/...`
- **Original Ping CRM demo routes** remain under `/`, `/contacts`, etc.

## Intentional issue categories (non-exhaustive)

See prompt specification: fat controllers, SQL injection patterns, `extract()`, hard-coded secrets (`config/ivr_legacy.php`), missing rate limits on legacy API, N+1 accessors, duplicated validation, React memory-leak intervals, class/functional component mix, duplicate utils, no error boundaries, etc.

## ⚠️ Security warning

**Do not deploy this project to production or expose it to the public internet.** Hard-coded credentials and vulnerable patterns are deliberate for training and discovery only.

## Line counts

```bash
find app routes database/migrations config -name '*.php' -not -path '*/vendor/*' | xargs wc -l | tail -1
find resources/js -type f \( -name '*.tsx' -o -name '*.ts' -o -name '*.jsx' -o -name '*.js' \) | xargs wc -l | tail -1
```
