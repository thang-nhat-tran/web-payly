<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AppHeader from '@/shared/components/app/AppHeader.vue'
import { Card, CardBody } from '@/shared/components/ui/card'
import Button from '@/shared/components/ui/Button.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import Skeleton from '@/shared/components/ui/Skeleton.vue'
import SettlementDetailSummary from '@/modules/settlement/components/settlement-detail/SettlementDetailSummary.vue'
import SettlementSplitList from '@/modules/settlement/components/settlement-detail/SettlementSplitList.vue'
import SettlementEvidenceCard from '@/modules/settlement/components/settlement-detail/SettlementEvidenceCard.vue'
import { useSettlementDetail } from '@/modules/settlement/composables/useSettlementDetail'

const route = useRoute()
const router = useRouter()

const { data: settlement, isPending, query: fetchSettlement } = useSettlementDetail(route.params.settlementId as string)

function back() {
  router.back()
}

onMounted(() => fetchSettlement())
</script>

<template>
  <div class="min-h-svh">
    <AppHeader>
      <template #left>
        <Button variant="ghost" size="xs" aria-label="Quay lại" @click="back">
          <ArrowLeft :size="24" :strokeWidth="2" />
        </Button>
      </template>
      <template #center>
        <Typography size="md" weight="semibold">Chi tiết thanh toán</Typography>
      </template>
    </AppHeader>

    <main v-if="isPending" class="flex flex-col gap-4 p-sm pb-3xl">
      <Card>
        <CardBody class="flex flex-col items-center gap-3 p-8">
          <Skeleton width="6rem" height="1.25rem" />
          <Skeleton width="10rem" height="2.5rem" />
          <Skeleton width="8rem" height="2rem" radius="pill" />
        </CardBody>
      </Card>
      <Card>
        <CardBody class="flex flex-col p-6">
          <div
            v-for="i in 3"
            :key="i"
            class="flex items-center justify-between gap-3 py-3"
            :class="{ 'border-t border-border-secondary': i > 1 }"
          >
            <Skeleton width="4rem" height="1.5rem" />
            <Skeleton width="8rem" height="1.5rem" />
          </div>
        </CardBody>
      </Card>
    </main>

    <main v-else-if="settlement" class="flex flex-col gap-4 p-sm pb-3xl">
      <SettlementDetailSummary :settlement="settlement" />
      <SettlementSplitList :splits="settlement.splits" />
      <SettlementEvidenceCard :path="settlement.evidenceImagePath" />
    </main>

    <Typography v-else size="sm" color="muted" align="center" class="p-lg block">
      Không tìm thấy khoản thanh toán.
    </Typography>
  </div>
</template>
