# Vue 3 + Tailwind UI Component Design Guide

This guide defines how to design reusable UI components in a Vue 3 + Tailwind CSS project.

The main goal is to help humans and AI generate components that are:

- reusable
- predictable
- easy to compose
- visually consistent
- not tightly coupled to a specific page layout

---

## 1. Core Principle

A reusable component should control its own **appearance** and **internal structure**, but it should not control how it is positioned inside a page.

In short:

```txt
Component owns: internal UI
Parent owns: external layout
```

A component may use layout classes internally when those classes are required for the component to work correctly.

A component should avoid layout classes that decide how it is placed relative to other components.

---

## 2. Internal Layout vs External Layout

Do not split classes into only "Core CSS" and "Layout CSS".

That is too simple and can lead to wrong component design.

Instead, split layout into two types:

```txt
Internal layout = allowed inside the component
External layout = should be controlled by the parent
```

---

## 3. Internal Layout

Internal layout is layout required to arrange elements **inside** the component.

The component author should define internal layout.

Examples:

```txt
inline-flex
flex
grid
items-center
justify-center
gap-*
space-x-*
px-*
py-*
p-*
rounded-*
```

These are valid inside a component when they describe how the component itself is built.

Example:

```txt
A button uses inline-flex, items-center, justify-center, and gap-2
because it needs to align icon + label internally.
```

This is good:

```ts
const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2'
```

---

## 4. External Layout

External layout is layout that decides where the component lives in a page or how much space it takes in a specific context.

The parent or consumer should control external layout.

Examples:

```txt
m-*
mt-*
mb-*
ml-*
mr-*
w-full
w-*
h-*
min-h-*
max-w-*
absolute
fixed
sticky
top-*
right-*
bottom-*
left-*
flex-1
self-*
order-*
col-span-*
row-span-*
```

These classes usually should not be hard-coded inside a reusable component.

Bad:

```ts
const baseClasses = 'w-full mt-4 inline-flex items-center justify-center rounded-md px-4 py-2'
```

Good:

```vue
<MyButton class="w-full mt-4">
  Save
</MyButton>
```

---

## 5. Component Responsibility

A reusable component should usually own:

```txt
visual style
variant style
size style
internal alignment
internal spacing
border radius
border style
typography
hover state
focus state
disabled state
loading state
accessibility attributes
```

Example:

```txt
Button owns: color, radius, padding, icon alignment, loading spinner position.
Parent owns: margin, width, page position, grid/flex behavior.
```

---

## 6. Parent Responsibility

The parent should usually own:

```txt
page layout
section layout
spacing between sibling components
component width in a specific context
component height in a specific context
positioning
responsive placement
grid/flex behavior between components
```

Example:

```vue
<div class="flex flex-col gap-3">
  <MyButton>Save</MyButton>
  <MyButton variant="ghost">Cancel</MyButton>
</div>
```

The `gap-3` belongs to the parent because it describes spacing between sibling components.

---

## 7. Use Props for Semantic Variants

Use props when changing the semantic meaning or official design-system style of a component.

Good:

```vue
<MyButton variant="danger">
  Delete
</MyButton>
```

Bad:

```vue
<MyButton class="bg-red-600 text-white">
  Delete
</MyButton>
```

If a style is common and meaningful, add a variant.

Examples:

```txt
primary
secondary
danger
ghost
outline
success
warning
```

Do not rely on random class overrides for official UI states.

---

## 8. Use `class` for Context-Specific Layout

The `class` prop is allowed for context-specific layout.

Good:

```vue
<MyButton class="w-full">
  Continue
</MyButton>
```

Good:

```vue
<MyButton class="mt-4">
  Submit
</MyButton>
```

Acceptable:

```vue
<MyButton class="self-end">
  Save
</MyButton>
```

The consumer is not changing what the button means visually.  
The consumer is only placing it in a layout.

---

## 9. Class Override Rule

Consumer classes may override component classes, but this should be treated as an escape hatch.

The normal path should be:

```txt
Use props for design-system changes.
Use class for layout-context changes.
```

Recommended:

```vue
<MyButton variant="primary" size="lg" class="w-full">
  Continue
</MyButton>
```

Avoid:

```vue
<MyButton variant="primary" class="bg-purple-500 rounded-none">
  Continue
</MyButton>
```

If this override is needed often, create a new prop or variant.

---

## 10. Design Tokens

Use semantic design tokens instead of raw values.

Good:

```txt
bg-primary
bg-danger
text-foreground
text-muted-foreground
bg-surface
border-border
```

Avoid:

```txt
bg-[#cf4500]
text-[#1a1a1a]
border-[#dddddd]
```

Raw values are only acceptable for one-off experiments or temporary prototypes.

Production components should use semantic tokens.

---

## 11. Component API Design

A reusable component should expose a small and stable API.

Common props:

```ts
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'
```

Useful props depend on the component:

```txt
disabled
loading
icon
label
error
placeholder
modelValue
```

Avoid exposing too many low-level styling props.

Bad:

```ts
defineProps<{
  bgColor: string
  textColor: string
  borderColor: string
  padding: string
  marginTop: string
}>()
```

Good:

```ts
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}>()
```

---

## 12. Decision Rules for AI

When generating a reusable component, follow these rules.

### Rule 1: Ask what the component owns

Before writing classes, decide:

