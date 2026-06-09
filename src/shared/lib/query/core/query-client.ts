import { QueryCache } from './query-cache'
import type { QueryKey, QueryOptions, QueryState } from './query.type'

export class QueryClient {
  private queryCache: QueryCache
  constructor() {
    this.queryCache = new QueryCache()
  }

  async fetchQuery<TData, TError = Error>(options: QueryOptions<TData>): Promise<TData> {
    const key = hashQueryKey(options.queryKey)
    const cached = this.queryCache.get<TData, TError>(key)
    if (cached) {
      if (cached.status === 'success' && cached.data !== undefined) {
        return cached.data
      } else if (cached.status === 'error' && cached.error !== undefined) {
        throw cached.error
      }
    }

    this.queryCache.set<TData, TError>(key, { status: 'pending' })
    try {
      const data = await options.queryFn()
      this.queryCache.set<TData, TError>(key, { status: 'success', data })
      return data
    } catch (error) {
      this.queryCache.set<TData, TError>(key, { status: 'error', error: error as TError })
      throw error
    }
  }

  invalidateQuery(queryKey: QueryKey): void {
    this.queryCache.invalidate(hashQueryKey(queryKey))
  }

  getQueryState<TData, TError = Error>(queryKey: QueryKey): QueryState<TData, TError> | undefined {
    return this.queryCache.get<TData, TError>(hashQueryKey(queryKey))
  }

  getQueryCache(): QueryCache {
    return this.queryCache
  }
}

export function hashQueryKey(queryKey: QueryKey): string {
  return JSON.stringify(queryKey)
}
