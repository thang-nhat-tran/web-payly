import { describe, it, expect } from 'vitest'
import { formatDate } from './datetime.util'

// Build the reference instant from LOCAL components: formatDate also formats in
// the runtime's local timezone, so the two cancel out and assertions stay
// deterministic regardless of the CI machine's timezone. (2026-05-10 18:30 local)
const localInstant = new Date(2026, 4, 10, 18, 30)

describe('formatDate', () => {
  it('defaults to the longDate style in vi-VN', () => {
    expect(formatDate(localInstant)).toBe('10 tháng 5, 2026')
  })

  it('formats each supported style', () => {
    expect(formatDate(localInstant, 'vi-VN', 'shortDate')).toBe('10/05/2026')
    expect(formatDate(localInstant, 'vi-VN', 'mediumDate')).toBe('10 thg 5, 2026')
    expect(formatDate(localInstant, 'vi-VN', 'longDate')).toBe('10 tháng 5, 2026')
    expect(formatDate(localInstant, 'vi-VN', 'dateTime')).toBe('lúc 18:30 10 tháng 5, 2026')
    expect(formatDate(localInstant, 'vi-VN', 'time')).toBe('18:30')
  })

  it('accepts a timestamp (number)', () => {
    expect(formatDate(localInstant.getTime())).toBe('10 tháng 5, 2026')
  })

  it('accepts an ISO string with an explicit local time', () => {
    // A mid-day time avoids the date rolling over across timezone offsets.
    expect(formatDate('2026-05-10T12:00:00')).toBe('10 tháng 5, 2026')
  })

  it('pads single-digit day and month in shortDate', () => {
    expect(formatDate(new Date(2026, 0, 5, 9, 5), 'vi-VN', 'shortDate')).toBe('05/01/2026')
  })

  it('reuses one Intl.DateTimeFormat instance per style (cached)', () => {
    // Calling repeatedly with the same style must stay stable (exercises the cache path).
    const a = formatDate(localInstant, 'vi-VN', 'time')
    const b = formatDate(localInstant, 'vi-VN', 'time')
    expect(a).toBe(b)
  })
})
