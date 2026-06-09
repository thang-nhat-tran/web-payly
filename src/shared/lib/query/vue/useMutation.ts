import { computed, ref } from 'vue'

type MutationFunction<TData, TPayload> = (payload: TPayload) => Promise<TData>
export type MutationStatus = 'idle' | 'pending' | 'error' | 'success'

interface MutationOptions<TData, TPayload, TError = Error> {
  mutationFn: MutationFunction<TData, TPayload>
  onSuccess?: (data: TData) => void
  onError?: (error: TError) => void
}

export function useMutation<TData, TPayload, TError = Error>(options: MutationOptions<TData, TPayload, TError>) {
  const data = ref<TData | null>(null)
  const error = ref<TError | null>(null)
  const status = ref<MutationStatus>('idle')

  const isPending = computed(() => status.value === 'pending')
  const isSuccess = computed(() => status.value === 'success')
  const isError = computed(() => status.value === 'error')

  async function mutate(payload: TPayload) {
    status.value = 'pending'
    error.value = null

    try {
      data.value = await options.mutationFn(payload)
      status.value = 'success'
      if (options.onSuccess) {
        options.onSuccess(data.value)
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      status.value = 'error'
      if (options.onError) {
        options.onError(error.value)
      }
    }
  }

  function onSuccess(callback: (data: TData) => void) {
    if (isSuccess.value && data.value !== null) {
      callback(data.value)
    }
  }

  function onError(callback: (error: TError) => void) {
    if (isError.value && error.value !== null) {
      callback(error.value)
    }
  }

  return { data, error, status, isPending, isError, isSuccess, mutate, onSuccess, onError }
}
