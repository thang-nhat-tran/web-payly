export type ExpenseSplitStatus = 'pending' | 'paid' | 'overdue'

export interface ExpenseSplit {
  id: string
  title: string
  paidBy: {
    name: string
    avatarUrl?: string
  }
  paidAt: string // ISO date string
  amount: number // amount the current user owes
  status: ExpenseSplitStatus
}
