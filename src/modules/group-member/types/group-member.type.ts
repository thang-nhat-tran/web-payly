export type GroupMemberRole = 'admin' | 'member'

export interface GroupMember {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: GroupMemberRole
}
