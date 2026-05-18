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

export interface CreateGroupRequest {
  name: string
  description?: string | null
  createdBy: string
}

export type GroupDetailTab = 'expenses' | 'settlement'
export const TAB_EMPTY_MESSAGE: Record<GroupDetailTab, string> = {
  expenses: 'Chưa có khoản chi nào.',
  settlement: 'Chưa có thanh toán nào.',
}
