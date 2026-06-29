<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AppHeader from '@/shared/components/app/AppHeader.vue'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import ParticipantLabel from '@/modules/expense/components/ParticipantLabel.vue'
import StatusBadge from '@/modules/expense/components/StatusBadge.vue'
import { useExpenseDetail } from '@/modules/expense/composables/useExpenseDetail'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'
import Typography from '@/shared/components/ui/typography/Typography.vue'

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
            <Typography size="md" weight="bold" as="div">{{ expense.title }}</Typography>
            <Typography size="xs" color="muted"
              >Bạn đã trả · {{ formatDate(expense.paidAt, appSetting.locale) }}</Typography
            >
          </div>

          <div class="flex items-end justify-between">
            <div>
              <Typography size="xs" color="muted" as="div">Tổng đã trả</Typography>
              <Typography size="lg" weight="bold">
                {{ formatMoney(expense.totalAmount, appSetting.locale, appSetting.currency) }}
              </Typography>
            </div>
            <div class="text-right">
              <Typography size="xs" color="muted" as="div">Còn được nợ</Typography>
              <Typography size="lg" weight="bold" color="success">
                {{ formatMoney(expense.amountOwedToMe, appSetting.locale, appSetting.currency) }}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Breakdown -->
      <Card>
        <CardContent class="flex flex-col p-6">
          <Typography size="xs" weight="semibold" color="muted" class="mb-2 uppercase tracking-wide">
            Chia cho · {{ settledCount }}/{{ expense.debtors.length }} đã trả
          </Typography>
          <div
            v-for="(share, i) in expense.debtors"
            :key="share.participant.id"
            class="flex items-center justify-between gap-3 py-3"
            :class="{ 'border-t border-bg-soft': i > 0 }"
          >
            <ParticipantLabel :name="share.participant.name" :avatar-url="share.participant.avatarUrl" />
            <div class="flex shrink-0 items-center gap-3">
              <StatusBadge :status="share.status" />
              <Typography weight="semibold" as="div" color="danger">
                {{ formatMoney(share.amount, appSetting.locale, appSetting.currency) }}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>

    <Typography v-else size="sm" color="muted" align="center" class="p-lg">Không tìm thấy khoản chi.</Typography>
  </div>
</template>
