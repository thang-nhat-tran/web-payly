type Listener = (...args: never[]) => void

export class Subscribable<TListener extends Listener> {
  protected listeners = new Set<TListener>()

  subscribe(listener: TListener): () => void {
    this.listeners.add(listener)
    this.onSubscribe()
    return () => {
      this.listeners.delete(listener)
      this.onUnsubscribe()
    }
  }

  hasListeners(): boolean {
    return this.listeners.size > 0
  }

  protected notify(...args: Parameters<TListener>): void {
    for (const listener of this.listeners) {
      listener(...args)
    }
  }

  /** Called after a listener is added. Override to lazily wire up upstream sources. */
  protected onSubscribe(): void {}

  /** Called after a listener is removed. Override to tear down upstream sources. */
  protected onUnsubscribe(): void {}
}
