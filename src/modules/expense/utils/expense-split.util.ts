import type { ExpenseSplit } from '../schema/expense-create.schema'
import type { SplitConfig } from '../types/expense-split.type'

function calculateEqualSplits(totalAmount: number, payeeIds: string[]): ExpenseSplit[] {
  const shareAmount = totalAmount === 0 ? 0 : totalAmount / payeeIds.length
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

function calculateCustomSplits(payeeIds: string[], amounts: Record<string, number>): ExpenseSplit[] {
  return payeeIds.map((id) => ({
    userId: id,
    shareAmount: amounts[id] ?? 0,
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
      return calculateCustomSplits(memberIds, config.amounts)

    default:
      throw new Error(`Unhandled split config: ${JSON.stringify(config)}`)
  }
}
