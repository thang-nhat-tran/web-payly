<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/shared/components/ui/card'
import AvatarStack from '@/shared/components/ui/AvatarStack.vue'
import type { PaidExpense } from '@/modules/expense/types/expense.type'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'
import Typography from '@/shared/components/ui/typography/Typography.vue'

const props = defineProps<{ expense: PaidExpense }>()
defineEmits<{ detail: [string] }>()

const { locale, currency } = useAppSettingStore()

const debtorAvatars = computed(() => props.expense.debtors.map((d) => d.participant.avatarUrl ?? ''))
const settledCount = computed(() => props.expense.debtors.filter((d) => d.status === 'paid').length)
const isFullySettled = computed(() => props.expense.amountOwedToMe === 0)
</script>

<template>
  <Card clickable @click="$emit('detail', expense.id)">
    <CardContent class="flex flex-col gap-4 p-6">
      <!-- Title + total I paid -->
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <Typography size="sm" weight="bold" truncate color="main" as="div">{{ expense.title }}</Typography>
          <Typography size="xs" color="muted">Bạn đã trả · {{ formatDate(expense.paidAt, locale) }}</Typography>
        </div>
        <Typography size="lg" color="success" weight="semibold" align="right" class="w-48">
          {{ formatMoney(expense.totalAmount, locale, currency) }}
        </Typography>
      </div>

      <!-- Owed back to me + debtors -->
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <Typography v-if="isFullySettled" size="sm" weight="medium" color="success">Đã thu đủ</Typography>
          <template v-else>
            <Typography size="xs" color="muted">Còn được nợ</Typography>
            <Typography size="sm" weight="semibold" class="block w-48">
              {{ formatMoney(expense.amountOwedToMe, locale, currency) }}
            </Typography>
          </template>
        </div>

        <div class="flex items-center gap-3">
          <AvatarStack :avatar-urls="debtorAvatars" size="sm" />
          <Typography size="xs" color="muted">{{ settledCount }}/{{ expense.debtors.length }} đã trả</Typography>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
