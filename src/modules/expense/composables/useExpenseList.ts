import { expenseApi } from '@/modules/expense/api/expense.api'
import { useQuery } from '@/shared/lib/query/vue/useQuery'
import { useAuthStore } from '@/shared/stores/auth.store'

/** Cache key for a user's paid-expense list in a group. */
export const expenseListKey = (groupId: string, userId: string | undefined) => ['expense-list', groupId, userId]

/** The current user's "Khoản chi" — expenses they paid for in a group. */
export function useExpenseList(groupId: string) {
  const auth = useAuthStore()
  return useQuery({
    queryKey: expenseListKey(groupId, auth.profile?.id),
    queryFn: () => {
      const userId = auth.profile?.id
      if (!userId) throw new Error('Chưa đăng nhập')
      return expenseApi.fetchPaidExpenses(groupId, userId)
    },
  })
}
