import { supabase } from '@/lib/supabase'
import type { Group } from '@/types/groupType'

export const groupApi = {
  fetchGroups: (userId: string) =>
    supabase
      .from('groups')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false }),

  createGroup: (payload: Pick<Group, 'name' | 'description' | 'created_by'>) =>
    supabase.from('groups').insert(payload).select().single<Group>(),
}
