export interface Group {
  id: string
  name: string
  description?: string | null
  created_by: string
  created_at: string
}

export interface GroupMember {
  name: string
  avatar_url?: string
}

/** Extended with UI-only fields not stored in the DB */
export interface GroupWithStats extends Group {
  members: GroupMember[]
  total_amount: number
}
