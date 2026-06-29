import { describe, it, expect } from 'vitest'
import { getFirstWord } from './string.util'

describe('getFirstWord', () => {
  it('returns the first word of a multi-word string', () => {
    expect(getFirstWord('Nguyen Nhat Thang')).toBe('Nguyen')
    expect(getFirstWord('Alice Bob Charlie')).toBe('Alice')
  })

  it('returns the word itself for a single-word string', () => {
    expect(getFirstWord('Alice')).toBe('Alice')
  })

  it('trims leading whitespace before splitting', () => {
    expect(getFirstWord('  Hello World')).toBe('Hello')
  })

  it('returns an empty string for a blank input', () => {
    expect(getFirstWord('')).toBe('')
    expect(getFirstWord('   ')).toBe('')
  })
})
