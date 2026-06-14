<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'
import Spinner from '../Spinner.vue'
import { buttonVariants, type ButtonVariant, type ButtonSize } from '.'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    class?: HTMLAttributes['class']
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    as?: string | object
  }>(),
  {
    variant: 'default',
    size: 'default',
    type: 'button',
    disabled: false,
    loading: false,
    as: 'button',
  },
)

const isNativeButton = computed(() => props.as === 'button')
const isDisabled = computed(() => props.disabled || props.loading)
const spinnerSize = computed(() => (props.size === 'sm' ? '1.6rem' : '2rem'))
</script>

<template>
  <component
    :is="as"
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :type="isNativeButton ? type : undefined"
    :disabled="isNativeButton ? isDisabled : undefined"
    :aria-disabled="!isNativeButton && isDisabled ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <Spinner v-if="loading" :size="spinnerSize" />
    <slot />
  </component>
</template>
