# Vue + TypeScript Codebase Conventions

> Simple rules. Easy to follow. Consistent across the whole team.
> For file & folder naming rules, see [NAMING_CONVENTION.md](https://www.google.com/search?q=./NAMING_CONVENTION.md).
> For emit & prop usage rules, see [EMIT_PROP_CONVENTION.md](https://www.google.com/search?q=./EMIT_PROP_CONVENTION.md).

---

## Table of Contents

1. [Architecture & Folder Responsibilities](https://www.google.com/search?q=%23architecture--folder-responsibilities)
2. [Data Flow & Communication](https://www.google.com/search?q=%23data-flow--communication)
3. [Hard Rules](https://www.google.com/search?q=%23hard-rules)

---

## Architecture & Folder Responsibilities

The codebase follows a **Modular MVVM** architecture combined with **Component Colocation**. Everything is divided into `shared/` (global) and `modules/` (feature-specific).

### 1. Shared Level (`src/shared/`)

Owns everything global, reusable, or infrastructural.

| Folder         | Owns                                              | Never touches                          |
| -------------- | ------------------------------------------------- | -------------------------------------- |
| `lib/`         | Third-party SDK wrappers (Supabase, Payment).     | Business logic, Vue reactivity.        |
| `stores/`      | Global state (Auth, App, Theme).                  | Module-specific logic.                 |
| `components/`  | Generic, reusable UI (Buttons, Modals).           | APIs, Stores, specific business logic. |
| `types/`       | Global types (`ApiResponse<T>`, `Pagination`).    | Domain entities.                       |
| `composables/` | Global utilities (`useFormatDate`, `useStorage`). | Module-specific API calls.             |

### 2. Module Level (`src/modules/*/`)

Owns domain-specific logic. Independent and isolated.

| Folder         | Owns                                                | Never touches                                   |
| -------------- | --------------------------------------------------- | ----------------------------------------------- |
| `types/`       | Core domain entities (e.g., `Claim`, `User`).       | UI logic shared cross module.                   |
| `api/`         | Endpoints for this module + Request/Response types. | Direct 3rd-party SDKs (must use `shared/lib/`). |
| `stores/`      | Module-scoped state (e.g., filters, cached lists).  | Other modules' internal state.                  |
| `composables/` | Shared logic across multiple Views in this module.  | DOM manipulation.                               |
| `views/`       | Page orchestrators. Wires data to components.       | Direct DOM/CSS styling.                         |
| `router.ts`    | Route definitions specific to this module.          | Routes belonging to other modules.              |

### 3. Component Level (Colocation - `src/modules/*/components/ComponentName/`)

Components own their specific dependencies.

| File Type      | Owns                                                                  |
| -------------- | --------------------------------------------------------------------- |
| `*.vue`        | Template, UI binding, props/emits definition.                         |
| `use*.ts`      | Local Composable (ViewModel). State and API logic for this component. |
| `*.schema.ts`  | Zod validation schemas + inferred types for this form.                |
| `*.helpers.ts` | Pure processing functions (no reactivity, highly testable).           |
| `*.types.ts`   | Types/Constants used strictly inside this component.                  |

### 4. Standard Module Anatomy

This is how a standard module is structured internally so new developers know exactly where to find and place files.

```text
src/
└── modules/
    └── group/
        │
        ├── api/
        │   └── group.api.ts
        │
        ├── components/
        │   ├── group-create-modal/
        │   │   ├── GroupCreateModal.vue
        │   │   ├── group-create-modal.helper.ts
        │   │   └── group-create.schema.ts
        │   │
        │   └── group-member-row/
        │       └── GroupMemberRow.vue
        │
        ├── composables/
        │   └── useCreateGroup.ts
        │
        ├── types/
        │   └── group.types.ts
        │
        ├── views/
        │   ├── GroupDetailView.vue
        │   └── GroupListView.vue
        │
        └── router.ts
```

## Module Folder Breakdown

### `api/`

Contains pure TypeScript files for making HTTP requests.

Examples:

```text
group.api.ts
expense.api.ts
```

No UI logic belongs here.

### `components/`

Reusable UI pieces.

Must follow the **Entity First** naming rule.

Examples:

```text
group-create-modal/
group-member-row/
```

### `composables/`

Vue Composition API hooks (`useXxx.ts`).

Responsibilities:

- Shared state
- Business logic
- Connect UI to API layer

Example:

```text
useCreateGroup.ts
```

### `types/`

Contains domain models and TypeScript types.

Example:

```text
group.types.ts
```

### `views/`

Page-level Vue components mapped to routes.

Always use the `View` suffix.

Examples:

```text
GroupDetailView.vue
GroupListView.vue
```

### `router.ts`

Defines routes for the specific module.

Exports an array of routes to be merged into the global router.

---

## Data Flow & Communication

```text
shared/lib/supabase (Infrastructure)
        ↕
modules/*/api/ (Model)
        ↕
modules/*/composables/ OR components/*/use*.ts (ViewModel)
        ↕
modules/*/views/ OR components/*/*.vue (View)

```

### Component Delegation (Smart vs. Dumb)

| Component Type      | Behavior                                                                                                        | Can call                             | Cannot call                |
| ------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------------- |
| **Smart Component** | Autonomous. Handles its own logic, API calls, and local state. Emits only high-level events (e.g., `@success`). | Local Composables (`use*.ts`), APIs. | Parent's internal state.   |
| **Dumb Component**  | Presentational. Relies entirely on data passed down. Emits raw data up.                                         | — (Props/Emit only).                 | Stores, APIs, Composables. |

> **Rule of thumb:** Large, specific forms (e.g., `StaffAssignmentForm`) should be **Smart**. Generic UI or multi-step form pieces should be **Dumb**.

---

## Hard Rules

### 1. Third-Party Isolation

```ts
// ✅ Wrap SDKs in shared/lib/
import { supabase } from '@/shared/lib/supabase'

// ❌ Never import infrastructure SDKs directly into modules
import { createClient } from '@supabase/supabase-js'
```

> _Exception:_ Utility libraries like `zod` or `date-fns` can be imported directly into colocated component files.

### 2. Colocation over Fragmentation

```ts
// ✅ Keep component-specific logic inside its folder
components/ClaimForm/
  ├── ClaimForm.vue
  ├── ClaimForm.schema.ts
  └── useClaimForm.ts

// ❌ Do not pollute module-level folders with component-specific files
modules/claims/schemas/ClaimForm.schema.ts

```

### 3. Cross-Module Communication

```ts
// ✅ Communicate via exported Widgets or Stores (Public API)
import ClaimHistoryWidget from '@/modules/claims/components/ClaimHistoryWidget.vue'
import { useBillingStore } from '@/modules/billing/stores/useBillingStore'

// ❌ Never deep-import into another module's internals
import { fetchClaims } from '@/modules/claims/api/claimService'
```

### 4. TypeScript Strictness

```ts
// ✅ Colocate API types with API files
// In itemApi.ts
export type FetchItemsResponse = { ... }

// ✅ Infer types from Zod directly
export const formSchema = z.object({ ... })
export type FormInput = z.infer<typeof formSchema>

// ❌ Never use `any`. Use `unknown` for caught errors.
// ❌ Never redefine an entity type that already exists in `modules/*/types/`

```

### 5. Pure Functions Extraction

```ts
// ✅ Extract heavy processing out of .vue into pure TS helpers
// In ClaimCard.helpers.ts
export const calculateOverdueDays = (date: string): number => { ... }

// ❌ Do not clutter <script setup> with non-reactive calculation logic

```

### 6. Router & Navigation

```ts
// ✅ Keep module routes isolated within the module
// modules/claims/router.ts
export default [
  {
    path: '/claims',
    component: () => import('./views/ClaimInbox.vue'), // Always lazy-load
  },
]

// ✅ Merge module routes in the root router
// src/router/index.ts
import claimRoutes from '@/modules/claims/router'
import itemRoutes from '@/modules/items/router'

const routes = [...baseRoutes, ...claimRoutes, ...itemRoutes]

// ❌ Never dump all route definitions directly into `src/router/index.ts`
```
