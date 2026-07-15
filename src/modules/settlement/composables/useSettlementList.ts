import { settlementApi } from '@/modules/settlement/api/settlement.api'
import { useQuery } from '@/shared/lib/query/vue/useQuery'
import { useAuthStore } from '@/shared/stores/auth.store'

/** Cache key for a user's settlement list in a group. */
export const settlementListKey = (groupId: string, userId: string | undefined) => ['settlement-list', groupId, userId]

/** The current user's "Đã thanh toán" — settlements they made in a group. */
export function useSettlementList(groupId: string) {
  const auth = useAuthStore()
  return useQuery({
    queryKey: settlementListKey(groupId, auth.profile?.id),
    queryFn: () => {
      const userId = auth.profile?.id
      if (!userId) throw new Error('Chưa đăng nhập')
      return settlementApi.fetchSettlements(groupId, userId)
    },
  })
}
