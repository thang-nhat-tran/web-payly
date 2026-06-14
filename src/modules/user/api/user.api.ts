import { supabase } from '@/shared/lib/supabase'
import type { Tables } from '@/shared/lib/database.types'
import type { UserProfile } from '@/modules/user/types/user.type'

type UserRow = Tables<'users'>

/** Maps a raw `users` row (server, snake_case) to the `UserProfile` domain model. */
function mapUser(row: UserRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  }
}

export const userApi = {
  /** Fetches the currently authenticated user's profile. */
  async getMe(): Promise<UserProfile> {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError

    const userId = authData.user?.id
    if (!userId) throw new Error('Not authenticated')

    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()
    if (error) throw error
    return mapUser(data)
  },
}
