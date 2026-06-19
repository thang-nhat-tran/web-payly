<script setup lang="ts">
import type { SplitMethod } from '@/modules/expense/types/expense.type'

const splitMethod = defineModel<SplitMethod>({ required: true, default: 'equal' })

const tabs: { value: SplitMethod; label: string }[] = [
  { value: 'equal', label: 'Chia đều' },
  { value: 'percentage', label: 'Phần trăm' },
  { value: 'custom', label: 'Tùy chỉnh' },
]
</script>

<template>
  <div class="flex gap-0.5 rounded-md bg-bg-soft text-xs font-medium border border-gray-200">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      class="flex-1 rounded-md px-3 py-1.5 transition-colors"
      :class="splitMethod === tab.value ? 'bg-bg-surface text-text-main shadow-sm' : 'text-text-muted'"
      @click="() => (splitMethod = tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
