import type { ExpenseSplit } from '../schema/expense-create.schema'
import type { SplitConfig } from '../types/expense-split.type'

function calculateEqualSplits(totalAmount: number, payeeIds: string[]): ExpenseSplit[] {
  if (payeeIds.length === 0) return []
  const shareAmount = totalAmount / payeeIds.length
  return payeeIds.map((id) => ({
    userId: id,
    shareAmount,
  }))
}

function calculatePercentageSplits(
  totalAmount: number,
  payeeIds: string[],
  percentages: Record<string, number>,
): ExpenseSplit[] {
  return payeeIds.map((id) => ({
    userId: id,
    shareAmount: Math.round((totalAmount * (percentages[id] ?? 0)) / 100),
  }))
}

function calculateCustomSplits(amounts: Record<string, number>): ExpenseSplit[] {
  return Object.entries(amounts).map(([userId, shareAmount]) => ({
    userId,
    shareAmount,
  }))
}

type CalculateSplitInput = {
  totalAmount: number
  payeeIds: string[]
  config: SplitConfig
}
export function calculateSplits(input: CalculateSplitInput): ExpenseSplit[] {
  const { totalAmount, payeeIds: memberIds, config } = input
  switch (config.method) {
    case 'equal':
      return calculateEqualSplits(totalAmount, memberIds)

    case 'percentage':
      return calculatePercentageSplits(totalAmount, memberIds, config.percentages)

    case 'custom':
      return calculateCustomSplits(config.amounts)

    default:
      throw new Error(`Unhandled split config: ${JSON.stringify(config)}`)
  }
}
