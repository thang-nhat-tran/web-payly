export interface GroupMember {
  id: number
  name: string
  avatarUrl?: string
  email: string
  role: 'admin' | 'member'
}
