<script setup lang="ts">
import type { GroupDetailTab } from '@/features/group/types/group.types'

defineProps<{ active: GroupDetailTab }>()
defineEmits<{ select: [GroupDetailTab] }>()

const tabs: {
  value: GroupDetailTab
  label: string
}[] = [
  { value: 'expenses', label: 'Khoản chi' },
  { value: 'settlement', label: 'Thanh toán' },
]
</script>

<template>
  <div class="tab-list">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="tab"
      :class="{ 'tab--active': active === tab.value }"
      @click="$emit('select', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.tab-list {
  display: flex;
  border-bottom: 1px solid var(--color-dust);
  padding: 0 var(--spacing-1);
}

.tab {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 var(--spacing-2);
  height: 48px;
  font-size: var(--text-base);
  font-weight: 450;
  color: var(--color-slate);
  background: none;
  border: none;
  cursor: pointer;
  box-shadow: inset 0 -2px 0 0 transparent;
  transition:
    color 0.15s var(--ease-standard),
    box-shadow 0.15s var(--ease-standard);
}

.tab--active {
  color: var(--color-ink);
  font-weight: 600;
  box-shadow: inset 0 -2px 0 0 var(--color-ink);
}
</style>
