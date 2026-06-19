<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useForm, useField } from 'vee-validate'
import { ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'
import AppHeader from '@/shared/components/app/AppHeader.vue'
import ExpenseTitleField from '@/modules/expense/components/expense-create/ExpenseTitleField.vue'
import ExpenseAmountField from '@/modules/expense/components/expense-create/ExpenseAmountField.vue'
import PayerSelectRow from '@/modules/expense/components/expense-create/PayerSelectRow.vue'
import PayerPickerModal from '@/modules/expense/components/expense-create/PayerPickerModal.vue'
import PayeeSelectRow from '@/modules/expense/components/expense-create/PayeeSelectRow.vue'
import PayeePickerModal from '@/modules/expense/components/expense-create/PayeePickerModal.vue'
import ExpenseSplitBreakdown from '@/modules/expense/components/expense-create/expense-split-breakdown/ExpenseSplitBreakdown.vue'
import {
  groupMemberToExpenseParticipant,
  type ExpenseParticipant,
  type SplitMethod,
} from '@/modules/expense/types/expense.type'
import { expenseCreateSchema, type ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'
import { useCreateExpense } from '@/modules/expense/composables/useCreateExpense'
import { useGroupMemberList } from '@/modules/group-member/composables/useGroupMemberList'
import { useAuthStore } from '@/shared/stores/auth.store'
import { calculateSplits } from '../utils/expense-split.util'
import type { SplitAmountMap, SplitPercentageMap, SplitConfig } from '../types/expense-split.type'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const groupId = route.params.id as string

const { data: members, query: fetchMembers } = useGroupMemberList(groupId)
const createExpense = useCreateExpense()
const { handleSubmit: handleCreateExpense, errors } = useForm({
  validationSchema: expenseCreateSchema,
  initialValues: {
    title: '',
    amount: 0,
    paidBy: '',
    splits: [] as ExpenseSplit[],
  },
})

const participants = computed<ExpenseParticipant[]>(
  () => members.value?.map((m) => groupMemberToExpenseParticipant(m)) ?? [],
)
function getParticipantById(id: string): ExpenseParticipant | undefined {
  return participants.value.find((member) => member.id === id)
}

const { value: title } = useField<string>('title')
const { value: totalAmount } = useField<number>('amount')
const { value: splitsField } = useField<ExpenseSplit[]>('splits')

const { value: payerId } = useField<string>('paidBy')
const payer = computed<ExpenseParticipant | undefined>(() => {
  if (!payerId.value) return undefined
  return getParticipantById(payerId.value)
})

const payeeIds = ref<string[]>([])
const payees = computed<ExpenseParticipant[]>(() =>
  payeeIds.value.flatMap((id) => {
    const member = getParticipantById(id)
    return member ? [member] : []
  }),
)

watch(
  () => auth.profile,
  (userProfile) => {
    if (!userProfile) return
    payerId.value = userProfile.id
    payeeIds.value = [userProfile.id]
  },
  { immediate: true },
)

const showPayerPicker = ref(false)
const showPayeePicker = ref(false)

const onSubmit = handleCreateExpense(async (values) => {
  await createExpense.mutate({
    groupId,
    title: values.title.trim(),
    amount: values.amount,
    paidBy: values.paidBy,
    splitMethod: splitMethod.value,
    splitConfig: splitConfig.value,
    splits: values.splits,
  })

  if (createExpense.isSuccess.value) {
    toast.success('Đã thêm khoản chi', { description: values.title.trim() })
    router.back()
  } else if (createExpense.isError.value) {
    toast.error('Không thể thêm khoản chi', { description: createExpense.error.value?.message })
  }
})

const customAmountMap = ref<SplitAmountMap>({})
const percentageMap = ref<SplitPercentageMap>({})
const splitMethod = ref<SplitMethod>('equal')

const splitConfig = computed<SplitConfig>(() => {
  switch (splitMethod.value) {
    case 'equal':
      return {
        method: 'equal',
      }
    case 'custom':
      return {
        method: 'custom',
        amounts: customAmountMap.value,
      }
    case 'percentage':
      return {
        method: 'percentage',
        percentages: percentageMap.value,
      }
    default:
      throw Error('Not split method supported')
  }
})

const splitAmount = computed<ExpenseSplit[]>(() => {
  return calculateSplits({
    totalAmount: totalAmount.value,
    payeeIds: payeeIds.value,
    config: splitConfig.value,
  })
})

watch(
  splitAmount,
  (newExpenseSplit) => {
    splitsField.value = newExpenseSplit
  },
  { immediate: true },
)
onMounted(() => fetchMembers())
</script>

<template>
  <div class="min-h-svh">
    <AppHeader>
      <template #left>
        <Button variant="ghost" size="icon" aria-label="Quay lại" @click="router.back()">
          <ArrowLeft :size="24" :strokeWidth="2" />
        </Button>
      </template>
      <template #center>
        <h3>Thêm khoản chi</h3>
      </template>
    </AppHeader>

    <form class="flex flex-col gap-4 p-sm pb-3xl" @submit.prevent="onSubmit">
      <!-- Title -->
      <div>
        <ExpenseTitleField v-model="title" />
        <p v-if="errors.title" class="mt-1 px-1 text-xs text-danger-main">{{ errors.title }}</p>
      </div>

      <!-- Amount -->
      <div>
        <ExpenseAmountField v-model="totalAmount" />
        <p v-if="errors.amount" class="mt-1 px-1 text-xs text-danger-main">{{ errors.amount }}</p>
      </div>

      <!-- Payer -->
      <PayerSelectRow :payer="payer" @click="showPayerPicker = true" />

      <!-- Payees -->
      <PayeeSelectRow :members="payees" @click="showPayeePicker = true" />

      <!-- Split breakdown (equal / custom) -->
      <div>
        <ExpenseSplitBreakdown
          :expense-participant="payees"
          :total-amount="totalAmount"
          :split-amount="splitAmount"
          v-model:split-method="splitMethod"
          v-model:custom-amount-map="customAmountMap"
          v-model:percentage-map="percentageMap"
        />
        <p v-if="errors.splits" class="mt-1 px-1 text-xs text-danger-main">{{ errors.splits }}</p>
      </div>

      <Button type="submit" :loading="createExpense.isPending.value" class="mt-2 w-full">Lưu khoản chi</Button>
    </form>

    <PayerPickerModal
      :model-value="payerId"
      :open="showPayerPicker"
      :members="participants"
      @update:model-value="(selectedPayerId) => (payerId = selectedPayerId)"
      @close="showPayerPicker = false"
    />
    <PayeePickerModal
      v-model="payeeIds"
      :open="showPayeePicker"
      :members="participants"
      @close="showPayeePicker = false"
    />
  </div>
</template>
