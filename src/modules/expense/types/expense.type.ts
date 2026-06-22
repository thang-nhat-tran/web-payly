import type { ExpenseParticipant } from './expense-participant.type'

/** Settlement state of a debt or a single participant's share. */
export type SettlementStatus = 'pending' | 'paid'

/** A group member referenced on an expense — the payer or a participant. */

/** One participant's portion of an expense, and whether they've settled it. */
export interface ExpenseShare {
  participant: ExpenseParticipant
  amount: number
  status: SettlementStatus
}

/**
 * An expense the current user paid up front — everyone else owes their share
 * back. Drives the "expense" card (money coming **to** me).
 */
export interface PaidExpense {
  kind: 'expense'
  id: string
  title: string
  paidAt: string // ISO date string
  /** Total the current user paid up front. */
  totalAmount: number
  /** Sum still outstanding from the debtors (excludes anyone who has paid). */
  amountOwedToMe: number
  /** Who owes the user, how much, and each share's status. */
  debtors: ExpenseShare[]
}

/**
 * The current user's share of an expense someone else paid for. Drives the
 * "debt" card (money **I** owe).
 */
export interface OwedDebt {
  kind: 'debt'
  id: string
  title: string
  paidAt: string // ISO date string
  /** Who fronted the money. */
  paidBy: ExpenseParticipant
  /** The current user's outstanding share. */
  amountIOwe: number
  status: SettlementStatus
  /** Optional ISO due date used to surface "overdue". */
  dueAt?: string
}

/**
 * Either card kind, discriminated by `kind` — convenient for a single mixed
 * activity feed. Narrow on `item.kind` to render `<ExpenseCard>` vs `<DebtCard>`.
 */
export type ExpenseCardItem = PaidExpense | OwedDebt
