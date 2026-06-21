import type { GroupMember } from '@/modules/group-member/types/group-member.type'

export interface ExpenseParticipant {
  id: string
  name: string
  avatarUrl: string | null
}

export function groupMemberToExpenseParticipant(member: GroupMember): ExpenseParticipant {
  return {
    id: member.id,
    name: member.name,
    avatarUrl: member.avatarUrl,
  }
}

export type ExpenseParticipantMap = Record<string, ExpenseParticipant>
