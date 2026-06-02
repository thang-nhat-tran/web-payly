# Vue + TypeScript Naming Conventions

This document defines the naming standards for files, folders, and exports in our Vue + TypeScript architecture.

The core philosophy is **Predictability & IDE Grouping**: file names should describe their purpose and automatically sort related features together in your code editor.

---

# 1. The Grammatical Rules (Entity vs. Action)

To keep the file tree organized, we separate static UI (Things) from logic (Actions) using strict grammatical patterns.

## 🟢 UI & Colocated Files: `[Entity] + [Action] + [Element]`

UI components and their directly associated files are static "Things". Always lead with the Entity (Domain) so that all related files are clustered together alphabetically in the file tree.

### Components

```text
GroupCreateModal.vue
```

### Folders

```text
group-create-modal/
```

### Colocated

```text
group-create.schema.ts
group-create.type.ts
group-create.helper.ts
```

---

## 🔵 Pure Logic (Composables & Functions): `[Action] + [Entity]`

Logic files represent "Actions" running in the system.

Because they live in isolated folders (`composables/`, `api/`, etc.), they will not break component sorting. Therefore, they should read like natural English commands.

### Composables

```text
useCreateGroup.ts
```

### API Calls

```ts
createGroup()
```

---

# 2. File & Folder Casing Matrix

Use this matrix to instantly know how to name a file based on its type.

| Target Type           | Casing Rule | Pattern / Suffix     | Examples                                |
| --------------------- | ----------- | -------------------- | --------------------------------------- |
| Folders               | kebab-case  | N/A                  | `modules/group/`, `group-create-modal/` |
| Vue Components        | PascalCase  | `.vue`               | `GroupCreateModal.vue`, `UserList.vue`  |
| Vue Composables       | camelCase   | `use[Name].ts`       | `useCreateGroup.ts`                     |
| Colocated Files       | kebab-case  | `[name].[role].ts`   | `group-create-modal.helper.ts`          |
| Domain Infrastructure | kebab-case  | `[domain].[role].ts` | `group.api.ts`, `auth.store.ts`         |

---

# 3. Infrastructure Files (The Suffix Rule)

For all non-UI and non-composable TypeScript files, use:

```text
[domain].[layer].ts
```

This keeps the architecture predictable and domain-driven.

| Purpose             | Pattern                 | Example                |
| ------------------- | ----------------------- | ---------------------- |
| API & Networking    | `[domain].api.ts`       | `group.api.ts`         |
| State Management    | `[domain].store.ts`     | `expense.store.ts`     |
| Type Definitions    | `[domain].types.ts`     | `group.types.ts`       |
| Data Transformation | `[domain].mapper.ts`    | `user.mapper.ts`       |
| Constants           | `[domain].constants.ts` | `payment.constants.ts` |
| Utilities           | `[concept].util.ts`     | `date.util.ts`         |
| Colocated Helpers   | `[name].helper.ts`      | `group-card.helper.ts` |

---

# 4. Code Exports (Inside the Files)

How you name exported symbols is just as important as the file name.

| Construct             | Rule             | Example                             |
| --------------------- | ---------------- | ----------------------------------- |
| Interfaces & Types    | PascalCase       | `GroupCreateRequest`, `GroupStatus` |
| Validation Schemas    | camelCase        | `groupCreateSchema`                 |
| Constants             | UPPER_SNAKE_CASE | `MAX_GROUP_MEMBERS`                 |
| Functions / Variables | camelCase        | `parseGroupData`                    |

## Interfaces & Types

```ts
export interface GroupCreateRequest {}

export type GroupStatus = 'active' | 'inactive'
```

## Validation Schemas

```ts
export const groupCreateSchema = z.object({})
```

## Constants

```ts
export const MAX_GROUP_MEMBERS = 50
```

## Functions & Variables

```ts
export const parseGroupData = () => {}
```

---

# 5. Architectural Anti-Patterns (What to Avoid)

## ❌ Avoid Generic "Dump Files"

Never create files such as:

```text
types.ts
helpers.ts
common.ts
```

Instead, always prefix them with the domain they belong to.

✅ Good:

```text
group.types.ts
user.types.ts
payment.constants.ts
```

---

## ❌ Avoid PascalCase or camelCase for Folders

Even if a folder contains exactly one PascalCase component, the folder itself must remain kebab-case.

❌ Bad

```text
components/
└── GroupCard/
    └── GroupCard.vue
```

✅ Good

```text
components/
└── group-card/
    └── GroupCard.vue
```

---

## ❌ Avoid Global Router Dumping

Do not place all routes inside a single global router file.

❌ Bad

```text
src/router/index.ts
```

Containing every route in the application.

✅ Good

```text
modules/group/router.ts
modules/auth/router.ts
modules/expense/router.ts
```

Each module owns its routes and exports them to the root router for composition.

---
