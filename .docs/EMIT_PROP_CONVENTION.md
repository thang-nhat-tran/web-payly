# Vue Emit & Prop Convention

## Table of Contents

- [Core Principle](#core-principle)
- [Emit Convention](#emit-convention)
  - [When to use emit](#when-to-use-emit)
  - [Naming](#naming)
  - [Best Practices](#best-practices)
- [Prop Convention](#prop-convention)
  - [When to use props](#when-to-use-props)
  - [Naming](#naming-1)
- [Callback Prop Convention](#callback-prop-convention)
  - [When to use callback props](#when-to-use-callback-props)
  - [Naming](#naming-2)
- [Emit vs Callback Prop](#emit-vs-callback-prop)
- [Recommended Pattern](#recommended-pattern)
- [Avoid](#avoid)

---

## Core Principle

### Use `emit` for notifications

Child tells parent:

> "Something happened"

### Use callback props for delegated behavior

Parent tells child:

> "Use this logic"

---

## Emit Convention

### When to use emit

- UI interactions
- State updates
- Component communication
- Form / modal actions

---

### Naming

Use:

```txt
verb
verb-object
update:modelValue
```

**Good**

```ts
emit('submit')
emit('close')
emit('select-item')
emit('update:modelValue', value)
```

**Avoid**

```ts
emit('onSubmit')
emit('handleClose')
emit('doSomething')
```

---

### Best Practices

**Emit intent, not implementation**

```ts
// ✅
emit('submit')

// ❌
emit('call-api')
emit('save-to-db')
```

**Prefer domain-specific events**

```ts
// ✅
emit('user-selected')
emit('group-created')

// ❌
emit('change')
emit('done')
```

---

## Prop Convention

### When to use props

- Data
- Configuration
- UI state

---

### Naming

Use nouns, adjectives, or state words:

```txt
noun
adjective
state
value
```

**Good**

```ts
title
items
loading
disabled
modelValue
```

**Avoid**

```ts
handleSubmit
doClose
```

---

## Callback Prop Convention

### When to use callback props

- Navigation
- Async business logic
- Dependency injection
- App-specific integrations

---

### Naming

Always prefix with `on`:

```txt
onXxx
```

**Good**

```ts
onClose
onSubmit
onGoToModel
onUpload
```

---

## Emit vs Callback Prop

| Emit                | Callback Prop          |
| ------------------- | ---------------------- |
| Notification        | Delegated behavior     |
| Child-owned         | Parent-owned           |
| Loose coupling      | Tighter coupling       |
| Default choice      | Special use case       |

---

## Recommended Pattern

```ts
const emit = defineEmits<{
  submit: []
  close: []
}>()

const props = defineProps<{
  onGoToModel?: (id: string) => void
}>()
```

```ts
// notify parent
emit('submit')

// delegate to parent logic
props.onGoToModel?.(id)
```

---

## Avoid

**Turning every event into a callback prop**

```ts
// ❌ — unnecessary coupling, React-style prop drilling
defineProps<{
  onClose: () => void
  onSubmit: () => void
  onSelect: (id: string) => void
}>()
```

Prefer `emit` by default. Use callback props only when the child genuinely needs parent-specific executable logic.
