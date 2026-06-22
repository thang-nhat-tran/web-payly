<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AppHeader from '@/shared/components/app/AppHeader.vue'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import ParticipantLabel from '@/modules/expense/components/ParticipantLabel.vue'
import StatusBadge from '@/modules/expense/components/StatusBadge.vue'
import MoneyText from '@/shared/components/ui/MoneyText.vue'
import { useExpenseDetail } from '@/modules/expense/composables/useExpenseDetail'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'

const route = useRoute()
const router = useRouter()
const appSetting = useAppSettingStore()

const { data: expense, query: fetchExpense } = useExpenseDetail(route.params.expenseId as string)
const settledCount = computed(() => expense.value?.debtors.filter((d) => d.status === 'paid').length ?? 0)

onMounted(() => fetchExpense())

function back() {
  router.back()
}
</script>

<template>
  <div class="min-h-svh bg-bg-base">
    <AppHeader>
      <template #left>
        <Button variant="ghost" size="icon" aria-label="Quay lại" @click="back">
          <ArrowLeft :size="24" :strokeWidth="2" />
        </Button>
      </template>
      <template #center>
        <h3>Chi tiết khoản chi</h3>
      </template>
    </AppHeader>

    <main v-if="expense" class="flex flex-col gap-4 p-sm pb-3xl">
      <!-- Summary -->
      <Card>
        <CardContent class="flex flex-col gap-4 p-6">
          <div>
            <p class="text-md font-bold text-text-main">{{ expense.title }}</p>
            <p class="text-xs text-text-muted">Bạn đã trả · {{ formatDate(expense.paidAt, appSetting.locale) }}</p>
          </div>

          <div class="flex items-end justify-between">
            <div>
              <p class="text-xs text-text-muted">Tổng đã trả</p>
              <MoneyText
                :amount="expense.totalAmount"
                :locale="appSetting.locale"
                :currency="appSetting.currency"
                weight="bold"
                size="lg"
              />
            </div>
            <div class="text-right">
              <p class="text-xs text-text-muted">Còn được nợ</p>
              <MoneyText
                :amount="expense.amountOwedToMe"
                :locale="appSetting.locale"
                :currency="appSetting.currency"
                variant="success"
                size="lg"
                weight="bold"
              />
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
            <ParticipantLabel :name="share.participant.name" :avatar-url="share.participant.avatarUrl" />
            <div class="flex shrink-0 items-center gap-3">
              <StatusBadge :status="share.status" />
              <MoneyText
                :amount="share.amount"
                :locale="appSetting.locale"
                :currency="appSetting.currency"
                weight="medium"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>

    <p v-else class="p-lg text-center text-sm text-text-muted">Không tìm thấy khoản chi.</p>
  </div>
</template>
