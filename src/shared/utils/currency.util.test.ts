import { describe, it, expect } from 'vitest'
import { formatMoney, formatVNDtoK } from './currency.util'

// ICU separates the amount from the currency symbol with a non-breaking space
// whose exact code point varies by ICU version (U+00A0 vs U+202F). Normalize it
// to a regular space so assertions stay portable across environments.
const norm = (s: string): string => s.replace(/[  ]/g, ' ')

describe('formatMoney', () => {
  it('formats a VND amount with grouping and symbol by default', () => {
    expect(norm(formatMoney(150000))).toBe('150.000 ₫')
  })

  it('formats zero', () => {
    expect(norm(formatMoney(0))).toBe('0 ₫')
  })

  it('groups large amounts with dots', () => {
    expect(norm(formatMoney(1000000))).toBe('1.000.000 ₫')
  })

  it('keeps the sign for negative amounts', () => {
    expect(norm(formatMoney(-2000))).toBe('-2.000 ₫')
  })

  it('shows at most one decimal digit, rounding when needed', () => {
    expect(norm(formatMoney(1500.5))).toBe('1.500,5 ₫') // single decimal kept
    expect(norm(formatMoney(150000.25))).toBe('150.000,3 ₫') // 0.25 → 0.3
  })

  it('honours an explicit locale and currency argument', () => {
    expect(norm(formatMoney(150000, 'vi-VN', 'VND'))).toBe('150.000 ₫')
  })
})

describe('formatVNDtoK', () => {
  it('returns the raw value as a string when below 1000', () => {
    expect(formatVNDtoK(0)).toBe('0')
    expect(formatVNDtoK(500)).toBe('500')
    expect(formatVNDtoK(999)).toBe('999')
  })

  it('formats whole thousands with a K suffix and no decimal', () => {
    expect(formatVNDtoK(1000)).toBe('1K')
    expect(formatVNDtoK(9000)).toBe('9K')
    expect(formatVNDtoK(15000)).toBe('15K')
    expect(formatVNDtoK(123000)).toBe('123K')
  })

  it('shows a single decimal digit (comma separator) when there is a fraction', () => {
    expect(formatVNDtoK(1500)).toBe('1,5K')
    expect(formatVNDtoK(12345)).toBe('12,3K')
    expect(formatVNDtoK(123456)).toBe('123,5K') // 123.456 → 123.5
  })

  it('rounds to at most one decimal place', () => {
    expect(formatVNDtoK(1234)).toBe('1,2K') // 1.234 → 1.2
    expect(formatVNDtoK(1990)).toBe('2K') // 1.99 → 2.0 → trailing zero dropped
    expect(formatVNDtoK(1950)).toBe('2K') // 1.95 → 2.0
  })

  it('groups thousands with a dot for large values', () => {
    expect(formatVNDtoK(1000000)).toBe('1.000K')
    expect(formatVNDtoK(2500000)).toBe('2.500K')
  })
})
