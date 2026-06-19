<script setup lang="ts">
import Label from '@/shared/components/ui/Label.vue'
import MoneyInput from '@/shared/components/ui/MoneyInput.vue'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'

const amount = defineModel<number>({
  required: true,
  default: 0,
  set(value) {
    return Math.max(0, value)
  },
})

const appSetting = useAppSettingStore()
</script>

<template>
  <Label>Tổng số tiền</Label>
  <div class="rounded-md bg-bg-surface px-5 py-2 shadow-sm">
    <MoneyInput v-model="amount" :locale="appSetting.locale" :currency="appSetting.currency" size="md" />
  </div>
</template>
