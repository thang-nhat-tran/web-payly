import { ref } from 'vue'
import { groupApi } from '@/api/groupApi'
import type { Group, GroupWithStats } from '@/types/groupType'

const MOCK_MEMBERS = [
  { name: 'Nguyễn Thị Lan', avatar_url: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=1' },
  { name: 'Trần Văn Minh', avatar_url: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=2' },
  { name: 'Lê Thị Hoa', avatar_url: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=3' },
]

export function useListGroup() {
  const groups = ref<GroupWithStats[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchGroups(userId: string) {
    loading.value = true
    error.value = null

    const { data, error: err } = await groupApi.fetchGroups(userId)

    if (err) {
      error.value = err.message
    } else {
      groups.value = ((data ?? []) as Group[]).map((g) => ({
        ...g,
        members: MOCK_MEMBERS,
        total_amount: 0,
      }))
    }

    loading.value = false
  }

  return { groups, loading, error, fetchGroups }
}
