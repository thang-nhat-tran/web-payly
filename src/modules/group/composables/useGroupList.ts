import { groupApi, type GroupWithMembersRow } from '@/modules/group/api/group.api'
import type { GroupWithStats } from '@/modules/group/types/group.types'
import { useQuery } from '@/shared/composables/useQuery'
import { supabaseCall } from '@/shared/lib/supabase'

export function useGroupList() {
  return useQuery<GroupWithStats[]>({
    queryFn: () =>
      supabaseCall<GroupWithMembersRow[]>(groupApi.fetchMyGroups()).then((rows) =>
        rows.map(({ groupMembers, ...group }) => ({
          ...group,
          memberAvatarUrls: groupMembers.map((m) => m.users?.avatarUrl ?? ''),
          totalAmount: 0,
        })),
      ),
  })
}
