# Vue + TypeScript File Naming Convention

## Table of Contents

- [General Rules](#general-rules)
- [Naming Conventions](#naming-conventions)
  - [Folders](#folders)
  - [Vue Components & Views](#vue-components--views)
  - [Composables](#composables)
  - [API Layer](#api-layer)
  - [Validation Schemas](#validation-schemas)
  - [Types](#types)
  - [Stores](#stores)
  - [Constants](#constants)
  - [Helpers](#helpers)
  - [Mappers / Transformers](#mappers--transformers)
  - [Utilities](#utilities)
  - [Routes](#routes)
- [Naming Inside Files](#naming-inside-files)
- [Architecture Rules](#architecture-rules)

---

## General Rules

> This doc governs **names only**. For folder structure & architecture, see [CODE_CONVENTION.md](./CODE_CONVENTION.md).

| Target | Convention |
| --- | --- |
| **Folders** | `kebab-case` |
| **Vue component & view files** | `PascalCase.vue` |
| **All other files** | `kebab-case` with a domain-specific suffix (see sections below) |

File names should describe the **purpose**, not the syntax.

---

# Naming Conventions

## Folders

### Rule

- All folders use `kebab-case` — no exceptions
- Colocated component folders follow the component name in kebab-case

### Examples

```txt
modules/group/
modules/group/components/create-group-modal/
modules/expense/components/expense-split-card/
shared/stores/
```

### Avoid

```txt
modules/Group/
components/CreateGroupModal/   ❌ PascalCase folder
components/expenseSplitCard/   ❌ camelCase folder
```

---

## Vue Components & Views

### Rule

- File name must be `PascalCase.vue`
- Component name and file name must match
- Applies to both `components/` and `views/`

### Examples

```txt
GroupCard.vue
CreateGroupModal.vue
GroupListView.vue
GroupDetailView.vue
```

---

## Composables

### Rule

- Use `useXxx.ts` — file must start with `use`

### Examples

```txt
useCreateGroup.ts
useGroupDetail.ts
useInfiniteScroll.ts
```

---

## API Layer

### Rule

- Use `module.api.ts`

### Examples

```txt
group.api.ts
auth.api.ts
payment.api.ts
```

---

## Validation Schemas

### Rule

- Use `action-module.schema.ts`
- Colocate inside the component folder when schema is component-specific (see [CODE_CONVENTION.md](./CODE_CONVENTION.md) §2)

### Examples

```txt
create-group.schema.ts     ← inside create-group-modal/
login.schema.ts
```

---

## Types

### Rule

- Use `module.types.ts`
- Domain entities only — API request/response types belong in `module.api.ts`

### Examples

```txt
group.types.ts
expense.types.ts
```

### Avoid

```txt
groupType.ts
typesGroup.ts
types.ts
```

---

## Stores

### Rule

- Use `module.store.ts`

### Examples

```txt
auth.store.ts
group.store.ts
```

---

## Constants

### Rule

- Use `module.constants.ts`

### Examples

```txt
group.constants.ts
auth.constants.ts
```

---

## Helpers

### Rule

- Use `ComponentName.helpers.ts` — colocated inside the component folder
- Pure functions only (no reactivity)

### Examples

```txt
expense-split-card/ExpenseSplitCard.helpers.ts
```

---

## Mappers / Transformers

### Rule

- Use `module.mapper.ts`

### Examples

```txt
group.mapper.ts
user.mapper.ts
```

---

## Utilities

### Rule

- Use `domain.util.ts`

### Examples

```txt
date.util.ts
string.util.ts
```

---

## Routes

### Rule

- One `router.ts` per module — default-exports the route array, merged in `src/router/index.ts`
- See [CODE_CONVENTION.md](./CODE_CONVENTION.md) §6

### Examples

```txt
modules/group/router.ts
modules/auth/router.ts
```

---

# Naming Inside Files

## Schemas

```ts
export const createGroupSchema
```

## Form Types

```ts
export type CreateGroupForm
```

## API Request

```ts
export interface CreateGroupRequest
```

## API Response

```ts
export interface GroupResponse
```

---

# Architecture Rules

## Prefer Module-Based Structure

✅ Good

```txt
modules/group/api/
modules/group/components/create-group-modal/
```

❌ Avoid

```txt
global/apis/
global/types/
global/schemas/
```

---

## Avoid Dump Files

Avoid generic file names:

```txt
helpers.ts
utils.ts
common.ts
types.ts
```

Prefer domain-specific names:

```txt
group.mapper.ts
date.util.ts
group.constants.ts
```
