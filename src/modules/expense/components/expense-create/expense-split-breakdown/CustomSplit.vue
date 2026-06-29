<script setup lang="ts">
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import MoneyInput from '@/shared/components/ui/MoneyInput.vue'
import type { ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'

const { locale, currency } = useAppSettingStore()

defineProps<{ split: ExpenseSplit; amount: number }>()
const emit = defineEmits<{ 'update:amount': [value: number] }>()
</script>

<template>
  <div class="flex items-center justify-end">
    <MoneyInput
      :model-value="amount"
      :locale="locale"
      :currency="currency"
      variant="outlined"
      size="sm"
      align="right"
      class="w-48"
      @update:model-value="(v) => emit('update:amount', v)"
    />
  </div>
</template>
