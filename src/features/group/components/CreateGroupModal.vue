<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import Modal from '@/shared/components/ui/Modal.vue'
import { createGroupSchema } from '@/features/group/schemas/create-group.schema'
import type { CreateGroupForm } from '@/features/group/schemas/create-group.schema'

defineProps<{ open: boolean; loading: boolean }>()
const emit = defineEmits<{
  close: []
  submit: [CreateGroupForm]
}>()

const { handleSubmit, resetForm } = useForm({
  validationSchema: createGroupSchema,
})
const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: description } = useField<string>('description')

const onSubmit = handleSubmit((values) => {
  emit('submit', {
    name: values.name,
    description: values.description?.trim() || null,
  })
})

function handleClose() {
  resetForm()
  emit('close')
}

defineExpose({ resetForm })
</script>

<template>
  <Modal :open="open" title="Tạo nhóm mới" @close="handleClose">
    <form class="form" @submit.prevent="onSubmit">
      <div class="field">
        <label class="label" for="group-name"
          >Tên nhóm <span class="required">*</span></label
        >
        <input
          id="group-name"
          v-model="name"
          class="input"
          :class="{ 'input--error': nameError }"
          type="text"
          placeholder="VD: Đi biển Đà Nẵng 2025"
          autocomplete="off"
        />
        <span v-if="nameError" class="error-msg">{{ nameError }}</span>
      </div>

      <div class="field">
        <label class="label" for="group-desc">
          Mô tả <span class="optional">(tuỳ chọn)</span>
        </label>
        <textarea
          id="group-desc"
          v-model="description"
          class="input textarea"
          placeholder="Ghi chú về mục đích của nhóm..."
          rows="3"
        />
      </div>
    </form>

    <template #footer>
      <button class="btn-secondary" type="button" @click="handleClose">
        Huỷ
      </button>
      <button class="btn-primary" :disabled="loading" @click="onSubmit">
        {{ loading ? 'Đang tạo…' : 'Tạo nhóm' }}
      </button>
    </template>
  </Modal>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-ink);
}

.required {
  color: var(--color-signal);
}
.optional {
  font-weight: 400;
  color: var(--color-slate);
}

.input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--color-dust);
  border-radius: var(--radius-cta);
  background-color: var(--color-canvas);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  outline: none;
  transition: border-color 0.15s var(--ease-standard);
  box-sizing: border-box;
}
.input:focus {
  border-color: var(--color-ink);
}
.input--error {
  border-color: var(--color-signal);
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.error-msg {
  font-size: var(--text-sm);
  color: var(--color-signal);
}
</style>
