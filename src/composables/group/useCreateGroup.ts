import { ref } from 'vue'
import { groupApi } from '@/api/groupApi'
import type { Group } from '@/types/groupType'

export function useCreateGroup() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function createGroup(payload: Pick<Group, 'name' | 'description' | 'created_by'>) {
    loading.value = true
    error.value = null

    const { data, error: err } = await groupApi.createGroup(payload)

    loading.value = false

    if (err) {
      error.value = err.message
      return null
    }

    return data as Group
  }

  return { loading, error, createGroup }
}
