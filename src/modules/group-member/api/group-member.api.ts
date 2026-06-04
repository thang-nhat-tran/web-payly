import { supabase } from '@/shared/lib/supabase'
import type { QueryData } from '@supabase/supabase-js'
import type { GroupMember } from '@/modules/group-member/types/group-member.type'

/** Builds the group-members query with its embedded user; used to fetch and to infer the row type. */
function groupMembersQuery(groupId: string) {
  return supabase
    .from('group_members')
    .select('role, user_id, joined_at, users(email, full_name, avatar_url)')
    .eq('group_id', groupId)
}
type GroupMemberRow = QueryData<ReturnType<typeof groupMembersQuery>>[number]

/** Maps a raw `group_members` row (server, snake_case) to the `GroupMember` domain model (UI). */
function mapGroupMember(row: GroupMemberRow): GroupMember {
  return {
    id: row.user_id,
    name: row.users?.full_name ?? '',
    email: row.users?.email ?? '',
    avatarUrl: row.users?.avatar_url ?? undefined,
    role: row.role,
  }
}

export const groupMemberApi = {
  async fetchGroupMembers(groupId: string): Promise<GroupMember[]> {
    const { data, error } = await groupMembersQuery(groupId)
    if (error) throw error
    return data.map(mapGroupMember)
  },

  /** Joins the current user to a group via its invite token. Returns the joined group's id. */
  async joinGroupByToken(inviteToken: string): Promise<string> {
    const { data, error } = await supabase.rpc('join_group_by_token', { p_invite_token: inviteToken })
    if (error) throw error
    return data
  },
}
