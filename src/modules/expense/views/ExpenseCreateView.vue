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
import ExpenseSplitBreakdown from '@/modules/expense/components/expense-create/ExpenseSplitBreakdown.vue'
import { mapGroupMemberToExpenseParticipant, type ExpenseParticipant } from '@/modules/expense/types/expense.types'
import { expenseCreateSchema, type ExpenseSplit } from '@/modules/expense/schema/expense-create.schema'
import { useCreateExpense } from '@/modules/expense/composables/useCreateExpense'
import { useGroupMemberList } from '@/modules/group-member/composables/useGroupMemberList'
import { useAuthStore } from '@/shared/stores/auth.store'

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

const allMembers = computed<ExpenseParticipant[]>(
  () => members.value?.map((m) => mapGroupMemberToExpenseParticipant(m)) ?? [],
)
function getMemberById(id: string): ExpenseParticipant | undefined {
  return allMembers.value.find((member) => member.id === id)
}

const { value: title } = useField<string>('title')
const { value: amount } = useField<number>('amount')
const { value: splits } = useField<ExpenseSplit[]>('splits')

const { value: payerId } = useField<string>('paidBy')
const payer = computed<ExpenseParticipant | undefined>(() => {
  if (!payerId.value) return undefined
  return getMemberById(payerId.value)
})

const payeeIds = ref<string[]>([])
const payees = computed<ExpenseParticipant[]>(() =>
  payeeIds.value.flatMap((id) => {
    const member = getMemberById(id)
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
    splits: values.splits,
  })

  if (createExpense.isSuccess.value) {
    toast.success('Đã thêm khoản chi', { description: values.title.trim() })
    router.back()
  } else if (createExpense.isError.value) {
    toast.error('Không thể thêm khoản chi', { description: createExpense.error.value?.message })
  }
})

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
        <ExpenseAmountField v-model="amount" />
        <p v-if="errors.amount" class="mt-1 px-1 text-xs text-danger-main">{{ errors.amount }}</p>
      </div>

      <!-- Payer -->
      <PayerSelectRow :payer="payer" @click="showPayerPicker = true" />

      <!-- Payees -->
      <PayeeSelectRow :members="payees" @click="showPayeePicker = true" />

      <!-- Split breakdown (equal / custom) -->
      <div>
        <ExpenseSplitBreakdown v-model="splits" :members="payees" :total="amount || 0" />
        <p v-if="errors.splits" class="mt-1 px-1 text-xs text-danger-main">{{ errors.splits }}</p>
      </div>

      <Button type="submit" :loading="createExpense.isPending.value" class="mt-2 w-full">Lưu khoản chi</Button>
    </form>

    <PayerPickerModal
      :model-value="payerId"
      :open="showPayerPicker"
      :members="allMembers"
      @update:model-value="(selectedPayerId) => (payerId = selectedPayerId)"
      @close="showPayerPicker = false"
    />
    <PayeePickerModal
      v-model="payeeIds"
      :open="showPayeePicker"
      :members="allMembers"
      @close="showPayeePicker = false"
    />
  </div>
</template>
