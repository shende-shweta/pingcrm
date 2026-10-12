# Maintainability

## Direction of travel

Every change to IVR code should leave the module closer to the PingCRM CRUD / IVR hub-module shape (see `code-structure.md`). A change is going the wrong way if it:

- Moves legacy code into new filenames without changing how it's coupled.
- Adds logic to a generated controller, god service, `legacyFormattersN`, `use*LegacyN` hook or `*Monolith*` component.
- Leaves a migrated module's old `/api/ivr-legacy/<slug>/*` routes or files in place "for safety". Dead parallel paths are themselves a hazard.
- Converts a file to TypeScript but leaves `any` at the prop or API boundary.

## Size and responsibility

- Aim for controllers under about 200 lines with no more than about 7 actions, and pages under about 300 lines. Split a page into `components/<feature>/` pieces when it mixes several distinct widgets (as `Pages/Ivr/Hub/Index.tsx` at about 480 lines is starting to).
- One responsibility per unit: the controller orchestrates, the request validates, the model/repository queries, and the page renders.
- Write duplicated logic once. Validation rules shared by store and update go in one `FormRequest` or a shared rules method. Formatting helpers go in one typed util, not N copies.

## Dead code

- The legacy frontend folders `components/legacy/`, `legacy/class/`, `hooks/legacy/` and `utils/duplicate/` have zero importers. Of about 510 `Pages/Ivr/<Module>/*.tsx` files, only about 82 are named in any `Inertia::render`. Delete dead files as part of the module that owns them, after a reachability check:
  - `grep -rn "<FileOrExport>" resources/js` finds no importers,
  - `grep -rn "Ivr/<Module>/<Screen>" app` finds no render call,
  - and `routes/` doesn't reference the controller.
- Never keep a file "in case". Git history keeps it.

## Generated code

- `tools/generate-legacy-enterprise-ivr*.{php,mjs}` and `tools/sync-ivr-legacy-routes.php` created the legacy surface. Re-running them would overwrite migration work. Don't run them, and once the legacy surface is gone, propose deleting them.

## Configuration drift

- Keep the `@` alias in sync across `vite.config.ts`, `vitest.config.ts` and `tsconfig.json`.
- Keep `app.tsx` and `ssr.tsx` page resolution identical.
- If you fix the ESLint/Prettier indent conflict, do it as a dedicated commit that touches only the configs, plus at most a separate mechanical reformat commit.
