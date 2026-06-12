<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from '@/shared/components/ui/modal'
import Label from '@/shared/components/ui/Label.vue'
import Input from '@/shared/components/ui/Input.vue'
import Button from '@/shared/components/ui/Button.vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useCreateGroup } from './useCreateGroup'
import { groupCreateSchema } from './group-create.schema'
import type { Group } from '@/modules/group/types/group.types'

defineProps<{ open: boolean }>()
const emit = defineEmits<{
  close: []
  success: [Group]
  error: [Error]
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
  } else if (createGroup.isError.value) {
    emit('error', createGroup.error.value!)
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
          <Label for="group-name" required>Tên nhóm</Label>
          <Input
            id="group-name"
            v-model="name"
            :error="nameError"
            type="text"
            placeholder="VD: Đi biển Đà Nẵng 2025"
            autocomplete="off"
          />
        </div>

        <div class="field">
          <Label for="group-desc" optional>Mô tả</Label>
          <Input
            id="group-desc"
            v-model="description"
            multiline
            placeholder="Ghi chú về mục đích của nhóm..."
            rows="3"
          />
        </div>
      </form>
    </ModalBody>

    <ModalFooter>
      <Button variant="secondary" @click="handleClose">Huỷ</Button>
      <Button :loading="createGroup.isPending.value" @click="handleSubmitForm">
        {{ createGroup.isPending.value ? 'Đang tạo…' : 'Tạo nhóm' }}
      </Button>
    </ModalFooter>
  </Modal>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
