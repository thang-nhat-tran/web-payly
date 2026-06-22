<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AppHeader from '@/shared/components/app/AppHeader.vue'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import StatusBadge from '@/modules/expense/components/StatusBadge.vue'
import MoneyText from '@/shared/components/ui/MoneyText.vue'
import { useDebtDetail } from '@/modules/expense/composables/useDebtDetail'
import type { SettlementStatus } from '@/modules/expense/types/expense.type'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import ParticipantLabel from '../components/ParticipantLabel.vue'

const route = useRoute()
const router = useRouter()
const appSetting = useAppSettingStore()

const { data: debt, query: fetchDebt } = useDebtDetail(route.params.debtId as string)

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

    <main v-if="debt" class="flex flex-col gap-4 p-sm pb-3xl">
      <!-- Amount owed -->
      <Card>
        <CardContent class="flex flex-col items-center gap-2 p-8">
          <p class="text-xs text-text-muted">Bạn nợ {{ debt.paidBy.name }}</p>
          <MoneyText
            :amount="debt.amountIOwe"
            :locale="appSetting.locale"
            :currency="appSetting.currency"
            variant="danger"
            weight="bold"
            size="xl"
          />
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
            <ParticipantLabel :name="debt.paidBy.name" :avatar-url="debt.paidBy.avatarUrl" size="sm" />
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
    </main>

    <p v-else class="p-lg text-center text-sm text-text-muted">Không tìm thấy khoản nợ.</p>
  </div>
</template>
