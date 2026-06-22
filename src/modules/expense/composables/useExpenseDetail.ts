import { expenseApi } from '@/modules/expense/api/expense.api'
import { useQuery } from '@/shared/lib/query/vue/useQuery'
import { useAuthStore } from '@/shared/stores/auth.store'

/** Detail of one of the current user's paid expenses ("Khoản chi"). */
export function useExpenseDetail(expenseId: string) {
  const auth = useAuthStore()
  return useQuery({
    queryKey: ['expense-detail', expenseId, auth.profile?.id],
    queryFn: () => {
      const userId = auth.profile?.id
      if (!userId) throw new Error('Chưa đăng nhập')
      return expenseApi.fetchExpenseDetail(expenseId, userId)
    },
  })
}
