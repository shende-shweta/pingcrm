# Ping CRM

A demo CRM built with **Laravel 11** and **Inertia.js**, extended with an **enterprise IVR discovery** surface (legacy-style PHP and React/TypeScript) for workshops and modernization planning.

The original Inertia Ping CRM screenshot still applies to the core CRM UI (`/`, contacts, organizations, etc.).

<img width="1852" height="1089" alt="image" src="https://github.com/user-attachments/assets/d5186384-7ee7-429e-adbf-4414d5f994ed" />


## Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 11, Inertia Laravel |
| Frontend | React 19, TypeScript, Vite 7 |
| Tests | PHPUnit, Vitest |

## Installation

Clone the repo locally:

```sh
git clone https://github.com/inertiajs/pingcrm.git pingcrm
cd pingcrm
```

Setup configuration (before migrations):

```sh
cp .env.example .env
php artisan key:generate
```

Create an SQLite database (or configure MySQL/Postgres in `.env`):

```sh
touch database/database.sqlite
```

Install PHP dependencies:

```sh
composer install
```

Install NPM dependencies:

```sh
npm ci
```

Run database migrations and seed demo data (CRM account, organizations, contacts, IVR dashboard metrics):

```sh
php artisan migrate
php artisan db:seed
```

The seeder creates **Acme Corporation**, sample organizations/contacts, and IVR rows scoped to that account (`account_id` / optional `organization_id` on queues and calls).

## Local development

Run **both** processes:

```sh
# Terminal 1 – Vite dev server (HMR)
npm run dev

# Terminal 2 – Laravel
php artisan serve
```

Open the URL shown by `php artisan serve` (typically `http://127.0.0.1:8000`).

Login:

- **Email:** johndoe@example.com
- **Password:** secret

### Main routes

| Route | Description |
|-------|-------------|
| `/` | CRM dashboard |
| `/contacts`, `/organizations` | CRM entities (account-scoped) |
| `/ivr` | IVR Enterprise Hub – live metrics and filters |
| `/ivr/modules` | IVR modules – pick a module; **Live Monitoring** loads by default |
| `/ivr/{module-slug}` | Redirects to `/ivr/modules?module=…` |
| `/reports` | Call/queue reports and CSV export |

IVR hub and reports use the logged-in user’s **CRM account**. Use the **Organization** filter on `/ivr` and `/reports` to drill into a single customer org.

Production-style asset build:

```sh
npm run build
```

## Legacy IVR discovery codebase

Large generated legacy IVR code (intentional technical debt) is documented in **[DISCOVERY.md](DISCOVERY.md)**. Do **not** deploy this project publicly; `config/ivr_legacy.php` and legacy API patterns include deliberate vulnerabilities for training.

After regenerating legacy PHP, sync routes:

```sh
php tools/sync-ivr-legacy-routes.php
```

Optional: re-seed only IVR dashboard/module sample data:

```sh
php artisan db:seed --class=Database\\Seeders\\IvrDashboardSeeder
php artisan db:seed --class=Database\\Seeders\\IvrModuleSampleSeeder
```

## Running tests

PHP (Laravel):

```sh
php artisan test
# or
./vendor/bin/phpunit
```

Frontend:

```sh
npm test
```
