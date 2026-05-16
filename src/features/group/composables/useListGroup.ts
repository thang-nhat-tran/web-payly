import { groupApi } from '@/features/group/api/group.api'
import type { Group, GroupWithStats } from '@/features/group/types/group.types'
import { useQuery } from '@/shared/composables/useQuery'
import { supabaseCall } from '@/shared/lib/supabase'

const MOCK_MEMBERS = [
  {
    name: 'Nguyễn Thị Lan',
    avatarUrl: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=1',
  },
  {
    name: 'Trần Văn Minh',
    avatarUrl: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=2',
  },
  {
    name: 'Lê Thị Hoa',
    avatarUrl: 'https://img.heroui.chat/image/avatar?w=100&h=100&u=3',
  },
]

export function useListGroup() {
  return useQuery<GroupWithStats[]>({
    queryFn: () =>
      supabaseCall<Group[]>(groupApi.fetchMyGroups()).then((result) =>
        result.map((g) => ({ ...g, members: MOCK_MEMBERS, totalAmount: 0 })),
      ),
  })
}
