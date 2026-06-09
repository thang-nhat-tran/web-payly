import { describe, it, expect, vi } from 'vitest'
import { Subscribable } from './subscribable'

// Concrete subclass to exercise the protected notify/onSubscribe/onUnsubscribe hooks.
class Emitter extends Subscribable<(value: number) => void> {
  onSubscribeCalls = 0
  onUnsubscribeCalls = 0

  emit(value: number): void {
    this.notify(value)
  }

  protected onSubscribe(): void {
    this.onSubscribeCalls++
  }

  protected onUnsubscribe(): void {
    this.onUnsubscribeCalls++
  }
}

describe('Subscribable', () => {
  it('notifies every subscribed listener with the emitted args', () => {
    const emitter = new Emitter()
    const a = vi.fn()
    const b = vi.fn()
    emitter.subscribe(a)
    emitter.subscribe(b)

    emitter.emit(7)

    expect(a).toHaveBeenCalledWith(7)
    expect(b).toHaveBeenCalledWith(7)
  })

  it('stops notifying a listener after its unsubscribe is called', () => {
    const emitter = new Emitter()
    const listener = vi.fn()
    const unsubscribe = emitter.subscribe(listener)

    emitter.emit(1)
    unsubscribe()
    emitter.emit(2)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(1)
  })

  it('deduplicates the same listener reference', () => {
    const emitter = new Emitter()
    const listener = vi.fn()
    emitter.subscribe(listener)
    emitter.subscribe(listener)

    emitter.emit(1)

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('reports whether it currently has listeners', () => {
    const emitter = new Emitter()
    expect(emitter.hasListeners()).toBe(false)

    const unsubscribe = emitter.subscribe(vi.fn())
    expect(emitter.hasListeners()).toBe(true)

    unsubscribe()
    expect(emitter.hasListeners()).toBe(false)
  })

  it('fires the onSubscribe / onUnsubscribe hooks on each subscribe and unsubscribe', () => {
    const emitter = new Emitter()
    const unsubscribe = emitter.subscribe(vi.fn())
    expect(emitter.onSubscribeCalls).toBe(1)
    expect(emitter.onUnsubscribeCalls).toBe(0)

    unsubscribe()
    expect(emitter.onUnsubscribeCalls).toBe(1)
  })
})
