import { supabase } from '@/shared/lib/supabase'
import type { Json } from '@/shared/lib/database.types'
import type { SplitConfig, SplitMethod } from '@/modules/expense/types/expense-split.type'

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
  /** How the total was divided. */
  splitMethod: SplitMethod
  /** Method-specific config (percentages / custom amounts) persisted for later edits. */
  splitConfig: SplitConfig
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
    const expenseSplits = payload.splits.map((s) => ({ user_id: s.userId, share_amount: s.shareAmount }))

    const { data, error } = await supabase.rpc('create_expense_with_splits', {
      p_group_id: payload.groupId,
      p_title: payload.title,
      p_amount: payload.amount,
      p_paid_by: payload.paidBy,
      p_split_method: payload.splitMethod,
      p_split_config: payload.splitConfig as unknown as Json,
      p_expense_splits: expenseSplits as unknown as Json,
    })
    if (error) throw error
    return data
  },
}
