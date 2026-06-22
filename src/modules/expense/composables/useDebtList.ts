import { expenseApi } from '@/modules/expense/api/expense.api'
import { useQuery } from '@/shared/lib/query/vue/useQuery'
import { useAuthStore } from '@/shared/stores/auth.store'

/** Cache key for a user's owed-debt list in a group. */
export const debtListKey = (groupId: string, userId: string | undefined) => ['debt-list', groupId, userId]

/** The current user's "Khoản nợ" — their shares of expenses others paid in a group. */
export function useDebtList(groupId: string) {
  const auth = useAuthStore()
  return useQuery({
    queryKey: debtListKey(groupId, auth.profile?.id),
    queryFn: () => {
      const userId = auth.profile?.id
      if (!userId) throw new Error('Chưa đăng nhập')
      return expenseApi.fetchOwedDebts(groupId, userId)
    },
  })
}
