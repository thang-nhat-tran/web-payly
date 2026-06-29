<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'

const props = withDefaults(
  defineProps<{
    /** Show a red asterisk to mark the field as required. */
    required?: boolean
    /** Show a muted "(tuỳ chọn)" hint to mark the field as optional. */
    optional?: boolean
    /** Consumer classes — forwarded to Typography via cn(). */
    class?: HTMLAttributes['class']
  }>(),
  { required: false, optional: false },
)
</script>

<template>
  <Typography as="label" size="sm" weight="semibold" :class="props.class">
    <slot />
    <span v-if="required" class="text-danger-main"> *</span>
    <span v-else-if="optional" class="font-normal text-text-muted"> (tuỳ chọn)</span>
  </Typography>
</template>
