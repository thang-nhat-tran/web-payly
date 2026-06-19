<script setup lang="ts">
import ActionRow from '@/shared/components/ui/ActionRow.vue'
import Label from '@/shared/components/ui/Label.vue'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import type { ExpenseParticipant } from '@/modules/expense/types/expense.type'

defineProps<{ payer: ExpenseParticipant | undefined }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <Label>Người trả</Label>
    <ActionRow @click="$emit('click')">
      <template v-if="payer">
        <UserAvatar :name="payer.name" :src="payer.avatarUrl" size="sm" />
        <span class="truncate text-sm font-medium">{{ payer.name }}</span>
      </template>
      <span v-else class="text-sm text-text-muted">Chọn người trả</span>
    </ActionRow>
  </div>
</template>
