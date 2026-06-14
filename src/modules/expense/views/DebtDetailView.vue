<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { Card, CardContent } from '@/shared/components/ui/card'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import { Button } from '@/shared/components/ui/button'
import StatusBadge from '@/modules/expense/components/StatusBadge.vue'
import { findOwedDebt } from '@/modules/expense/mocks/expense.mock'
import type { SettlementStatus } from '@/modules/expense/types/expense.types'
import { formatMoney } from '@/shared/utils/money.util'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'

const route = useRoute()
const router = useRouter()
const appSetting = useAppSettingStore()

const debt = ref(findOwedDebt(route.params.debtId as string) ?? null)

// Local mock status so paying updates the UI on this page.
const status = ref<SettlementStatus>('pending')
watchEffect(() => {
  if (debt.value) status.value = debt.value.status
})

function back() {
  router.back()
}

function pay() {
  status.value = 'paid'
}
</script>

<template>
  <div class="min-h-svh bg-bg-base">
    <header class="sticky top-0 z-10 flex items-center gap-3 bg-bg-surface px-sm py-md shadow-sm">
      <button
        type="button"
        aria-label="Quay lại"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-round text-text-main transition-opacity hover:opacity-70"
        @click="back"
      >
        <ArrowLeft :size="22" />
      </button>
      <h1 class="text-md font-bold text-text-main">Chi tiết khoản nợ</h1>
    </header>

    <main v-if="debt" class="flex flex-col gap-4 p-sm pb-3xl">
      <!-- Amount owed -->
      <Card>
        <CardContent class="flex flex-col items-center gap-2 p-8">
          <p class="text-xs text-text-muted">Bạn nợ {{ debt.paidBy.name }}</p>
          <p class="text-xl font-bold text-danger-main">
            {{ formatMoney(debt.amountIOwe, appSetting.locale, appSetting.currency) }}
          </p>
          <StatusBadge :status="status" />
        </CardContent>
      </Card>

      <!-- Details -->
      <Card>
        <CardContent class="flex flex-col p-6">
          <div class="flex items-center justify-between gap-3 py-3">
            <span class="text-sm text-text-muted">Khoản chi</span>
            <span class="truncate text-sm font-medium text-text-main">{{ debt.title }}</span>
          </div>
          <div class="flex items-center justify-between gap-3 border-t border-bg-soft py-3">
            <span class="text-sm text-text-muted">Người trả</span>
            <span class="flex items-center gap-2">
              <UserAvatar :name="debt.paidBy.name" :src="debt.paidBy.avatarUrl" size="sm" />
              <span class="text-sm font-medium text-text-main">{{ debt.paidBy.name }}</span>
            </span>
          </div>
          <div class="flex items-center justify-between gap-3 border-t border-bg-soft py-3">
            <span class="text-sm text-text-muted">Ngày chi</span>
            <span class="text-sm text-text-main">{{ formatDate(debt.paidAt, appSetting.locale) }}</span>
          </div>
          <div v-if="debt.dueAt" class="flex items-center justify-between gap-3 border-t border-bg-soft py-3">
            <span class="text-sm text-text-muted">Hạn trả</span>
            <span class="text-sm text-text-main">{{ formatDate(debt.dueAt, appSetting.locale) }}</span>
          </div>
        </CardContent>
      </Card>

      <Button v-if="status !== 'paid'" class="mt-2 w-full" @click="pay">
        Thanh toán {{ formatMoney(debt.amountIOwe, appSetting.locale, appSetting.currency) }}
      </Button>
    </main>

    <p v-else class="p-lg text-center text-sm text-text-muted">Không tìm thấy khoản nợ.</p>
  </div>
</template>
