<script setup lang="ts">
import { computed } from 'vue'
import { Equal, Percent, SlidersHorizontal, type LucideIcon } from 'lucide-vue-next'
import type { SplitMethod } from '@/modules/expense/types/expense-split.type'

const splitMethod = defineModel<SplitMethod>({ required: true, default: 'equal' })

const tabs: { value: SplitMethod; icon: LucideIcon }[] = [
  { value: 'equal', icon: Equal },
  { value: 'percentage', icon: Percent },
  { value: 'custom', icon: SlidersHorizontal },
]

const activeIndex = computed(() => tabs.findIndex((t) => t.value === splitMethod.value))
</script>

<template>
  <div class="relative flex rounded-xl bg-bg-surface font-medium">
    <!-- Sliding pill — translates to the active tab position -->
    <div
      class="absolute inset-y-0 w-1/3 rounded-lg bg-text-main shadow-sm transition-transform duration-200 ease-standard"
      :style="{ transform: `translateX(${activeIndex * 100}%)` }"
    />

    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      class="relative z-10 flex flex-1 items-center justify-center p-4 transition-colors duration-200 ease-standard"
      :class="splitMethod === tab.value ? 'text-bg-surface' : 'text-text-muted'"
      @click="() => (splitMethod = tab.value)"
    >
      <component :is="tab.icon" :size="20" />
    </button>
  </div>
</template>
