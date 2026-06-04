import { useMutation } from '@/shared/composables/useMutation'
import { groupMemberApi } from '../api/group-member.api'

export function useGroupJoin() {
  return useMutation({
    mutationFn: (inviteToken: string) => groupMemberApi.joinGroupByToken(inviteToken),
  })
}
