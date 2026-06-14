// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Button, buttonVariants } from '.'

describe('Button (shadcn-style)', () => {
  it('does not duplicate the consumer class and merges over the variant', () => {
    const w = mount(Button, { props: { variant: 'outline', class: 'rounded-pill open-btn' } })
    const cls = w.attributes('class') ?? ''
    // consumer class appears exactly once (no double fallthrough)
    expect(cls.match(/\bopen-btn\b/g)?.length).toBe(1)
    // tailwind-merge: consumer rounded-pill wins over the variant's rounded-md
    expect(cls).toContain('rounded-pill')
    expect(cls).not.toContain('rounded-md')
  })

  it('emits data attributes and native type/disabled', () => {
    const w = mount(Button, { props: { variant: 'default', size: 'icon', disabled: true } })
    expect(w.attributes('data-slot')).toBe('button')
    expect(w.attributes('data-variant')).toBe('default')
    expect(w.attributes('data-size')).toBe('icon')
    expect(w.attributes('type')).toBe('button')
    expect(w.attributes('disabled')).toBeDefined()
  })

  it('buttonVariants is exported and returns token classes', () => {
    expect(buttonVariants({ variant: 'destructive' })).toContain('bg-danger-main')
  })
})
