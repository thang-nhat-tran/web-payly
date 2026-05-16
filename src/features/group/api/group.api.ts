import { from } from '@/shared/lib/supabase'
import type { CreateGroupRequest } from '@/features/group/types/group.types'

export const groupApi = {
  fetchGroups: (userId: string) =>
    from('groups')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false }),

  createGroup: (payload: CreateGroupRequest) =>
    from('groups').insert(payload).select().single(),
}
