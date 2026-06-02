export interface Group {
  id: string
  name: string
  description?: string | null
  coverImageUrl?: string | null
  inviteToken: string
  createdBy: string
  createdAt: string
}

/** Extended with UI-only fields not stored in the DB */
export interface GroupWithStats extends Group {
  memberAvatarUrls: string[]
  totalAmount: number
}
