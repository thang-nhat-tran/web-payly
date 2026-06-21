import { computed, ref, type Ref } from 'vue'
import type { SplitAmountMap, SplitConfig, SplitMethod, SplitPercentageMap } from '../types/expense-split.type'
import type { ExpenseSplit } from '../schema/expense-create.schema'
import { calculateSplits } from '../utils/expense-split.util'

export function useSplitExpense(totalAmount: Ref<number>, payeeIds: Ref<string[]>) {
  const customAmountMap = ref<SplitAmountMap>({})
  const percentageMap = ref<SplitPercentageMap>({})
  const splitMethod = ref<SplitMethod>('equal')

  const splitConfig = computed<SplitConfig>(() => {
    switch (splitMethod.value) {
      case 'equal':
        return {
          method: 'equal',
        }
      case 'custom':
        return {
          method: 'custom',
          amounts: customAmountMap.value,
        }
      case 'percentage':
        return {
          method: 'percentage',
          percentages: percentageMap.value,
        }
      default:
        throw Error('Not split method supported')
    }
  })

  const splits = computed<ExpenseSplit[]>(() => {
    return calculateSplits({
      totalAmount: totalAmount.value,
      payeeIds: payeeIds.value,
      config: splitConfig.value,
    })
  })

  console.log('split', splits.value)

  const splitTotal = computed(() => splits.value.reduce((s, x) => s + x.shareAmount, 0))

  return {
    splitMethod,
    customAmountMap,
    percentageMap,
    splitConfig,
    splits,
    splitTotal,
  }
}
