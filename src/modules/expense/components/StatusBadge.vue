<script setup lang="ts">
import { computed } from 'vue'
import type { SettlementStatus } from '@/modules/expense/types/expense.type'

const props = defineProps<{ status: SettlementStatus }>()

const STATUS: Record<SettlementStatus, { label: string; classes: string }> = {
  pending: { label: 'Chưa trả', classes: 'bg-bg-layout text-text-muted' },
  paid: { label: 'Đã trả', classes: 'bg-[#f0faf4] text-[#166534]' },
}

const meta = computed(() => STATUS[props.status])
</script>

<template>
  <span class="inline-block rounded-pill px-2 py-0.5 text-xs font-medium" :class="meta.classes">{{ meta.label }}</span>
</template>
