# Vue + TypeScript Codebase Conventions

> Simple rules. Easy to follow. Consistent across the whole team.
> For file & folder naming rules, see [NAMING_CONVENTION.md](./NAMING_CONVENTION.md).
> For emit & prop usage rules, see [EMIT_PROP_CONVENTION.md](./EMIT_PROP_CONVENTION.md).

---

## Table of Contents

1. [Folder Responsibilities](#folder-responsibilities)
2. [Data Flow](#data-flow)
3. [Hard Rules](#hard-rules)

---

## Folder Responsibilities

| Folder          | Owns                                      | Never touches               |
| --------------- | ----------------------------------------- | --------------------------- |
| `types/`        | Data shapes, payload interfaces           | Logic, Vue, API             |
| `schemas/`      | Zod schemas, form types                   | Business logic              |
| `api/`          | Supabase calls, request/response mapping  | Vue reactivity, stores, UI  |
| `composables/`  | Local state (loading, error), API calls   | UI layout, DOM              |
| `stores/`       | Global state shared across views          | UI, DOM                     |
| `components/`   | Props in, emits out, template             | Stores, API, composables    |
| `views/`        | Wires composables + components            | Direct API calls            |

---

## Data Flow

```
Supabase
    ↕
features/*/api/        ← only layer that calls supabase
    ↕
features/*/composables/ ← local state + calls api
    ↓ props / ↑ emit
features/*/views/      ← calls composables, passes data down
    ↓ props / ↑ emit
features/*/components/ ← pure UI, props/emit only
```

### What can call what

| Layer           | Can call                        | Cannot call                  |
| --------------- | ------------------------------- | ---------------------------- |
| `components/`   | — (props/emit only)             | stores, api, composables     |
| `views/`        | composables, stores (read only) | api directly                 |
| `composables/`  | api, stores                     | components                   |
| `stores/`       | api                             | composables, components      |
| `api/`          | supabase client                 | anything Vue-related         |

---

## Hard Rules

### TypeScript

```ts
// ✅ Use import type for type-only imports
import type { Group } from '@/features/group/types/group.types'

// ✅ Use unknown instead of any
catch (e: unknown) {
  error.value = e instanceof Error ? e.message : String(e)
}

// ✅ Prefer interface for object shapes
interface Group {
  id: string
  name: string
}

// ✅ Prefer type for unions and derived types
type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

// ❌ Never use any
// ❌ Never redeclare a type that already exists in types/
```

### Components

```ts
// ✅ Always <script setup lang="ts">
// ✅ Typed props and emits
defineProps<{ group: Group }>()
defineEmits<{ submit: [CreateGroupPayload]; close: [] }>()

// ✅ Move complex template logic into computed
const visibleMembers = computed(() => group.members.slice(0, MAX_VISIBLE))

// ❌ No business logic in the template
```

### Imports

```ts
// ✅ Always use @ alias
import { useCreateGroup } from '@/features/group/composables/useCreateGroup'

// ❌ No deep relative imports
import { useCreateGroup } from '../../../composables/useCreateGroup'

// ❌ No barrel/index imports
import { useCreateGroup } from '@/features/group/composables'
```

### Exports

```ts
// Composables — named function
export function useCreateGroup() { ... }

// API — named object
export const groupApi = {
  fetchGroups: (userId: string) => ...,
  createGroup: (payload: CreateGroupPayload) => ...,
}

// Types — named only, never default export
export interface Group { ... }
export type CreateGroupPayload = { ... }
```

### Router

```ts
// ✅ Always lazy-load views
{ path: '/groups', component: () => import('@/features/group/views/GroupListView.vue') }

// ❌ Never import component logic directly in the router
```
