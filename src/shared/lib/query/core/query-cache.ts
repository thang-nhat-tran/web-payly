import type { QueryState } from './query.type'
import { Subscribable } from './subscribable'

type QueryCacheListener = (key: string) => void

export class QueryCache extends Subscribable<QueryCacheListener> {
  private cache = new Map<string, QueryState<unknown, unknown>>()

  get<TData, TError>(key: string): QueryState<TData, TError> | undefined {
    return this.cache.get(key) as QueryState<TData, TError> | undefined
  }

  set<TData, TError>(key: string, state: QueryState<TData, TError>): void {
    this.cache.set(key, state)
    this.notify(key)
  }

  invalidate(key: string): void {
    this.cache.delete(key)
    this.notify(key)
  }
}
