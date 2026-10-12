# Code Style

## General

- `.editorconfig` is authoritative for whitespace: **4 spaces** (2 for YAML), LF, final newline, trimmed trailing whitespace.
- Keep names, comment density and idioms consistent with the surrounding clean code, not with the generated legacy code.
- No commented-out code, no `// TODO` without a ticket ID, and no "explanatory" comments that only restate the code. Legacy markers such as `// SQLi pattern for discovery bots` must disappear along with the code they describe.

## PHP

- PSR-12 / Laravel style; CI runs Pint via `coding-standards.yml`. Pint isn't a local dependency, so match the existing formatting by hand or run `vendor/bin/pint` after installing it.
- Type every new method's parameters and return values (`: Response`, `: RedirectResponse`, `: array`). Annotate arrays with docblock generics where useful (`/** @return list<array{id: int, name: string}> */`, as in `IvrAccountContext`).
- Prefer `final` for new support classes and constructor property promotion with `readonly` for value objects.
- Use single-quoted strings unless you need interpolation. The legacy files use double quotes everywhere; don't copy that.
- Use facades or injected dependencies as the clean controllers do; no `new FooGodService()` inside actions.

## TypeScript / React

- Only `.ts` and `.tsx` files. Don't create `.js` or `.jsx` (`tsconfig.json` doesn't typecheck them).
- Prettier settings (`.prettierrc`): no semicolons, single quotes, trailing commas. **Known conflict**: `.prettierrc` sets `tabWidth: 2` and `.eslintrc.cjs` sets `indent: 2`, but the code uses 4 spaces. Until the configs are reconciled, keep 4 spaces and don't run `npm run fix-code-style` on files you didn't change.
- Function components with a named function and a default export: `function ContactsIndex(props: Props) { … }` then `ContactsIndex.layout = authenticatedLayout` and `export default ContactsIndex`.
- Use `interface Props extends SharedPageProps { … }` for page props, and `type` for unions and aliases.
- Style with Tailwind classes and the existing component classes (`btn-indigo`, `form-input`, `form-select`). No inline `style={{}}` except for truly dynamic values (for example chart colors).
- Use lodash path imports (`import pickBy from 'lodash/pickBy'`), not the whole package.
- Use `@/` imports.

## Naming

- Inertia component names are `<Area>/<Screen>` in PascalCase (`Ivr/CallFlow/Index`), matching the file path.
- Route names are dot-separated and lowercase (`ivr.call-flow.update`), and URL slugs are kebab-case (`call-flow`).
- Don't add numbered variants (`Foo1`, `fooFn_2`, `LegacyPass2_47`). That pattern is a generator artifact.
