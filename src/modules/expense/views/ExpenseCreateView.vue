<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useForm, useField } from 'vee-validate'
import { Button } from '@/shared/components/ui/button'
import ExpenseTitleField from '@/modules/expense/components/expense-create/ExpenseTitleField.vue'
import ExpenseAmountField from '@/modules/expense/components/expense-create/ExpenseAmountField.vue'
import PayerSelectRow from '@/modules/expense/components/expense-create/PayerSelectRow.vue'
import PayerPickerModal from '@/modules/expense/components/expense-create/PayerPickerModal.vue'
import PayeeSelectRow from '@/modules/expense/components/expense-create/PayeeSelectRow.vue'
import PayeePickerModal from '@/modules/expense/components/expense-create/PayeePickerModal.vue'
import ExpenseSplitBreakdown from '@/modules/expense/components/expense-create/expense-split-breakdown/ExpenseSplitBreakdown.vue'
import { expenseCreateSchema, type ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'
import { useCreateExpense } from '@/modules/expense/composables/useCreateExpense'
import { useSplitExpense } from '../composables/useSplitExpense'
import { useExpenseParticipants } from '../composables/useExpenseParticipant'
import ExpenseCreateHeader from '../components/expense-create/ExpenseCreateHeader.vue'

const route = useRoute()
const router = useRouter()
const groupId = route.params.id as string

const { handleSubmit: handleCreateExpense, errors } = useForm({
  validationSchema: expenseCreateSchema,
  initialValues: {
    title: '',
    amount: 0,
    paidBy: '',
    splits: [] as ExpenseSplit[],
  },
})
const { value: title } = useField<string>('title')
const { value: totalAmount } = useField<number>('amount')
const { value: payerId } = useField<string>('paidBy')
const { value: splitsField } = useField<ExpenseSplit[]>('splits')

const { participants, participantsMap, payer, payees, payeeIds, fetchMembers } = useExpenseParticipants(
  groupId,
  payerId,
)

const { splitMethod, customAmountMap, percentageMap, splitConfig, splits, splitTotal } = useSplitExpense(
  totalAmount,
  payeeIds,
)

const {
  mutate: createExpense,
  isPending: isExpenseCreating,
  isSuccess: isExpenseCreated,
  isError: isExpenseCreateError,
  error: expenseCreateError,
} = useCreateExpense()

const onSubmit = handleCreateExpense(async (values) => {
  await createExpense({
    groupId,
    title: values.title.trim(),
    amount: values.amount,
    paidBy: values.paidBy,
    splitMethod: splitMethod.value,
    splitConfig: splitConfig.value,
    splits: splits.value,
  })

  if (isExpenseCreated) {
    toast.success('Đã thêm khoản chi', { description: values.title.trim() })
    router.back()
  } else if (isExpenseCreateError) {
    toast.error('Không thể thêm khoản chi', { description: expenseCreateError?.value?.message })
  }
})

const showPayerPicker = ref(false)
const showPayeePicker = ref(false)

watch(
  splits,
  (newSplits) => {
    splitsField.value = newSplits
  },
  { immediate: true },
)
onMounted(() => fetchMembers())
</script>

<template>
  <div class="min-h-svh">
    <ExpenseCreateHeader title="Thêm khoản chi" @back="router.back()" />
    <form class="flex flex-col gap-4 p-sm pb-3xl" @submit.prevent="onSubmit">
      <div>
        <ExpenseTitleField v-model="title" />
        <p v-if="errors.title" class="mt-1 px-1 text-xs text-danger-main">{{ errors.title }}</p>
      </div>

      <div>
        <ExpenseAmountField v-model="totalAmount" />
        <p v-if="errors.amount" class="mt-1 px-1 text-xs text-danger-main">{{ errors.amount }}</p>
      </div>

      <PayerSelectRow :payer="payer" @click="showPayerPicker = true" />
      <PayeeSelectRow :members="payees" @click="showPayeePicker = true" />

      <div>
        <ExpenseSplitBreakdown
          :expense-participant="payees"
          :expense-participant-map="participantsMap"
          :total-amount="totalAmount"
          :splits="splits"
          :split-total="splitTotal"
          v-model:split-method="splitMethod"
          v-model:custom-amount-map="customAmountMap"
          v-model:percentage-map="percentageMap"
        />
        <p v-if="errors.splits" class="mt-1 px-1 text-xs text-danger-main">{{ errors.splits }}</p>
      </div>

      <Button type="submit" :loading="isExpenseCreating" class="mt-2 w-full">Lưu khoản chi</Button>
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
