import { expenseApi } from '@/modules/expense/api/expense.api'
import type { CreateExpenseRequest } from '@/modules/expense/api/expense.api'
import { useMutation } from '@/shared/lib/query/vue/useMutation'
import { useQueryClient } from '@/shared/lib/query/vue/useQueryClient'
import { useAuthStore } from '@/shared/stores/auth.store'
import { expenseListKey } from './useExpenseList'
import { debtListKey } from './useDebtList'

/** Creates an expense with its splits; resolves to the new expense id. */
export function useCreateExpense() {
  const queryClient = useQueryClient()
  const auth = useAuthStore()

  return useMutation<string, CreateExpenseRequest>({
    mutationFn: (payload) => expenseApi.createExpenseWithSplits(payload),
    onSuccess: (_id, payload) => {
      // The new expense changes both what the user is owed and what they owe in this group.
      const userId = auth.profile?.id
      queryClient.invalidateQuery(expenseListKey(payload.groupId, userId))
      queryClient.invalidateQuery(debtListKey(payload.groupId, userId))
    },
  })
}
