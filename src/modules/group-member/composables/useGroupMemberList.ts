import { groupMemberApi } from '@/modules/group-member/api/group-member.api'
import { useQuery } from '@/shared/composables/useQuery'

export function useGroupMemberList() {
  return useQuery({
    queryFn: (groupId: string) => groupMemberApi.fetchGroupMembers(groupId),
  })
}
