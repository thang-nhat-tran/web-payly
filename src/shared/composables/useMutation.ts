import { computed, ref } from 'vue'

interface MutationOptions<TData, TPayload> {
  mutationFn: (payload: TPayload) => Promise<TData>
}

export function useMutation<TData, TPayload>(
  options: MutationOptions<TData, TPayload>,
) {
  const isPending = ref(false)
  const isError = computed(() => error.value !== null)
  const isSuccess = ref(false)
  const error = ref<Error | null>(null)
  const data = ref<TData | null>(null)

  async function mutateFn(payload: TPayload) {
    isPending.value = true
    error.value = null
    isSuccess.value = false

    try {
      data.value = await options.mutationFn(payload)
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

  return { isPending, isError, isSuccess, error, data, mutate: mutateFn }
}
