<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useMergedAttrs } from '@/shared/composables/useMergedAttrs'

const props = defineProps<{
  modelValue?: string
  /** Error message — when set, shows the error state and renders the text below. */
  error?: string
  /** Render a <textarea> instead of an <input>. */
  multiline?: boolean
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

defineOptions({ inheritAttrs: false })

// Consumer-passed classes merge onto the control; `attrs` is shared (class-stripped).
const { rootClass: inputClass, attrs } = useMergedAttrs(() => ['input', { 'input--error': props.error }])
const { rootClass: textareaClass } = useMergedAttrs(() => ['input textarea', { 'input--error': props.error }])
</script>

<template>
  <div class="field">
    <textarea
      v-if="multiline"
      :class="textareaClass"
      :value="modelValue"
      v-bind="attrs"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <input
      v-else
      :class="inputClass"
      :value="modelValue"
      v-bind="attrs"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="error-msg">{{ error }}</span>
  </div>
</template>

<style scoped>
/* Defaults live in the `components` layer so consumer utility classes
   (emitted in Tailwind's later `utilities` layer) always win. */
@layer components {
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
}
</style>
