import type { ExpenseSplit } from '../schema/expense-create.schema'

export type SplitMethod = 'equal' | 'percentage' | 'custom'

type SplitConfigBase<TMethod extends SplitMethod> = {
  method: TMethod
}

type EqualSplitConfig = SplitConfigBase<'equal'>

type PercentageSplitConfig = SplitConfigBase<'percentage'> & {
  percentages: Record<string, number>
}

type CustomSplitConfig = SplitConfigBase<'custom'> & {
  amounts: Record<string, number>
}

export type SplitConfig = EqualSplitConfig | PercentageSplitConfig | CustomSplitConfig

export type SplitAmountMap = Record<string, number>
export type SplitPercentageMap = Record<string, number>

export function splitAmountMapToSplits(amountMap: SplitAmountMap): ExpenseSplit[] {
  return Object.entries(amountMap).map(([userId, shareAmount]) => ({
    userId,
    shareAmount,
  }))
}

export function splitsToSplitAmountMap(splits: ExpenseSplit[]): SplitAmountMap {
  return Object.fromEntries(splits.map((split) => [split.userId, split.shareAmount]))
}
