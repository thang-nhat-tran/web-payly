import { computed, shallowRef, onScopeDispose } from 'vue'
import { hashQueryKey, type QueryOptions, type QueryState } from '../core'
import { useQueryClient } from './useQueryClient'

export function useQuery<TData, TError = Error>(options: QueryOptions<TData>) {
  const queryClient = useQueryClient()
  const cache = queryClient.getQueryCache()
  const hashedKey = hashQueryKey(options.queryKey)

  const state = shallowRef<QueryState<TData, TError> | undefined>(
    queryClient.getQueryState<TData, TError>(options.queryKey),
  )

  // subscribe to the whole cache, but only react to our own key
  const unsubscribe = cache.subscribe((key) => {
    if (key === hashedKey) {
      state.value = queryClient.getQueryState<TData, TError>(options.queryKey)
    }
  })
  onScopeDispose(unsubscribe)

  const data = computed(() => state.value?.data ?? null)
  const error = computed(() => state.value?.error ?? null)
  const status = computed(() => state.value?.status ?? 'idle')
  const isPending = computed(() => status.value === 'pending')
  const isSuccess = computed(() => status.value === 'success')
  const isError = computed(() => status.value === 'error')

  async function query() {
    await queryClient.fetchQuery(options)
  }

  return { data, error, status, isPending, isSuccess, isError, query }
}
