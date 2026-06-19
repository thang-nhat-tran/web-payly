<script setup lang="ts">
import { computed } from 'vue'
import { formatMoney } from '@/shared/utils/money.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'

const appSetting = useAppSettingStore()

const props = defineProps<{
  allocated: number
  total: number
}>()

const remaining = computed(() => props.total - props.allocated)
const isBalanced = computed(() => remaining.value === 0)
</script>

<template>
  <div class="flex items-center justify-between border-t border-bg-soft pt-2 text-xs">
    <span class="text-text-muted">Tổng đã chia</span>
    <span :class="isBalanced ? 'font-medium text-success' : 'font-medium text-danger-main'">
      {{ formatMoney(allocated, appSetting.locale, appSetting.currency) }}
      <template v-if="!isBalanced">
        · còn lại {{ formatMoney(remaining, appSetting.locale, appSetting.currency) }}
      </template>
    </span>
  </div>
</template>
