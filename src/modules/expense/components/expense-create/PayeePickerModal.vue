<script setup lang="ts">
import ModalPicker from '@/shared/components/ui/ModalPicker.vue'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import type { ExpenseParticipant } from '@/modules/expense/types/expense.type'

defineProps<{ open: boolean; members: ExpenseParticipant[]; lockedIds?: string[] }>()
const selected = defineModel<string[]>({ required: true })
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <ModalPicker
    v-model="selected"
    multiple
    :open="open"
    title="Chia với"
    :items="members"
    :item-key="(m) => m.id"
    :locked-keys="lockedIds"
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
