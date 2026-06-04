import { groupApi } from '@/modules/group/api/group.api'
import { useQuery } from '@/shared/composables/useQuery'

export function useGroupList() {
  return useQuery({
    queryFn: () => groupApi.fetchMyGroups(),
  })
}
