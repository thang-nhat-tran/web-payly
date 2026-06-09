import { groupMemberApi } from '@/modules/group-member/api/group-member.api'
import { useQuery } from '@/shared/lib/query/vue/useQuery'

export function useGroupMemberList(groupId: string) {
  return useQuery({
    queryKey: ['group-member-list', groupId],
    queryFn: () => groupMemberApi.fetchGroupMembers(groupId),
  })
}
