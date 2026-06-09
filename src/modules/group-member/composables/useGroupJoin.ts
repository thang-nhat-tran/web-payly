import { useMutation } from '@/shared/lib/query/vue/useMutation'
import { groupMemberApi } from '../api/group-member.api'

export function useGroupJoin() {
  return useMutation({
    mutationFn: (inviteToken: string) => groupMemberApi.joinGroupByToken(inviteToken),
  })
}
