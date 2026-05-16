import { from } from '@/shared/lib/supabase'
import type { CreateGroupRequest } from '@/features/group/types/group.types'

export const groupApi = {
  fetchMyGroups: () =>
    from('groups').select('*').order('created_at', { ascending: false }),

  createGroup: (payload: CreateGroupRequest) =>
    from('groups').insert(payload).select().single(),
}
