import { settlementApi } from '@/modules/settlement/api/settlement.api'
import { useQuery } from '@/shared/lib/query/vue/useQuery'

/** Cache key for a resolved, viewable URL for an evidence path. */
export const settlementEvidenceUrlKey = (path: string) => ['settlement-evidence-url', path]

/** Resolves a private-bucket evidence path to a short-lived signed URL for display. */
export function useSettlementEvidenceUrl(path: string) {
  return useQuery({
    queryKey: settlementEvidenceUrlKey(path),
    queryFn: () => settlementApi.getEvidenceImageUrl(path),
  })
}
