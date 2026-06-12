<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

withDefaults(
  defineProps<{
    /** Show a red asterisk to mark the field as required. */
    required?: boolean
    /** Show a muted "(tuỳ chọn)" hint to mark the field as optional. */
    optional?: boolean
  }>(),
  { required: false, optional: false },
)

defineOptions({ inheritAttrs: false })
const { rootClass, attrs } = useMergedAttrs('text-xs font-semibold text-text-main')
</script>

<template>
  <label :class="rootClass" v-bind="attrs">
    <slot />
    <span v-if="required" class="label__required"> *</span>
    <span v-else-if="optional" class="label__optional"></span>
  </label>
</template>

<style scoped>
.label__required {
  color: var(--color-danger-main);
}

.label__optional {
  font-weight: 400;
  color: var(--color-text-muted);
}
</style>
