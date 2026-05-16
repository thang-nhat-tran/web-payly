<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useListGroup } from '@/features/group/composables/useListGroup'
import { useCreateGroup } from '@/features/group/composables/useCreateGroup'
import AppHeader from '@/shared/components/app/AppHeader.vue'
import UserAvatar from '@/shared/components/user-profile/UserAvatar.vue'
import GroupCard from '@/features/group/components/GroupCard.vue'
import GroupCardSkeleton from '@/features/group/components/GroupCardSkeleton.vue'
import CreateGroupModal from '@/features/group/components/CreateGroupModal.vue'
import { Plus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { CreateGroupForm } from '@/features/group/schemas/create-group.schema'
import { GROUP_MESSAGES } from '@/features/group/constants/group-message.constant'
const auth = useAuthStore()
const groups = useListGroup()
const createGroup = useCreateGroup()
const showCreateModal = ref(false)

function refresh() {
  if (auth.user?.id) groups.query(auth.user.id)
}

async function handleCreateSubmit({ name, description }: CreateGroupForm) {
  await createGroup.mutate({ name, description, createdBy: auth.user!.id })
  if (createGroup.isSuccess.value) {
    showCreateModal.value = false
    refresh()
    toast.success(GROUP_MESSAGES.CREATE_SUCCESS, {
      description: createGroup.data.value?.name,
    })
  }
  if (createGroup.isError.value) {
    toast.error(GROUP_MESSAGES.CREATE_ERROR, {
      description: 'Vui lòng thử lại.',
    })
  }
}

onMounted(() => {
  refresh()
})
</script>

<template>
  <div class="min-h-screen">
    <AppHeader>
      <template #left>
        <h3>Nhóm chi tiêu</h3>
      </template>

      <template #right>
        <UserAvatar
          :src="auth.user?.user_metadata?.avatar_url"
          :name="auth.user?.email"
          size="lg"
        />
      </template>
    </AppHeader>

    <main class="mx-auto max-w-screen-lg px-3 py-3">
      <div class="groups-grid">
        <template v-if="groups.isPending.value">
          <GroupCardSkeleton v-for="i in 6" :key="i" />
        </template>
        <template v-else>
          <GroupCard
            v-for="group in groups.data.value"
            :key="group.id"
            :group="group"
          />
        </template>
      </div>
    </main>

    <button
      class="fab"
      aria-label="Tạo nhóm mới"
      @click="showCreateModal = true"
    >
      <Plus :size="24" :stroke-width="2" />
    </button>

    <CreateGroupModal
      :open="showCreateModal"
      :loading="createGroup.isPending.value"
      @close="showCreateModal = false"
      @submit="handleCreateSubmit"
    />
  </div>
</template>

<style scoped>
.groups-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-3);
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

.fab {
  position: fixed;
  bottom: var(--spacing-4);
  right: var(--spacing-4);
  width: 56px;
  height: 56px;
  border-radius: var(--radius-circle);
  background-color: var(--color-ink);
  color: var(--color-canvas);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition:
    transform 0.15s var(--ease-standard),
    opacity 0.15s var(--ease-standard);
}

.fab:hover {
  opacity: 0.88;
  transform: scale(1.06);
}
.fab:active {
  transform: scale(0.95);
}
</style>
