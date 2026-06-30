<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AppHeader from '@/shared/components/app/AppHeader.vue'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import StatusBadge from '@/modules/expense/components/StatusBadge.vue'
import { useDebtDetail } from '@/modules/expense/composables/useDebtDetail'
import type { SettlementStatus } from '@/modules/expense/types/expense.type'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'
import ParticipantLabel from '../components/ParticipantLabel.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import Skeleton from '@/shared/components/ui/Skeleton.vue'

const route = useRoute()
const router = useRouter()
const appSetting = useAppSettingStore()

const { data: debt, isPending, query: fetchDebt } = useDebtDetail(route.params.debtId as string)

// Local status so paying updates the UI on this page.
const status = ref<SettlementStatus>('pending')
watchEffect(() => {
  if (debt.value) status.value = debt.value.status
})

onMounted(() => fetchDebt())

function back() {
  router.back()
}
</script>

<template>
  <div class="min-h-svh">
    <AppHeader>
      <template #left>
        <Button variant="ghost" size="icon" aria-label="Quay lại" @click="back">
          <ArrowLeft :size="24" :strokeWidth="2" />
        </Button>
      </template>
      <template #center>
        <h3>Chi tiết khoản nợ</h3>
      </template>
    </AppHeader>

    <main v-if="isPending" class="flex flex-col gap-4 p-sm pb-3xl">
      <!-- Skeleton: amount owed -->
      <Card>
        <CardContent class="flex flex-col items-center gap-3 p-8">
          <Skeleton width="6rem" height="0.875rem" />
          <Skeleton width="10rem" height="2rem" />
          <Skeleton width="4rem" height="1.5rem" border-radius="9999px" />
        </CardContent>
      </Card>

      <!-- Skeleton: details -->
      <Card>
        <CardContent class="flex flex-col p-6">
          <div
            v-for="i in 3"
            :key="i"
            class="flex items-center justify-between gap-3 py-3"
            :class="{ 'border-t border-bg-soft': i > 1 }"
          >
            <Skeleton width="4rem" height="0.875rem" />
            <Skeleton width="8rem" height="0.875rem" />
          </div>
        </CardContent>
      </Card>
    </main>

    <main v-else-if="debt" class="flex flex-col gap-4 p-sm pb-3xl">
      <!-- Amount owed -->
      <Card>
        <CardContent class="flex flex-col items-center gap-2 p-8">
          <Typography size="xs" color="muted">Bạn nợ {{ debt.paidBy.name }}</Typography>
          <Typography size="xl" weight="bold" color="danger">
            {{ formatMoney(debt.amountIOwe, appSetting.locale, appSetting.currency) }}
          </Typography>
          <StatusBadge :status="status" />
        </CardContent>
      </Card>

      <!-- Details -->
      <Card>
        <CardContent class="flex flex-col p-6">
          <div class="flex items-center justify-between gap-3 py-3">
            <Typography size="sm" color="muted">Khoản chi</Typography>
            <Typography size="sm" weight="medium" truncate>{{ debt.title }}</Typography>
          </div>
          <div class="flex items-center justify-between gap-3 border-t border-bg-soft py-3">
            <Typography size="sm" color="muted">Người trả</Typography>
            <ParticipantLabel :name="debt.paidBy.name" :avatar-url="debt.paidBy.avatarUrl" size="sm" />
          </div>
          <div class="flex items-center justify-between gap-3 border-t border-bg-soft py-3">
            <Typography size="sm" color="muted">Ngày chi</Typography>
            <Typography size="sm">{{ formatDate(debt.paidAt, appSetting.locale) }}</Typography>
          </div>
          <div v-if="debt.dueAt" class="flex items-center justify-between gap-3 border-t border-bg-soft py-3">
            <Typography size="sm" color="muted">Hạn trả</Typography>
            <Typography size="sm">{{ formatDate(debt.dueAt, appSetting.locale) }}</Typography>
          </div>
        </CardContent>
      </Card>
    </main>

    <Typography v-else size="sm" color="muted" align="center" class="p-lg block">Không tìm thấy khoản nợ.</Typography>
  </div>
</template>
