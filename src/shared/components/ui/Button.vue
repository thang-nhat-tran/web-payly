<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue'
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'
import Spinner from './Spinner.vue'

type Variant = 'primary' | 'secondary' | 'consent' | 'icon'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** Visual treatment, mapped to the design tokens in global.css. */
    variant?: Variant
    /** Padding/typography scale. Ignored by the icon variant (always circular). */
    size?: Size
    /** Native button type. Only applies when rendering a <button>. */
    type?: 'button' | 'submit' | 'reset'
    /** Disables interaction and dims the control. */
    disabled?: boolean
    /** Shows a spinner and blocks interaction without collapsing layout. */
    loading?: boolean
    /** Stretches the button to fill its container. */
    block?: boolean
    /** Polymorphic root: a tag name ('a') or a component (RouterLink). */
    as?: string | object
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    block: false,
    as: 'button',
  },
)

defineOptions({ inheritAttrs: false })

const isNativeButton = computed(() => props.as === 'button')
const isDisabled = computed(() => props.disabled || props.loading)

const { rootClass, attrs } = useMergedAttrs(() => [
  'btn',
  `btn--${props.variant}`,
  props.variant !== 'icon' && `btn--${props.size}`,
  { 'btn--block': props.block, 'btn--loading': props.loading },
])

// Spinner inherits the button's text color, so it reads on every variant.
const spinnerSize = computed(() => (props.size === 'sm' ? '1.6rem' : '2rem'))
</script>

<template>
  <component
    :is="as"
    :class="rootClass"
    :type="isNativeButton ? type : undefined"
    :disabled="isNativeButton ? isDisabled : undefined"
    :aria-disabled="!isNativeButton && isDisabled ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    v-bind="attrs"
  >
    <Spinner v-if="loading" class="btn__spinner" :size="spinnerSize" />
    <slot />
  </component>
</template>

<style scoped>
/* Defaults live in the `components` layer so consumer utility classes
   (which Tailwind emits in the later `utilities` layer) always win —
   e.g. <Button class="rounded-pill bg-bg-soft"> overrides the variant. */
@layer components {
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-tight);
    cursor: pointer;
    transition:
      opacity 0.15s var(--ease-standard),
      transform 0.15s var(--ease-standard);
    border: 1.5px solid transparent;
    text-decoration: none;
    white-space: nowrap;
  }

  .btn:active {
    transform: scale(0.97);
  }

  .btn:disabled,
  .btn[aria-disabled='true'] {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ── Sizes ─────────────────────────────────────────────────── */
  .btn--sm {
    padding: 4px 16px;
    font-size: var(--text-xs);
  }
  .btn--md {
    padding: 6px 24px;
  }
  .btn--lg {
    padding: 10px 32px;
    border-radius: var(--radius-lg);
  }

  /* ── Primary ───────────────────────────────────────────────── */
  .btn--primary {
    background-color: var(--color-text-main);
    color: var(--color-bg-base);
    border-color: var(--color-text-main);
    font-weight: 500;
  }
  .btn--primary:hover {
    opacity: 0.88;
  }

  /* ── Secondary ─────────────────────────────────────────────── */
  .btn--secondary {
    background-color: var(--color-bg-surface);
    color: var(--color-text-main);
    border-color: var(--color-text-main);
    font-weight: 450;
  }
  .btn--secondary:hover {
    opacity: 0.8;
  }

  /* ── Consent ───────────────────────────────────────────────── */
  .btn--consent {
    background-color: var(--color-danger-main);
    color: var(--color-bg-surface);
    border-radius: var(--radius-lg);
    font-size: 1.3rem;
    font-weight: 400;
    letter-spacing: 0.013em;
  }
  .btn--consent:hover {
    opacity: 0.88;
  }

  /* ── Icon-only (circular) ──────────────────────────────────── */
  .btn--icon {
    width: var(--spacing-xl); /* 48px */
    height: var(--spacing-xl);
    padding: 0;
    flex-shrink: 0;
    border-radius: var(--radius-round);
    border: 1px solid var(--color-text-disabled);
    background-color: var(--color-bg-surface);
    color: var(--color-text-main);
  }
  .btn--icon:hover {
    opacity: 0.72;
  }
  .btn--icon:active {
    transform: scale(0.92);
  }

  /* ── Modifiers ─────────────────────────────────────────────── */
  .btn--block {
    width: 100%;
  }

  /* Keep the spinner from inheriting any italic/transform from the label. */
  .btn__spinner {
    font-style: normal;
  }
}
</style>
