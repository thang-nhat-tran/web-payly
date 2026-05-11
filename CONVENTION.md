# Vue + TypeScript Codebase Conventions

> Simple rules. Easy to follow. Consistent across the whole team.

---

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [Folder Structure & Purpose](#folder-structure--purpose)
3. [Data Flow](#data-flow)
4. [Hard Rules](#hard-rules)

---

## Naming Conventions

### Files & Folders

| Pattern          | Used for          | Example                                   |
| ---------------- | ----------------- | ----------------------------------------- |
| `PascalCase.vue` | Components, Views | `TodoItem.vue`, `HomeView.vue`            |
| `camelCase.ts`   | Everything else   | `useTodos.ts`, `todoStore.ts`, `todos.ts` |
| `kebab-case/`    | Folders           | `todo-list/`, `user-profile/`             |

### Composables

Always prefix with `use` — this is a Vue ecosystem requirement.

Group composables by domain in a subfolder. Each composable is its own file — no barrel `index.ts`.

Pinia stores are already composables — use them directly for global state. Only create a composable when you need local state (loading, error) or logic around an action.

```
composables/
└── auth/
    ├── useLoginWithGoogle.ts → verb-based (action + local loading/error)
    └── useLogout.ts          → verb-based (action + local loading)

stores/
└── authStore.ts              → global state — used directly as a composable
```

Import directly from the file — never from a folder index:

```ts
// ✅
import { useLoginWithGoogle } from '@/composables/auth/useLoginWithGoogle'

// ❌ No barrel imports
import { useLoginWithGoogle } from '@/composables/auth'
```

### Stores (Pinia)

Suffix with `Store` to distinguish from composables.

```
useTodoStore.ts
useAuthStore.ts
useCartStore.ts
```

### Types & Interfaces

```ts
// Domain models — PascalCase
interface Todo { ... }
type TodoFilter = 'all' | 'active' | 'done'

// Request payload types — Verb + Noun + Payload
type CreateTodoPayload = Omit<Todo, 'id'>
type UpdateUserPayload = Partial<Omit<User, 'id'>>
```

### API Layer

Two layers — a client wrapper and domain-specific API objects.

```
api/supabaseClient.ts → export const supabaseClient = { ... }   ← transport only
api/authApi.ts   → export const authApi = { ... }          ← calls supabaseClient
api/todosApi.ts  → export const todosApi = { ... }         ← calls supabaseClient
```

- `supabaseClient.ts` is the only file that imports from `@/lib/supabase`. All domain API files go through it — never import supabase directly elsewhere.
- Domain API files suffix with `Api` — no `Service`.

### Components

| Pattern         | Purpose                    | Example                                |
| --------------- | -------------------------- | -------------------------------------- |
| `Base + Noun`   | Generic, reusable anywhere | `BaseButton`, `BaseInput`, `BaseModal` |
| `Domain + Role` | Domain-specific UI         | `TodoItem`, `TodoForm`, `UserAvatar`   |
| `The + Noun`    | Singleton layout parts     | `TheHeader`, `TheFooter`, `TheSidebar` |
| `Icon + Name`   | SVG icon wrapper           | `IconGoogle`, `IconChevron`            |

### SVG Icons

Raw SVG files live in `src/assets/icons/`. Each icon is wrapped in a thin Vue component under `src/components/common/` using `vite-svg-loader`.

```
src/assets/icons/google.svg          ← raw SVG source
src/components/common/icons/IconGoogle.vue  ← Vue component wrapper
```

**Icon component pattern:**

```vue
<!-- src/components/common/IconGoogle.vue -->
<script setup lang="ts">
import GoogleSvg from '@/assets/icons/google.svg?component'
</script>

<template>
  <GoogleSvg aria-hidden="true" />
</template>
```

**Usage in views/components:**

```ts
import IconGoogle from '@/components/common/icons/IconGoogle.vue'
```

```html
<IconGoogle class="shrink-0" />
```

**Rules:**
- Never inline SVG markup in templates — always go through the icon component
- Raw `.svg` files are in `assets/icons/` only; never placed inside `components/`
- Always add `aria-hidden="true"` on decorative icons

---

## Folder Structure & Purpose

```
src/
├── assets/
│   └── icons/      # Raw SVG files — consumed via vite-svg-loader, never inlined
│
├── types/          # Shared TypeScript types — no logic, just shapes
│   ├── todo.ts     # Domain models (Todo, TodoFilter)
│   ├── api.ts      # API response shapes (ApiResponse<T>, PaginatedResponse<T>)
│   └── common.ts   # Utility types (AsyncStatus, AsyncState<T>)
│
├── api/            # ONLY place that makes HTTP calls
│   ├── supabaseClient.ts  # supabaseClient — shared wrapper for all Supabase calls
│   ├── authApi.ts  # authApi — login, logout, session (calls supabaseClient)
│   └── todos.ts    # todosApi — CRUD for /todos (calls supabaseClient)
│
├── stores/         # Pinia — global state shared across multiple views
│   ├── todoStore.ts
│   └── authStore.ts
│
├── composables/    # Reusable logic — one file per composable, grouped by domain
│   ├── auth/
│   │   ├── useAuthStore.ts
│   │   ├── useLoginWithGoogle.ts
│   │   └── useLogout.ts
│   └── todo/
│       └── useTodoStore.ts
│
├── components/     # UI only — props in, events out, no API calls
│   ├── common/     # BaseButton, BaseInput, BaseModal...
│   │   └── icons/  # IconGoogle, IconChevron... (SVG wrappers via vite-svg-loader)
│   ├── todo/       # TodoItem, TodoForm, TodoList
│   └── layout/     # TheHeader, TheSidebar, TheFooter
│
├── views/          # Pages — maps to router routes
│   ├── HomeView.vue
│   └── ArchiveView.vue
│
├── router/
│   └── index.ts    # URL → View mapping only, lazy imports
│
└── utils/          # Pure functions, no Vue dependency
    └── dateUtils.ts
```

### Each folder's single responsibility

| Folder         | Knows about                      | Does NOT know about |
| -------------- | -------------------------------- | ------------------- |
| `types/`       | Data shapes                      | Anything else       |
| `api/`         | HTTP endpoints, request/response | Vue, stores, UI     |
| `stores/`      | Global state, calls `api/`       | UI, DOM             |
| `composables/` | Vue reactivity, calls stores     | UI layout           |
| `components/`  | Props, emits, template           | Stores, API         |
| `views/`       | Composables, components          | Direct API calls    |

### Scaling up — feature-based structure

When the app grows beyond ~5 domains, group by feature:

```
src/
├── features/
│   ├── todo/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── api/
│   │   └── types/
│   └── auth/
│       ├── components/
│       ├── composables/
│       └── types/
├── shared/         # Used across multiple features
│   ├── components/
│   ├── utils/
│   └── types/
└── stores/         # Still global — stays at root level
```

---

## Data Flow

Data flows **one direction** — from the server down to the UI.

```
API Server
    ↕
api/            ← only layer that calls HTTP
    ↕
stores/         ← calls api/, holds global state
    ↕
composables/    ← calls stores, exposes computed + actions
    ↓ props / ↑ emit
views/          ← only place that calls composables
    ↓ props / ↑ emit
components/     ← receives props, emits events, renders UI
```

### Example: user clicks "Add Todo"

```
1. TodoForm.vue        emit('add', text)
2. HomeView.vue        @add="addTodo(text)"
3. useTodos.ts         addTodo() → store.addTodo(payload)
4. todoStore.ts        addTodo() → todosApi.create(payload)
5. api/todos.ts        http.post('/todos', payload)
6. api/client.ts       axios instance → server
```

### Flow rules — what can call what

| Layer          | Can call                      | Cannot call              |
| -------------- | ----------------------------- | ------------------------ |
| `components/`  | — (props/emit only)           | stores, api, composables |
| `views/`       | composables, stores (state)   | api directly             |
| `composables/` | stores, api/                  | components               |
| `stores/`      | api/                          | composables, components  |
| `api/`         | httpClient                    | anything Vue-related     |

> Views may import Pinia stores directly for reading global state. For actions with local loading/error state, use a composable.

---

## Hard Rules

### TypeScript

```ts
// ✅ Use import type for type-only imports
import type { Todo } from '@/types/todo'

// ✅ Use unknown instead of any
catch (e: unknown) {
  const message = (e as Error).message
}

// ✅ Derive payload types from the source model
type CreateTodoPayload = Omit<Todo, 'id' | 'createdAt'>
type UpdateTodoPayload = Partial<Omit<Todo, 'id'>>

// ✅ Prefer interface for object shapes
interface Todo {
  id: number
  text: string
  done: boolean
}

// ✅ Prefer type for unions, derived types, primitives
type TodoFilter = 'all' | 'active' | 'done'
type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

// ❌ Never use any
const data: any = response.data

// ❌ Never redeclare the same type in multiple files
// Define once in types/, import everywhere
```

### Components

```ts
// ✅ Always use <script setup lang="ts">
// ✅ TypeScript generics for props and emits
const { todo } = defineProps<{ todo: Todo }>()

const emit = defineEmits<{
  toggle: [id: number]
  remove: [id: number]
}>()

// ✅ Move complex template logic into computed
const hasActiveTodos = computed(() => todos.value.some((t) => !t.done))

// ❌ Never put business logic in the template
// v-if="todos.filter(t => !t.done).length > 0"  →  move to computed
```

### Imports

```ts
// ✅ Always use @ alias — never relative paths beyond 1 level
import type { Todo } from '@/types/todo'
import { useLoginWithGoogle } from '@/composables/auth/useLoginWithGoogle'

// ❌ Avoid deep relative imports
import type { Todo } from '../../../types/todo'

// ❌ No barrel/index imports
import { useLoginWithGoogle } from '@/composables/auth'
```

### Exports

```ts
// Composables — named function export
export function useTodos() { ... }

// API layer — named object export
export const todosApi = {
  getAll: (): Promise<Todo[]> => http.get('/todos').then(r => r.data),
  create: (payload: CreateTodoPayload): Promise<Todo> => http.post('/todos', payload).then(r => r.data),
}

// Types — named exports only, never default export
export interface Todo { ... }
export type TodoFilter = ...

// Stores — Pinia defineStore
export const useTodoStore = defineStore('todo', () => { ... })
```

### Router

```ts
// ✅ Always lazy-load views
const routes = [
  { path: '/', component: () => import('@/views/HomeView.vue') },
  { path: '/archive', component: () => import('@/views/ArchiveView.vue') },
]

// ❌ Never import component logic directly in router
// ❌ Never put anything other than route definitions here
```

---

## Quick Reference

```
PascalCase.vue        → component or view
camelCase.ts          → composable, store, api, util, type file
use + Noun/Verb       → composable  (useLoginWithGoogle, useLogout)
use + Noun + Store    → pinia store (useTodoStore) or state composable (useAuthStore)
domain + Api          → api export  (todosApi)
Base + Noun           → generic component (BaseButton)
The + Noun            → singleton layout (TheHeader)
Domain + Role         → domain component (TodoItem)

types/    → shapes only, no logic
api/      → HTTP only, no Vue
stores/   → state + api calls
composables/ → logic + reactivity
components/  → UI + props/emit
views/    → page = composable + components
```
