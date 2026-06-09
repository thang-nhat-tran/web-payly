import { inject, provide, type InjectionKey } from 'vue'
import type { QueryClient } from '../core/query-client'

const QueryClientKey: InjectionKey<QueryClient> = Symbol('QueryClient')

export function provideQueryClient(client: QueryClient) {
  provide(QueryClientKey, client)
}

export function useQueryClient(): QueryClient {
  const client = inject(QueryClientKey)
  if (!client) {
    throw new Error('No QueryClient provided. Make sure to call provideQueryClient() in your app setup.')
  }
  return client
}
