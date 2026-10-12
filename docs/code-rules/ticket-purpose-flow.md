# Ticket, Purpose, Flow

Before any branch, commit or PR.

## Ticket

- Every change is driven by a ticket (a Jira key or Redmine issue ID). If none was provided and the branch name doesn't contain one, **ask**. Don't invent one. Use `0000` only if the user explicitly agrees to a placeholder.
- One ticket covers one purpose. For IVR modernization, a ticket normally covers one module (e.g. `call-flow`) or one cross-cutting fix (e.g. removing `Model::unguard()`, reconciling the ESLint/Prettier indent).

## Branch

- `type/TICKET-ID-kebab-summary`, e.g. `refactor/12345-ivr-call-flow-module`.
- Branch from the current base branch (`master` today), keep it up to date before review, and delete it after merge.
- No hook enforces this; it's a team convention.

## Commits

- `TICKET-ID (type): summary`. Types: `feat|fix|hotfix|docs|style|refactor|test|chore|merge|enhance`.
- The subject is in the present tense, under about 72 characters, and has a `Closes: TICKET-ID` footer when the commit closes the ticket.
- Keep commits atomic. A module migration typically looks like:
  1. `(test)`: failing feature tests for the module
  2. `(refactor)`: new web routes, controller, request and model changes
  3. `(refactor)`: new Inertia pages
  4. `(chore)`: delete the module's legacy controllers, routes, service, repository and frontend files
- Keep formatting-only or config-only changes in their own commits.
- No commitlint/husky is installed, so check the format yourself.

## PR

- Description: the purpose (the ticket), what moved where, which legacy files were deleted and the reachability evidence, which legacy behaviors were intentionally dropped (security defects, the broken `/ivr-legacy` fetches), and the **gate results actually run** (`php artisan test`, `vendor/bin/phpstan analyse`, `npm test`, `npx tsc --noEmit`, `npm run build`), with any pre-existing failures named as such.
- Run the review checklist in `code-review.md` before asking for review.
