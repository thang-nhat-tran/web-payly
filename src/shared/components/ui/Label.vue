<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Show a red asterisk to mark the field as required. */
    required?: boolean
    /** Show a muted "(tuỳ chọn)" hint to mark the field as optional. */
    optional?: boolean
  }>(),
  { required: false, optional: false },
)
</script>

<template>
  <label class="label">
    <slot />
    <span v-if="required" class="label__required"> *</span>
    <span v-else-if="optional" class="label__optional"></span>
  </label>
</template>

<style scoped>
.label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-main);
}

.label__required {
  color: var(--color-danger-main);
}

.label__optional {
  font-weight: 400;
  color: var(--color-text-muted);
}
</style>
