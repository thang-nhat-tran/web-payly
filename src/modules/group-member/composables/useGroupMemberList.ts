import { groupMemberApi, type GroupMemberRow } from '@/modules/group-member/api/group-member.api'
import type { GroupMember } from '@/modules/group-member/types/group-member.type'
import { useQuery } from '@/shared/composables/useQuery'
import { supabaseCall } from '@/shared/lib/supabase'

export function useGroupMemberList() {
  return useQuery<GroupMember[], string>({
    queryFn: (groupId) =>
      supabaseCall<GroupMemberRow[]>(groupMemberApi.fetchGroupMembers(groupId)).then((rows) =>
        rows.map((row) => ({
          id: row.userId,
          name: row.users?.fullName ?? '',
          email: row.users?.email ?? '',
          avatarUrl: row.users?.avatarUrl ?? undefined,
          role: row.role,
        })),
      ),
  })
}
