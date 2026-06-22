import { computed, ref } from 'vue'

type MutationFunction<TData, TPayload> = (payload: TPayload) => Promise<TData>
export type MutationStatus = 'idle' | 'pending' | 'error' | 'success'

type SuccessListener<TData, TPayload> = (data: TData, payload: TPayload) => void
type ErrorListener<TError, TPayload> = (error: TError, payload: TPayload) => void

interface MutationOptions<TData, TPayload, TError = Error> {
  mutationFn: MutationFunction<TData, TPayload>
  onSuccess?: SuccessListener<TData, TPayload>
  onError?: ErrorListener<TError, TPayload>
}

export function useMutation<TData, TPayload, TError = Error>(options: MutationOptions<TData, TPayload, TError>) {
  const data = ref<TData | null>(null)
  const error = ref<TError | null>(null)
  const status = ref<MutationStatus>('idle')

  const isPending = computed(() => status.value === 'pending')
  const isSuccess = computed(() => status.value === 'success')
  const isError = computed(() => status.value === 'error')

  // Listeners registered via the returned onSuccess/onError; fired on every completion.
  const successListeners = new Set<SuccessListener<TData, TPayload>>()
  const errorListeners = new Set<ErrorListener<TError, TPayload>>()

  async function mutate(payload: TPayload) {
    status.value = 'pending'
    error.value = null

    try {
      const result = await options.mutationFn(payload)
      data.value = result
      status.value = 'success'
      options.onSuccess?.(result, payload)
      successListeners.forEach((listener) => listener(result, payload))
      return result
    } catch (err) {
      const normalized = (err instanceof Error ? err : new Error(String(err))) as TError
      error.value = normalized
      status.value = 'error'
      options.onError?.(normalized, payload)
      errorListeners.forEach((listener) => listener(normalized, payload))
    }
  }

  /** Subscribe to successful mutations; returns an unsubscribe function. */
  function onSuccess(listener: SuccessListener<TData, TPayload>) {
    successListeners.add(listener)
    return () => successListeners.delete(listener)
  }

  /** Subscribe to failed mutations; returns an unsubscribe function. */
  function onError(listener: ErrorListener<TError, TPayload>) {
    errorListeners.add(listener)
    return () => errorListeners.delete(listener)
  }

  return { data, error, status, isPending, isError, isSuccess, mutate, onSuccess, onError }
}
