<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { ArrowLeft } from 'lucide-vue-next'
import AppHeader from '@/shared/components/app/AppHeader.vue'
import { Card, CardBody } from '@/shared/components/ui/card'
import Button from '@/shared/components/ui/Button.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import Skeleton from '@/shared/components/ui/Skeleton.vue'
import DebtCard from '@/modules/expense/components/debt-card/DebtCard.vue'
import DebtCardSkeleton from '@/modules/expense/components/debt-card/DebtCardSkeleton.vue'
import UploadSettlementEvidenceImage from '@/modules/expense/components/upload-settlement-evidence-image/UploadSettlementEvidenceImage.vue'
import { useDebtList } from '@/modules/expense/composables/useDebtList'
import { useSettleDebts } from '@/modules/expense/composables/useSettleDebts'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'

const route = useRoute()
const router = useRouter()
const { locale, currency } = useAppSettingStore()

const groupId = route.params.id as string
const splitIds = computed(
  () =>
    new Set(
      String(route.query.splitIds ?? '')
        .split(',')
        .filter(Boolean),
    ),
)

const { data: debts, isPending, query: fetchDebts } = useDebtList(groupId)
const settleDebts = useSettleDebts()
const evidencePaths = ref<string[]>([])

const selectedDebts = computed(() => (debts.value ?? []).filter((d) => splitIds.value.has(d.splitId)))
const total = computed(() => selectedDebts.value.reduce((sum, d) => sum + d.amountIOwe, 0))

async function handleConfirm() {
  await settleDebts.mutate({
    groupId,
    splitIds: selectedDebts.value.map((d) => d.splitId),
    expenseIds: selectedDebts.value.map((d) => d.id),
    evidenceImagePath: evidencePaths.value[0],
  })
  if (settleDebts.isSuccess.value) {
    toast.success('Đã thanh toán khoản nợ')
    router.back()
  } else if (settleDebts.isError.value) {
    toast.error('Thanh toán thất bại', { description: settleDebts.error.value!.message })
  }
}

function back() {
  router.back()
}

onMounted(() => fetchDebts())
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
        <Typography size="md" weight="semibold">Xác nhận thanh toán</Typography>
      </template>
    </AppHeader>

    <main v-if="isPending" class="flex flex-col gap-4 p-sm pb-24">
      <Card>
        <CardBody class="flex flex-col items-center gap-3 p-8">
          <Skeleton width="10rem" height="1.25rem" />
          <Skeleton width="8rem" height="2.5rem" />
        </CardBody>
      </Card>
      <DebtCardSkeleton v-for="i in 3" :key="i" />
    </main>

    <main v-else-if="selectedDebts.length" class="flex flex-col gap-4 p-sm pb-24">
      <Card>
        <CardBody class="flex flex-col items-center gap-2 p-8">
          <Typography size="xs" color="muted">Bạn sẽ thanh toán {{ selectedDebts.length }} khoản nợ</Typography>
          <Typography size="xl" weight="bold" color="danger">
            {{ formatMoney(total, locale, currency) }}
          </Typography>
        </CardBody>
      </Card>

      <div class="flex flex-col gap-sm">
        <DebtCard v-for="d in selectedDebts" :key="d.splitId" :debt="d" :selectable="false" />
      </div>

      <Card>
        <CardBody class="flex flex-col gap-sm p-md">
          <Typography size="sm" weight="semibold">Bằng chứng thanh toán (không bắt buộc)</Typography>
          <UploadSettlementEvidenceImage v-model:paths="evidencePaths" />
        </CardBody>
      </Card>
    </main>

    <Typography v-else size="sm" color="muted" align="center" class="p-lg block">
      Không có khoản nợ nào để thanh toán.
    </Typography>

    <div
      v-if="!isPending && selectedDebts.length"
      class="fixed bottom-0 z-50 border-t border-border bg-bg-elevated px-sm py-sm shadow-sm w-full"
    >
      <Button color="danger" class="w-full" :loading="settleDebts.isPending.value" @click="handleConfirm">
        {{
          settleDebts.isPending.value ? 'Đang xử lý…' : `Xác nhận thanh toán ${formatMoney(total, locale, currency)}`
        }}
      </Button>
    </div>
  </div>
</template>
