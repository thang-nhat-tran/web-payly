<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/shared/utils/cn.util'

const props = withDefaults(
  defineProps<{
    /** Show a red asterisk to mark the field as required. */
    required?: boolean
    /** Show a muted "(tuỳ chọn)" hint to mark the field as optional. */
    optional?: boolean
    /** Consumer classes — tailwind-merged via cn(). */
    class?: HTMLAttributes['class']
  }>(),
  { required: false, optional: false },
)
</script>

<template>
  <label :class="cn('text-xs font-semibold text-text-main', props.class)">
    <slot />
    <span v-if="required" class="text-danger-main"> *</span>
    <span v-else-if="optional" class="font-normal text-text-muted"> (tuỳ chọn)</span>
  </label>
</template>
