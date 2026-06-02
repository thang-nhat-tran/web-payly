import { from } from '@/shared/lib/supabase'
import type { Group } from '@/modules/group/types/group.types'

export interface CreateGroupRequest {
  name: string
  description?: string | null
  createdBy: string
}

/** Raw row from `fetchMyGroups` — a group with its joined members (camelCased by `supabaseCall`). */
export interface GroupWithMembersRow extends Group {
  groupMembers: {
    users: {
      fullName: string | null
      avatarUrl: string | null
    } | null
  }[]
}

export const groupApi = {
  fetchMyGroups: () =>
    from('groups')
      .select(
        `
      *,
      group_members (
        users (
          full_name,
          avatar_url
        )
      )
      `,
      )
      .order('created_at', { ascending: false }),

  fetchGroupById: (id: string) =>
    from('groups').select('*').eq('id', id).single(),

  createGroup: (payload: CreateGroupRequest) =>
    from('groups').insert(payload).select().single(),
}
