<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useGroupList } from '@/modules/group/composables/useGroupList'
import AppHeader from '@/shared/components/app/AppHeader.vue'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import GroupCard from '@/modules/group/components/group-card/GroupCard.vue'
import GroupCardSkeleton from '@/modules/group/components/group-card/GroupCardSkeleton.vue'
import GroupCreateModal from '@/modules/group/components/group-create-modal/GroupCreateModal.vue'
import AppFab from '@/shared/components/app/AppFab.vue'
import { HousePlus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { Group } from '@/modules/group/types/group.types'
import { GROUP_MESSAGES } from '@/modules/group/components/group-detail/group-detail.constants'

const router = useRouter()
const auth = useAuthStore()
const groups = useGroupList()
const showCreateModal = ref(false)

function handleCreateSuccess(group: Group) {
  showCreateModal.value = false
  groups.query()
  toast.success(GROUP_MESSAGES.CREATE_SUCCESS, { description: group.name })
}

function handleCreateError(error: Error) {
  toast.error('Có lỗi xảy ra khi tạo nhóm', { description: error.message })
}

onMounted(() => {
  groups.query()
})
</script>

<template>
  <div class="min-h-screen">
    <AppHeader class="px-sm">
      <template #left>
        <h3>Nhóm chi tiêu</h3>
      </template>

      <template #right>
        <button class="rounded-full" aria-label="Trang cá nhân" @click="router.push('/profile')">
          <UserAvatar
            :src="auth.profile?.avatarUrl ?? auth.user?.user_metadata?.avatar_url"
            :name="auth.profile?.fullName ?? auth.user?.email"
            size="sm"
          />
        </button>
      </template>
    </AppHeader>

    <main class="mx-auto px-sm py-md">
      <div class="groups-grid">
        <template v-if="groups.isPending.value">
          <GroupCardSkeleton v-for="i in 6" :key="i" />
        </template>
        <template v-else>
          <GroupCard
            v-for="group in groups.data.value"
            :key="group.id"
            :group="group"
            @open="router.push(`/groups/${group.id}`)"
          />
        </template>
      </div>
    </main>

    <AppFab :icon="HousePlus" aria-label="Tạo nhóm mới" @click="showCreateModal = true" />

    <GroupCreateModal
      :open="showCreateModal"
      @close="showCreateModal = false"
      @success="handleCreateSuccess"
      @error="handleCreateError"
    />
  </div>
</template>

<style scoped>
.groups-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

@media (min-width: 768px) {
  .groups-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .groups-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
