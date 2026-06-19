<script setup lang="ts">
import { computed } from 'vue'
import ActionRow from '@/shared/components/ui/ActionRow.vue'
import Label from '@/shared/components/ui/Label.vue'
import AvatarStack from '@/shared/components/ui/AvatarStack.vue'
import type { ExpenseParticipant } from '@/modules/expense/types/expense.type'

const props = defineProps<{ members: ExpenseParticipant[] }>()
defineEmits<{ click: [] }>()

const avatars = computed(() => props.members.map((m) => m.avatarUrl ?? ''))
const summary = computed(() => {
  const names = props.members.map((m) => m.name)
  if (names.length === 0) return 'Chọn thành viên'
  if (names.length <= 2) return names.join(', ')
  return `${names.slice(0, 2).join(', ')} & ${names.length - 2} người khác`
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <Label>Chia với</Label>
    <ActionRow @click="$emit('click')">
      <AvatarStack :avatar-urls="avatars" size="sm" />
      <span class="min-w-0 flex-1 truncate text-sm text-text-muted">{{ summary }}</span>
    </ActionRow>
  </div>
</template>
