import { groupApi } from '@/modules/group/api/group.api'
import type { CreateGroupRequest } from '@/modules/group/api/group.api'
import type { Group } from '@/modules/group/types/group.types'
import { useMutation } from '@/shared/composables/useMutation'

export function useCreateGroup() {
  return useMutation<Group, CreateGroupRequest>({
    mutationFn: (payload) => groupApi.createGroup(payload),
  })
}
