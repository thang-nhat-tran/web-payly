import { expenseApi } from '@/modules/expense/api/expense.api'
import type { CreateExpenseRequest } from '@/modules/expense/api/expense.api'
import { useMutation } from '@/shared/lib/query/vue/useMutation'

/** Creates an expense with its splits; resolves to the new expense id. */
export function useCreateExpense() {
  return useMutation<string, CreateExpenseRequest>({
    mutationFn: (payload) => expenseApi.createExpenseWithSplits(payload),
  })
}
