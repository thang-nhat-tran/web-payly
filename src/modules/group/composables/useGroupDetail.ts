import { groupApi } from '@/modules/group/api/group.api'
import type { Group } from '@/modules/group/types/group.types'
import { useQuery } from '@/shared/composables/useQuery'
import { supabaseCall } from '@/shared/lib/supabase'

export function useGroupDetail() {
  return useQuery<Group, string>({
    queryFn: (id) => supabaseCall(groupApi.fetchGroupById(id)),
  })
}
