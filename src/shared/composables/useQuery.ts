import { ref, computed } from 'vue'

interface QueryOptions<TData, TQuery = void> {
  queryFn: (query: TQuery) => Promise<TData>
}

export function useQuery<TData, TQuery>(options: QueryOptions<TData, TQuery>) {
  const data = ref<TData | null>(null)
  const error = ref<Error | null>(null)
  const isPending = ref(false)
  const isSuccess = ref(false)
  const isError = computed(() => error.value !== null)

  async function queryFn(query: TQuery) {
    isPending.value = true
    error.value = null
    isSuccess.value = false

    try {
      data.value = await options.queryFn(query)
      isSuccess.value = true
    } catch (err) {
      if (err instanceof Error) {
        error.value = err
      } else {
        error.value = new Error(String(err))
      }
    } finally {
      isPending.value = false
    }
  }

  return { data, error, isPending, isSuccess, isError, query: queryFn }
}
