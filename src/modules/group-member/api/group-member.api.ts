import { from } from '@/shared/lib/supabase'
import type { GroupMemberRole } from '@/modules/group-member/types/group-member.type'

export interface GroupMemberRow {
  role: GroupMemberRole
  userId: string
  joinedAt: string
  users: {
    email: string
    fullName: string | null
    avatarUrl: string | null
  } | null
}

export const groupMemberApi = {
  fetchGroupMembers: (groupId: string) =>
    from('group_members')
      .select(
        `
      role,
      user_id,
      joined_at,
      users (
        email,
        full_name,
        avatar_url
      )
      `,
      )
      .eq('group_id', groupId),
}
