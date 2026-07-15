/** A payment the current user made to settle one or more debts in a group. */
export interface Settlement {
  id: string
  groupId: string
  amount: number
  title: string
  note: string | null
  settledAt: string
  /** Storage path of the uploaded payment-proof image, if any — not a URL. */
  evidenceImagePath: string | null
  to: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

/** One expense split this settlement paid off. */
export interface SettlementSplit {
  id: string
  expenseId: string
  expenseTitle: string
  expenseCreatedAt: string
  shareAmount: number
}

export interface SettlementDetail extends Settlement {
  splits: SettlementSplit[]
}
