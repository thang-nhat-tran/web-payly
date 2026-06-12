# Payly

Payly is a group expense–splitting web app.

Built with **Vue 3 + Vite + TypeScript**, **Pinia** (state), **Vue Router**,
**Supabase** (backend/auth), **Tailwind CSS v4**, **vee-validate + Zod** (forms),
and **Vitest** (unit tests).

## Requirements

- Node `^20.19.0 || >=22.12.0`
- npm

## Setup

```sh
npm install
```

## Development

Start the dev server with hot-reload:

```sh
npm run dev
```

## Build

Type-check, compile, and minify for production:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

## Testing

Run the full unit-test suite once:

```sh
npm test
```

Watch mode (re-runs affected tests on change):

```sh
npm run test:watch
```

Run a single test file — pass the path after `--`:

```sh
npm test -- src/shared/utils/currency.util.test.ts
```

You can also filter by a filename substring:

```sh
npm test -- currency
```

## Lint & Format

```sh
npm run lint           # oxlint + eslint, with --fix
npm run format         # format src/ with Prettier (writes changes)
npm run format:check   # verify formatting without writing (used in CI)
```

The generated `src/shared/lib/database.types.ts` is excluded from Prettier via
`.prettierignore`.

## Database Types

Regenerate the Supabase database types (writes to
`src/shared/lib/database.types.ts`):

```sh
npm run gen:types
```

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).
