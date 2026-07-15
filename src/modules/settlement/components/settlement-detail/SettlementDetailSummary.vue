<script setup lang="ts">
import { Card, CardBody } from '@/shared/components/ui/card'
import Tag from '@/shared/components/ui/Tag.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import ParticipantLabel from '@/modules/expense/components/ParticipantLabel.vue'
import { formatDate } from '@/shared/utils/datetime.util'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'
import type { SettlementDetail } from '@/modules/settlement/types/settlement.type'

defineProps<{ settlement: SettlementDetail }>()

const { locale, currency } = useAppSettingStore()
</script>

<template>
  <Card>
    <CardBody class="flex flex-col items-center gap-2 p-8">
      <Typography size="xs" color="muted">Bạn đã thanh toán</Typography>
      <Typography size="xl" weight="bold" color="success">
        {{ formatMoney(settlement.amount, locale, currency) }}
      </Typography>
      <Tag color="success" variant="filled">Đã thanh toán</Tag>
    </CardBody>
  </Card>

  <Card>
    <CardBody class="flex flex-col p-6">
      <div class="flex items-center justify-between gap-3 py-3">
        <Typography size="sm" color="muted">Trả cho</Typography>
        <ParticipantLabel :name="settlement.to.name" :avatar-url="settlement.to.avatarUrl" size="sm" />
      </div>
      <div class="flex items-center justify-between gap-3 border-t border-border py-3">
        <Typography size="sm" color="muted">Ngày thanh toán</Typography>
        <Typography size="sm">{{ formatDate(settlement.settledAt, locale) }}</Typography>
      </div>
      <div v-if="settlement.note" class="flex items-center justify-between gap-3 border-t border-border py-3">
        <Typography size="sm" color="muted">Ghi chú</Typography>
        <Typography size="sm" truncate>{{ settlement.note }}</Typography>
      </div>
    </CardBody>
  </Card>
</template>
