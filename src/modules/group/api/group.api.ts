import { from } from '@/shared/lib/supabase'

export interface CreateGroupRequest {
  name: string
  description?: string | null
  createdBy: string
}

export const groupApi = {
  fetchMyGroups: () =>
    from('groups').select('*').order('created_at', { ascending: false }),

  fetchGroupById: (id: string) =>
    from('groups').select('*').eq('id', id).single(),

  createGroup: (payload: CreateGroupRequest) =>
    from('groups').insert(payload).select().single(),
}
