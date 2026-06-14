/** The current user's profile (the `users` table row), in camelCase. */
export interface UserProfile {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  createdAt: string | null
}
