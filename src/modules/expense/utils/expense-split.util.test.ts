import { describe, it, expect } from 'vitest'
import { calculateSplits } from './expense-split.util'

const members = ['a', 'b', 'c']

describe('calculateSplits — equal', () => {
  it('divides the total evenly as a float', () => {
    const splits = calculateSplits({ totalAmount: 100000, payeeIds: members, config: { method: 'equal' } })
    expect(splits).toHaveLength(3)
    expect(splits.map((s) => s.userId)).toEqual(['a', 'b', 'c'])
    splits.forEach((s) => expect(s.shareAmount).toBeCloseTo(100000 / 3, 10))
  })

  it('divides exactly when divisible', () => {
    const splits = calculateSplits({ totalAmount: 90000, payeeIds: members, config: { method: 'equal' } })
    expect(splits.map((s) => s.shareAmount)).toEqual([30000, 30000, 30000])
  })

  it('shares sum back to the total (within float tolerance)', () => {
    const splits = calculateSplits({ totalAmount: 100000, payeeIds: members, config: { method: 'equal' } })
    const sum = splits.reduce((acc, s) => acc + s.shareAmount, 0)
    expect(sum).toBeCloseTo(100000, 6)
  })

  it('returns an empty array when there are no members', () => {
    expect(calculateSplits({ totalAmount: 100000, payeeIds: [], config: { method: 'equal' } })).toEqual([])
  })

  it('gives a single member the whole amount', () => {
    const splits = calculateSplits({ totalAmount: 100000, payeeIds: ['a'], config: { method: 'equal' } })
    expect(splits).toEqual([{ userId: 'a', shareAmount: 100000 }])
  })
})

describe('calculateSplits — percentage', () => {
  it('allocates by percentage, rounded to the nearest unit', () => {
    const splits = calculateSplits({
      totalAmount: 100000,
      payeeIds: ['a', 'b'],
      config: { method: 'percentage', percentages: { a: 33, b: 67 } },
    })
    expect(splits).toEqual([
      { userId: 'a', shareAmount: 33000 },
      { userId: 'b', shareAmount: 67000 },
    ])
  })

  it('rounds fractional shares', () => {
    const splits = calculateSplits({
      totalAmount: 150000,
      payeeIds: ['a'],
      config: { method: 'percentage', percentages: { a: 33.33 } },
    })
    expect(splits).toEqual([{ userId: 'a', shareAmount: 49995 }])
  })

  it('treats a missing percentage as 0', () => {
    const splits = calculateSplits({
      totalAmount: 100000,
      payeeIds: ['a', 'b'],
      config: { method: 'percentage', percentages: { a: 100 } },
    })
    expect(splits).toEqual([
      { userId: 'a', shareAmount: 100000 },
      { userId: 'b', shareAmount: 0 },
    ])
  })
})

describe('calculateSplits — custom', () => {
  it('maps the explicit amounts to splits', () => {
    const splits = calculateSplits({
      totalAmount: 100000,
      payeeIds: members,
      config: { method: 'custom', amounts: { a: 60000, b: 40000 } },
    })
    expect(splits).toEqual([
      { userId: 'a', shareAmount: 60000 },
      { userId: 'b', shareAmount: 40000 },
    ])
  })

  it('returns an empty array for no amounts', () => {
    expect(calculateSplits({ totalAmount: 0, payeeIds: members, config: { method: 'custom', amounts: {} } })).toEqual(
      [],
    )
  })
})
