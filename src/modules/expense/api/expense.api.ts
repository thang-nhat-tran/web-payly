import { supabase } from '@/shared/lib/supabase'
import type { Json } from '@/shared/lib/database.types'

/** One participant's portion of an expense (app-side, camelCase). */
export interface ExpenseSplitInput {
  userId: string
  shareAmount: number
}

export interface CreateExpenseRequest {
  groupId: string
  title: string
  /** Total expense amount; must equal the sum of the split shares. */
  amount: number
  /** User id of the payer (who fronted the money). */
  paidBy: string
  splits: ExpenseSplitInput[]
}

export const expenseApi = {
  /**
   * Creates an expense and its splits atomically via the
   * `create_expense_with_splits` Postgres function.
   * @returns the new expense's id.
   */
  async createExpenseWithSplits(payload: CreateExpenseRequest): Promise<string> {
    // Convert the app's camelCase splits to the snake_case jsonb the RPC expects:
    // `(user_id uuid, share_amount numeric)[]`.
    const splits = payload.splits.map((s) => ({ user_id: s.userId, share_amount: s.shareAmount }))

    const { data, error } = await supabase.rpc('create_expense_with_splits', {
      p_group_id: payload.groupId,
      p_title: payload.title,
      p_amount: payload.amount,
      p_paid_by: payload.paidBy,
      p_splits: splits as unknown as Json,
    })
    if (error) throw error
    return data
  },
}
