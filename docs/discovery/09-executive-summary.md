# Discovery Executive Summary

**Project:** PingCRM-Discovery · **Generated:** 30/09/2026, 11:36:45

> **Executive Summary**
>
> This report consolidates the overall ratings, key findings, and recommended actions from the 1 discovery analysis run across this codebase (frontend and backend). Each section below reproduces that analysis's executive view; full evidence and diagrams live in the individual reports.

## Portfolio Overview

| # | Analysis | Overall Rating |
|---|---|---|
| 1 | Technical Debt | — |

---

## 1. Technical Debt

> **Executive Summary**
>
> PingCRM is a Laravel 11 / React 19 demo application with a deliberately injected legacy IVR monolith surface totalling ~185k lines across 800+ generated files. The core CRM is well-structured with CI pipelines for tests, coding standards, and static analysis; lock files are committed and `.env.example` is present. However, the legacy IVR layer introduces severe technical debt: hard-coded secrets committed in `config/ivr_legacy.php`, `extract()` calls in God services, raw SQL concatenation in 10+ repository files, zero foreign keys on the original CRM tables (`users`, `contacts`, `organizations`), and no Docker or devcontainer configuration for reproducible environments. There is no `CODEOWNERS` file, no branch protection signals, no pre-commit hooks enforcing linters, and no AI-assisted tooling config (`.cursor/`, `CLAUDE.md`, `.kiro/`). PHPStan is configured at only level 1 out of 9. The codebase is **not ready** for an agentic harness today — the committed secrets alone block clean automation, and the absence of containerized environments makes reproducible agent-driven runs unreliable.

## Readiness Benchmark Ratings

| # | Dimension | <span class=\"rating rating-good\">Good</span> | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"rating rating-high-risk\">High Risk</span> | Measured | Rating |
|---|---|---|---|---|---|---|
| D1 | Code Repository Health | all checks pass | 1–2 gaps | 3+ gaps / no CI | `.gitignore` present, 4 CI workflows, lock files committed; but no `CODEOWNERS`, no branch protection signals, no PR template | <span class=\"rating rating-moderate\">Moderate</span> |
| D2 | Third-Party Tool Usage | mostly wired & current | some unused/unwired | many unused/unmaintained | 15 of 19 production deps actively wired; 4 declared but not evidently used in app code (Pusher, Mailgun, AWS SDK vars, `react-router-dom`) | <span class=\"rating rating-moderate\">Moderate</span> |
| D3 | AI Tool / Agentic Readiness | ready | partial | not ready | No `.cursor/`, `CLAUDE.md`, `.kiro/`, or Copilot config; committed secrets in `config/ivr_legacy.php` block clean checkout for automation; IVR modules are structurally enumerable but not CI-verifiable in isolation | <span class=\"rating rating-high-risk\">High Risk</span> |
| D4 | Database Usage | sound | some gaps | no constraints / shared flat schema | IVR dashboard tables have FK constraints; CRM core tables use integer columns with indexes but no FK constraints; 46 legacy IVR tables use identical JSON-blob schema with no relational constraints | <span class=\"rating rating-moderate\">Moderate</span> |
| D5 | Development Environment | reproducible | partial | manual / fragile | `.env.example` present; README has clear steps; but no Docker/devcontainer; no pre-commit hooks; linters configured but not enforced locally; PHPStan at level 1/9 | <span class=\"rating rating-high-risk\">High Risk</span> |

## 8.8 Actions Required

| Gap | Action | Rating | Priority |
|---|---|---|---|
| Hard-coded secrets in `config/ivr_legacy.php` | Move to `.env` vars; purge from Git history with BFG | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-critical\">Critical</span> |
| No branch protection or code review signals | Add `CODEOWNERS`, PR template, enable branch protection rules | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-high\">High</span> |
| No containerized dev environment | Generate `docker-compose.yml` via Sail or manual Dockerfile | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| Code style not enforced locally | Install `husky` + `lint-staged`; raise PHPStan to level 5+ | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-high\">High</span> |
| No AI-assisted tooling config | Add `CLAUDE.md`, `.cursor/rules`, module manifest JSON | <span class=\"rating rating-high-risk\">High Risk</span> | <span class=\"sev sev-medium\">Medium</span> |
| Missing FK constraints on CRM tables | Add migration with `foreignId()->constrained()` for `account_id`/`organization_id` | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-medium\">Medium</span> |
| `fakerphp/faker` in production `require` | Move to `require-dev` | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-low\">Low</span> |
| Minimal test coverage | Add per-module PHPUnit + Vitest tests | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-high\">High</span> |
| `react-router-dom` v5 likely unused | Verify and remove if unused | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-low\">Low</span> |
| 46-table migration in single file | Split into per-module or per-domain migrations | <span class=\"rating rating-moderate\">Moderate</span> | <span class=\"sev sev-low\">Low</span> |

Full report saved to `docs/discovery/08-technical-debt.md` with all evidence sections (8.1–8.5), three Mermaid diagrams, and expected outcomes.","stop_reason":"end_turn","session_id":"27abc41b-5ee6-4442-9d6e-a675c6b2a40c","total_cost_usd":2.1733624999999996,"usage":{"input_tokens":23,"cache_creation_input_tokens":89806,"cache_read_input_tokens":1372989,"output_tokens":23297,"server_tool_use":{"web_search_requests":0,"web_fetch_requests":0},"service_tier":"standard","cache_creation":{"ephemeral_1h_input_tokens":89806,"ephemeral_5m_input_tokens":0},"inference_geo":"not_available","iterations":[{"input_tokens":1,"output_tokens":1933,"cache_read_input_tokens":92222,"cache_creation_input_tokens":6939,"cache_creation":{"ephemeral_5m_input_tokens":0,"ephemeral_1h_input_tokens":6939},"type":"message"}],"speed":"standard"},"modelUsage":{"claude-haiku-4-5-20251001":{"inputTokens":6178,"outputTokens":18,"cacheReadInputTokens":0,"cacheCreationInputTokens":0,"webSearchRequests":0,"costUSD":0.006268,"contextWindow":200000,"maxOutputTokens":32000},"claude-opus-4-6":{"inputTokens":23,"outputTokens":23297,"cacheReadInputTokens":1372989,"cacheCreationInputTokens":89806,"webSearchRequests":0,"costUSD":2.1670944999999993,"contextWindow":200000,"maxOutputTokens":64000}},"permission_denials":[],"terminal_reason":"completed","fast_mode_state":"off","uuid":"abd3a9c0-eb73-4c15-a79b-e0c1d1f8fd38"}