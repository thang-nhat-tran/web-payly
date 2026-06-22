import { expenseApi } from '@/modules/expense/api/expense.api'
import { useQuery } from '@/shared/lib/query/vue/useQuery'
import { useAuthStore } from '@/shared/stores/auth.store'

/** Detail of the current user's debt for a single expense ("Khoản nợ"). */
export function useDebtDetail(expenseId: string) {
  const auth = useAuthStore()
  return useQuery({
    queryKey: ['debt-detail', expenseId, auth.profile?.id],
    queryFn: () => {
      const userId = auth.profile?.id
      if (!userId) throw new Error('Chưa đăng nhập')
      return expenseApi.fetchDebtDetail(expenseId, userId)
    },
  })
}
