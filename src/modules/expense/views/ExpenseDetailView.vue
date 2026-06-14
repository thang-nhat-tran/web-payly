<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { Card, CardContent } from '@/shared/components/ui/card'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import StatusBadge from '@/modules/expense/components/StatusBadge.vue'
import { findPaidExpense } from '@/modules/expense/mocks/expense.mock'
import { formatMoney } from '@/shared/utils/money.util'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'

const route = useRoute()
const router = useRouter()
const appSetting = useAppSettingStore()

const expense = computed(() => findPaidExpense(route.params.expenseId as string) ?? null)
const settledCount = computed(() => expense.value?.debtors.filter((d) => d.status === 'paid').length ?? 0)

function back() {
  router.back()
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
      <h1 class="text-md font-bold text-text-main">Chi tiết khoản chi</h1>
    </header>

    <main v-if="expense" class="flex flex-col gap-4 p-sm pb-3xl">
      <!-- Summary -->
      <Card>
        <CardContent class="flex flex-col gap-4 p-6">
          <div>
            <p class="text-lg font-bold text-text-main">{{ expense.title }}</p>
            <p class="text-xs text-text-muted">Bạn đã trả · {{ formatDate(expense.paidAt, appSetting.locale) }}</p>
          </div>

          <div class="flex items-end justify-between">
            <div>
              <p class="text-xs text-text-muted">Tổng đã trả</p>
              <p class="text-xl font-bold text-text-main">
                {{ formatMoney(expense.totalAmount, appSetting.locale, appSetting.currency) }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-text-muted">Còn được nợ</p>
              <p class="text-md font-bold text-[#166534]">
                {{ formatMoney(expense.amountOwedToMe, appSetting.locale, appSetting.currency) }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Breakdown -->
      <Card>
        <CardContent class="flex flex-col p-6">
          <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Chia cho · {{ settledCount }}/{{ expense.debtors.length }} đã trả
          </p>
          <div
            v-for="(share, i) in expense.debtors"
            :key="share.participant.id"
            class="flex items-center justify-between gap-3 py-3"
            :class="{ 'border-t border-bg-soft': i > 0 }"
          >
            <div class="flex min-w-0 items-center gap-2">
              <UserAvatar :name="share.participant.name" :src="share.participant.avatarUrl" size="sm" />
              <p class="truncate text-sm">{{ share.participant.name }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-3">
              <StatusBadge :status="share.status" />
              <span class="text-sm font-medium text-text-main">
                {{ formatMoney(share.amount, appSetting.locale, appSetting.currency) }}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>

    <p v-else class="p-lg text-center text-sm text-text-muted">Không tìm thấy khoản chi.</p>
  </div>
</template>
