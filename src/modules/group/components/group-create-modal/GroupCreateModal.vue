<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter,
} from '@/shared/components/ui/modal'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useCreateGroup } from './useCreateGroup'
import { groupCreateSchema } from './group-create.schema'
import type { Group } from '@/modules/group/types/group.types'

defineProps<{ open: boolean }>()
const emit = defineEmits<{
  close: []
  success: [Group]
}>()

const auth = useAuthStore()
const createGroup = useCreateGroup()

const { handleSubmit, resetForm } = useForm({
  validationSchema: groupCreateSchema,
})
const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: description } = useField<string>('description')

const handleSubmitForm = handleSubmit(async ({ name, description }) => {
  await createGroup.mutate({
    name,
    description: description?.trim() || null,
    createdBy: auth.user!.id,
  })
  if (createGroup.isSuccess.value) {
    resetForm()
    emit('success', createGroup.data.value!)
  }
})

function handleClose() {
  resetForm()
  emit('close')
}
</script>

<template>
  <Modal :open="open" @close="handleClose">
    <ModalHeader>
      <ModalTitle>Tạo nhóm mới</ModalTitle>
      <ModalClose />
    </ModalHeader>

    <ModalBody>
      <form class="form" @submit.prevent="handleSubmitForm">
        <div class="field">
          <label class="label" for="group-name">Tên nhóm <span class="required">*</span></label>
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
    </ModalBody>

    <ModalFooter>
      <button class="btn-secondary" type="button" @click="handleClose">Huỷ</button>
      <button class="btn-primary" :disabled="createGroup.isPending.value" @click="handleSubmitForm">
        {{ createGroup.isPending.value ? 'Đang tạo…' : 'Tạo nhóm' }}
      </button>
    </ModalFooter>
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
