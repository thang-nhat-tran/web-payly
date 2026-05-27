export interface Group {
  id: string
  name: string
  description?: string | null
  coverImageUrl?: string | null
  createdBy: string
  createdAt: string
}

export interface GroupMember {
  name: string
  avatarUrl?: string
}

/** Extended with UI-only fields not stored in the DB */
export interface GroupWithStats extends Group {
  members: GroupMember[]
  totalAmount: number
}
