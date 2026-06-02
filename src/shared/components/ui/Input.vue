<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  modelValue?: string
  /** Error message — when set, shows the error state and renders the text below. */
  error?: string
  /** Render a <textarea> instead of an <input>. */
  multiline?: boolean
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="field">
    <textarea
      v-if="multiline"
      class="input textarea"
      :class="{ 'input--error': error }"
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <input
      v-else
      class="input"
      :class="{ 'input--error': error }"
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="error-msg">{{ error }}</span>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--color-text-disabled);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-base);
  color: var(--color-text-main);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  outline: none;
  transition: border-color 0.15s var(--ease-standard);
  box-sizing: border-box;
}
.input:focus {
  border-color: var(--color-text-main);
}
.input--error,
.input--error:focus {
  border-color: var(--color-danger-main);
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.error-msg {
  font-size: var(--text-xs);
  color: var(--color-danger-main);
}
</style>
