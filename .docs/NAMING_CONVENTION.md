# Vue + TypeScript File Naming Convention

## Table of Contents

- [Vue + TypeScript File Naming Convention](#vue--typescript-file-naming-convention)
  - [Table of Contents](#table-of-contents)
  - [General Rules](#general-rules)
- [Folder Structure](#folder-structure)
- [Naming Conventions](#naming-conventions)
  - [Vue Components](#vue-components)
    - [Rule](#rule)
    - [Examples](#examples)
  - [Composables](#composables)
    - [Rule](#rule-1)
    - [Examples](#examples-1)
  - [API Layer](#api-layer)
    - [Rule](#rule-2)
    - [Examples](#examples-2)
  - [Validation Schemas](#validation-schemas)
    - [Rule](#rule-3)
    - [Examples](#examples-3)
  - [Types](#types)
    - [Rule](#rule-4)
    - [Examples](#examples-4)
    - [Avoid](#avoid)
  - [Stores](#stores)
    - [Rule](#rule-5)
    - [Examples](#examples-5)
  - [Constants](#constants)
    - [Rule](#rule-6)
    - [Examples](#examples-6)
  - [Mappers / Transformers](#mappers--transformers)
    - [Rule](#rule-7)
    - [Examples](#examples-7)
  - [Utilities](#utilities)
    - [Rule](#rule-8)
    - [Examples](#examples-8)
  - [Routes](#routes)
    - [Rule](#rule-9)
    - [Examples](#examples-9)
- [Naming Inside Files](#naming-inside-files)
  - [Schemas](#schemas)
  - [Form Types](#form-types)
  - [API Request](#api-request)
  - [API Responses](#api-responses)
- [Architecture Rules](#architecture-rules)
  - [Prefer Feature-Based Structure](#prefer-feature-based-structure)
  - [Avoid Dump Files](#avoid-dump-files)

---

## General Rules

- Use `feature-based structure`
- Use `PascalCase` for Vue components
- Use `kebab-case` for all non-component files
- Prefer `feature-name.suffix.ts` naming
- File names should describe the **purpose**, not the syntax

---

# Folder Structure

```txt
features/
  group/
    api/
    components/
    composables/
    constants/
    mappers/
    schemas/
    stores/
    types/
    utils/
    views/
```

---

# Naming Conventions

## Vue Components

### Rule

- Use `PascalCase.vue`
- Component name and file name must match

### Examples

```txt
GroupCard.vue
CreateGroupModal.vue
UserProfileForm.vue
```

---

## Composables

### Rule

- Use `useXxx.ts`
- File must start with `use`

### Examples

```txt
useCreateGroup.ts
useAuth.ts
useInfiniteScroll.ts
```

---

## API Layer

### Rule

- Use `feature.api.ts`

### Examples

```txt
group.api.ts
auth.api.ts
payment.api.ts
```

---

## Validation Schemas

### Rule

- Use `feature.schema.ts` or `action-feature.schema.ts`
- One schema per file when possible

### Examples

```txt
create-group.schema.ts
login.schema.ts
user-profile.schema.ts
```

---

## Types

### Rule

- Use `feature.types.ts`
- Store only shared/domain types

### Examples

```txt
group.types.ts
auth.types.ts
api.types.ts
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

- Use `feature.store.ts`

### Examples

```txt
auth.store.ts
group.store.ts
```

---

## Constants

### Rule

- Use `feature.constants.ts`

### Examples

```txt
group.constants.ts
auth.constants.ts
```

---

## Mappers / Transformers

### Rule

- Use `feature.mapper.ts`

### Examples

```txt
group.mapper.ts
user.mapper.ts
```

---

## Utilities

### Rule

- Use `feature.util.ts` or `feature.utils.ts`

### Examples

```txt
date.util.ts
string.util.ts
group.utils.ts
```

---

## Routes

### Rule

- Use `feature.routes.ts`

### Examples

```txt
group.routes.ts
auth.routes.ts
```

---

# Naming Inside Files

## Schemas

```ts
export const createGroupSchema
```

---

## Form Types

```ts
export type CreateGroupForm
```

---

## API Request

```ts
export interface CreateGroupRequest
```

---

## API Responses

```ts
export interface GroupResponse
```

---

# Architecture Rules

## Prefer Feature-Based Structure

✅ Good

```txt
features/group/api
features/group/components
```

❌ Avoid

```txt
global/apis
global/types
global/schemas
```

---

## Avoid Dump Files

Avoid generic files such as:

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
auth.constants.ts
```

---
