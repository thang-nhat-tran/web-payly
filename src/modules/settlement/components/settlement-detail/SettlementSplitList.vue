<script setup lang="ts">
import { Card, CardBody } from '@/shared/components/ui/card'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import SettlementSplitRow from './SettlementSplitRow.vue'
import type { SettlementSplit } from '@/modules/settlement/types/settlement.type'

defineProps<{ splits: SettlementSplit[] }>()
</script>

<template>
  <Card>
    <CardBody class="flex flex-col p-6">
      <Typography size="sm" weight="semibold" as="div" class="pb-2">Thanh toán cho khoản chi</Typography>

      <SettlementSplitRow
        v-for="(split, index) in splits"
        :key="split.id"
        :split="split"
        :class="{ 'border-t border-border-secondary': index > 0 }"
      />

      <Typography v-if="!splits.length" size="sm" color="muted">Không có khoản chi nào</Typography>
    </CardBody>
  </Card>
</template>
