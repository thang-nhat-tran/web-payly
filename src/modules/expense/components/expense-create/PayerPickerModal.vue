<script setup lang="ts">
import { computed } from 'vue'
import ModalPicker from '@/shared/components/ui/ModalPicker.vue'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import type { ExpenseParticipant } from '@/modules/expense/types/expense-participant.type'

defineProps<{ open: boolean; members: ExpenseParticipant[] }>()
const payerId = defineModel<string>({ required: true })
const emit = defineEmits<{ close: [] }>()

// ModalPicker works in arrays; adapt the single payer id to/from a 1-item array.
const selected = computed<string[]>({
  get: () => [payerId.value],
  set: (keys) => {
    if (keys[0]) payerId.value = keys[0]
  },
})
</script>

<template>
  <ModalPicker
    v-model="selected"
    :open="open"
    title="Chọn người trả"
    :items="members"
    :item-key="(m) => m.id"
    @close="emit('close')"
  >
    <template #item="{ item }">
      <span class="flex min-w-0 items-center gap-2">
        <UserAvatar :name="item.name" :src="item.avatarUrl" size="sm" />
        <span class="truncate text-sm">{{ item.name }}</span>
      </span>
    </template>
  </ModalPicker>
</template>
