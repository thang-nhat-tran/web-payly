import { groupApi } from '@/modules/group/api/group.api'
import { useQuery } from '@/shared/composables/useQuery'

export function useGroupDetail() {
  return useQuery({
    queryFn: (id: string) => groupApi.fetchGroupById(id),
  })
}
