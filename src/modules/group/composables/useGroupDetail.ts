import { groupApi } from '@/modules/group/api/group.api'
import { useQuery } from '@/shared/lib/query/vue/useQuery'

export function useGroupDetail(id: string) {
  return useQuery({
    queryKey: ['group-detail', id],
    queryFn: () => groupApi.fetchGroupById(id),
  })
}
