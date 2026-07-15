import { settlementApi } from '@/modules/settlement/api/settlement.api'
import { useQuery } from '@/shared/lib/query/vue/useQuery'

/** Cache key for a single settlement's detail. */
export const settlementDetailKey = (settlementId: string) => ['settlement-detail', settlementId]

/** One settlement with the expense splits it paid off. */
export function useSettlementDetail(settlementId: string) {
  return useQuery({
    queryKey: settlementDetailKey(settlementId),
    queryFn: () => settlementApi.fetchSettlementDetail(settlementId),
  })
}
