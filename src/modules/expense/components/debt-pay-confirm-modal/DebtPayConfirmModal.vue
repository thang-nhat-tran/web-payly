<script setup lang="ts">
import { computed } from 'vue'
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from '@/shared/components/ui/modal'
import Button from '@/shared/components/ui/Button.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import { useAppSettingStore } from '@/shared/stores/app-setting.store'
import { formatMoney } from '@/shared/utils/money.util'
import { useSettleDebts } from '@/modules/expense/composables/useSettleDebts'
import type { OwedDebt } from '@/modules/expense/types/expense.type'

const props = defineProps<{ open: boolean; groupId: string; debts: OwedDebt[] }>()
const emit = defineEmits<{ close: []; success: []; error: [Error] }>()

const { locale, currency } = useAppSettingStore()
const settleDebts = useSettleDebts()

const total = computed(() => props.debts.reduce((sum, d) => sum + d.amountIOwe, 0))

async function handleConfirm() {
  await settleDebts.mutate({
    groupId: props.groupId,
    splitIds: props.debts.map((d) => d.splitId),
    expenseIds: props.debts.map((d) => d.id),
  })
  if (settleDebts.isSuccess.value) emit('success')
  else if (settleDebts.isError.value) emit('error', settleDebts.error.value!)
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <Modal :open="open" @close="handleClose">
    <ModalHeader>
      <ModalTitle>Xác nhận thanh toán</ModalTitle>
      <ModalClose />
    </ModalHeader>

    <ModalBody>
      <Typography size="sm">
        Xác nhận đã thanh toán {{ debts.length }} khoản nợ, tổng
        <Typography as="span" weight="bold" color="danger">{{ formatMoney(total, locale, currency) }}</Typography
        >?
      </Typography>
      <ul class="mt-sm flex max-h-[240px] flex-col gap-xs overflow-y-auto">
        <li v-for="d in debts" :key="d.splitId" class="flex justify-between gap-2 text-xs text-text-secondary">
          <span class="truncate">{{ d.title }} — {{ d.paidBy.name }}</span>
          <span class="shrink-0">{{ formatMoney(d.amountIOwe, locale, currency) }}</span>
        </li>
      </ul>
    </ModalBody>

    <ModalFooter>
      <Button variant="outline" :disabled="settleDebts.isPending.value" @click="handleClose">Huỷ</Button>
      <Button color="danger" :loading="settleDebts.isPending.value" @click="handleConfirm">
        {{ settleDebts.isPending.value ? 'Đang xử lý…' : 'Xác nhận' }}
      </Button>
    </ModalFooter>
  </Modal>
</template>