```txt
Is this class needed for the component's internal structure?
Or is this class only needed because of where the component is used?
```

If it is internal, put it inside the component.

If it is contextual, put it in the parent or allow it through `class`.

---

### Rule 2: Do not ban all layout classes inside components

This is wrong:

```txt
Reusable components must not use flex, grid, gap, or padding.
```

Correct:

```txt
Reusable components may use layout classes for internal layout.
Reusable components should avoid layout classes for external layout.
```

---

### Rule 3: Avoid margins inside reusable components

Margin almost always describes the relationship between this component and another component.

Therefore, margin should usually be owned by the parent.

Avoid inside component source:

```txt
mt-*
mb-*
ml-*
mr-*
mx-*
my-*
m-*
```

Use parent spacing instead:

```vue
<div class="flex flex-col gap-4">
  <FormInput />
  <FormInput />
  <MyButton />
</div>
```

---

### Rule 4: Be careful with width and height

Width and height are often context-specific.

Avoid hard-coding these inside reusable components:

```txt
w-full
w-64
h-12
max-w-md
min-h-screen
```

But fixed size may be valid for small atomic components when size is part of the component identity.

Valid examples:

```txt
Avatar size
Icon size
Spinner size
Checkbox size
Switch size
```

Example:

```ts
const avatarSizeClasses = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
}
```

For a button, prefer padding-based sizing instead of fixed height.

---

### Rule 5: Do not put page-level positioning in reusable components

Avoid inside reusable components:

```txt
absolute
fixed
sticky
top-0
right-0
z-50
```

These are usually layout-context decisions.

Exception: components whose core behavior requires positioning, such as:

```txt
Modal
Popover
Tooltip
Dropdown
Toast
CommandMenu
```

For these components, positioning is part of the component behavior.

---

## 13. Example: Good Button Component

This button is reusable because:

- it owns internal alignment
- it owns visual variants
- it owns size variants
- it supports loading state
- it does not hard-code margin or page width
- it accepts consumer classes for layout context

**File:** `src/shared/components/ui/AppButton.vue`

```vue
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { cn } from '@/shared/utils/cn.util'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
  },
)

const attrs = useAttrs()

const baseClasses = [
  // Internal layout
  'inline-flex items-center justify-center gap-2',

  // Internal appearance
  'rounded-md font-medium transition-colors',

  // Accessibility states
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
].join(' ')

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  danger: 'bg-danger text-danger-foreground hover:bg-danger/90',
  ghost: 'bg-transparent text-foreground hover:bg-muted',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

const buttonClass = computed(() => {
  return cn(baseClasses, variantClasses[props.variant], sizeClasses[props.size], attrs.class)
})

const isDisabled = computed(() => {
  return props.disabled || props.loading
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <button :type="type" :disabled="isDisabled" :aria-busy="loading" :class="buttonClass" v-bind="attrs">
    <Loader2 v-if="loading" class="size-4 animate-spin" aria-hidden="true" />

    <slot />
  </button>
</template>
```

---

## 14. Example Usage

```vue
<script setup lang="ts">
import AppButton from '@/shared/components/ui/AppButton.vue'
</script>

<template>
  <section class="mx-auto max-w-md p-6">
    <div class="rounded-xl border bg-surface p-6">
      <h1 class="text-xl font-semibold">Create account</h1>

      <p class="mt-2 text-sm text-muted-foreground">Fill in your information to continue.</p>

      <form class="mt-6 flex flex-col gap-4">
        <!-- inputs here -->

        <div class="flex flex-col gap-3">
          <AppButton type="submit" variant="primary" size="lg" class="w-full"> Continue </AppButton>

          <AppButton type="button" variant="ghost" size="lg" class="w-full"> Cancel </AppButton>
        </div>
      </form>
    </div>
  </section>
</template>
```

In this usage:

```txt
AppButton owns:
- color
- typography
- padding
- border radius
- hover state
- loading icon alignment

Parent owns:
- max width
- card padding
- form spacing
- button width
```

---

## 15. Bad vs Good Examples

### Bad: Component owns external layout

```vue
<script setup lang="ts">
const classes =
  'mt-4 w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground'
</script>

<template>
  <button :class="classes">
    <slot />
  </button>
</template>
```

Problem:

```txt
mt-4 and w-full force this button to fit one specific layout.
The button becomes less reusable.
```

---

### Good: Parent owns external layout

```vue
<MyButton class="mt-4 w-full">
  Save
</MyButton>
```

The component remains reusable.  
The parent decides how this specific instance should be placed.

---

## 16. Practical Checklist

Before finalizing a component, check:

```txt
Does this component contain margin?
If yes, move it to the parent unless there is a strong reason.

Does this component contain page width?
If yes, move it to the parent.

Does this component use flex/grid internally?
That is okay if it arranges internal elements.

Does this component expose semantic variants?
Prefer variant props over visual class overrides.

Does this component use design tokens?
Prefer semantic tokens over raw hex values.

Can this component be used in a header, modal, form, and sidebar?
If not, identify which external layout decision is hard-coded.
```

---

## 17. Final Rule

A reusable component should be strict about its design-system meaning, but flexible about where it is used.

```txt
Strict visual semantics.
Flexible layout composition.
```

Use props to control official UI variants.  
Use parent layout to control placement.  
Use `class` as a controlled escape hatch for context-specific layout.
