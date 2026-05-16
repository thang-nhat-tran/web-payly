import { groupApi } from '@/features/group/api/group.api'
import type {
  CreateGroupRequest,
  Group,
} from '@/features/group/types/group.types'
import { useMutation } from '@/shared/composables/useMutation'
import { supabaseCall } from '@/shared/lib/supabase'

export function useCreateGroup() {
  return useMutation<Group, CreateGroupRequest>({
    mutationFn: (payload) => supabaseCall(groupApi.createGroup(payload)),
  })
}
