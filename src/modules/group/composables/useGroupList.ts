import { groupApi } from '@/modules/group/api/group.api'
import { useQuery } from '@/shared/lib/query/vue/useQuery'

export function useGroupList() {
  return useQuery({
    queryKey: ['group-list'],
    queryFn: () => groupApi.fetchMyGroups(),
  })
}
