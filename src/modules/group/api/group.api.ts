import { supabase } from '@/shared/lib/supabase'
import type { QueryData } from '@supabase/supabase-js'
import type { Tables, TablesInsert } from '@/shared/lib/database.types'
import type { Group, GroupWithStats } from '@/modules/group/types/group.types'

export interface CreateGroupRequest {
  name: string
  description?: string | null
  createdBy: string
}

type GroupRow = Tables<'groups'>

/** Builds the "my groups" query with its embedded members; used to fetch and to infer the row type. */
function myGroupsQuery() {
  return supabase
    .from('groups')
    .select('*, group_members(users(full_name, avatar_url))')
    .order('created_at', { ascending: false })
}
type MyGroupsRows = QueryData<ReturnType<typeof myGroupsQuery>>
type GroupWithMembersRow = MyGroupsRows[number]

/** Maps a raw `groups` row (server, snake_case) to the `Group` domain model (UI, camelCase). */
function mapGroup(row: GroupRow): Group {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    inviteToken: row.invite_token,
    createdBy: row.created_by,
    createdAt: row.created_at ?? '',
  }
}

function mapGroupWithStats(row: GroupWithMembersRow): GroupWithStats {
  return {
    ...mapGroup(row),
    memberAvatarUrls: row.group_members.map((m) => m.users?.avatar_url ?? ''),
    totalAmount: 0, // TODO: derive from expenses once wired up
  }
}

export const groupApi = {
  async fetchMyGroups(): Promise<GroupWithStats[]> {
    const { data, error } = await myGroupsQuery()
    if (error) throw error
    return data.map(mapGroupWithStats)
  },

  async fetchGroupById(id: string): Promise<Group> {
    const { data, error } = await supabase.from('groups').select('*').eq('id', id).single()
    if (error) throw error
    return mapGroup(data)
  },

  async createGroup(payload: CreateGroupRequest): Promise<Group> {
    const insert: TablesInsert<'groups'> = {
      name: payload.name,
      description: payload.description,
      created_by: payload.createdBy,
    }
    const { data, error } = await supabase.from('groups').insert(insert).select().single()
    if (error) throw error
    return mapGroup(data)
  },
}
