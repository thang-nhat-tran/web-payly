import { describe, it, expect } from 'vitest'
import { formatNumber } from './number.util'

describe('formatNumber', () => {
  it('groups thousands with a dot (vi-VN) by default', () => {
    expect(formatNumber(150000)).toBe('150.000')
    expect(formatNumber(1234567)).toBe('1.234.567')
  })

  it('leaves sub-thousand and zero values ungrouped', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(999)).toBe('999')
  })

  it('keeps the decimal part with a comma separator', () => {
    expect(formatNumber(1234.5)).toBe('1.234,5')
  })
})
