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

```
useTodos.ts       → noun-based (managing a resource)
useAuth.ts        → noun-based
useFetch.ts       → verb-based (generic action)
useLocalStorage.ts → verb-based
useDebounce.ts    → verb-based
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

Suffix with `Api`, no `Service` — keep it simple.

```
api/todos.ts    → export const todosApi = { ... }
api/auth.ts     → export const authApi = { ... }
api/users.ts    → export const usersApi = { ... }
```

### Components

| Pattern         | Purpose                    | Example                                |
| --------------- | -------------------------- | -------------------------------------- |
| `Base + Noun`   | Generic, reusable anywhere | `BaseButton`, `BaseInput`, `BaseModal` |
| `Domain + Role` | Domain-specific UI         | `TodoItem`, `TodoForm`, `UserAvatar`   |
| `The + Noun`    | Singleton layout parts     | `TheHeader`, `TheFooter`, `TheSidebar` |

---

## Folder Structure & Purpose

```
src/
├── types/          # Shared TypeScript types — no logic, just shapes
│   ├── todo.ts     # Domain models (Todo, TodoFilter)
│   ├── api.ts      # API response shapes (ApiResponse<T>, PaginatedResponse<T>)
│   └── common.ts   # Utility types (AsyncStatus, AsyncState<T>)
│
├── api/            # ONLY place that makes HTTP calls
│   ├── client.ts   # Single axios instance — config once, use everywhere
│   ├── todos.ts    # todosApi — CRUD for /todos
│   └── auth.ts     # authApi — login, logout, refresh
│
├── stores/         # Pinia — global state shared across multiple views
│   ├── todoStore.ts
│   └── authStore.ts
│
├── composables/    # Reusable logic — computed, watchers, side effects
│   ├── useTodos.ts
│   ├── useAuth.ts
│   └── useLocalStorage.ts
│
├── components/     # UI only — props in, events out, no API calls
│   ├── common/     # BaseButton, BaseInput, BaseModal...
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

| Layer          | Can call            | Cannot call              |
| -------------- | ------------------- | ------------------------ |
| `components/`  | — (props/emit only) | stores, api, composables |
| `views/`       | composables         | api directly             |
| `composables/` | stores              | api directly             |
| `stores/`      | api/                | composables, components  |
| `api/`         | httpClient          | anything Vue-related     |

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
import { useTodos } from '@/composables/useTodos'

// ❌ Avoid deep relative imports
import type { Todo } from '../../../types/todo'
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
use + Noun/Verb       → composable  (useTodos, useFetch)
use + Noun + Store    → pinia store (useTodoStore)
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
