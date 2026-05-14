<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useListGroup } from '@/composables/group/useListGroup'
import AppHeader from '@/components/app/AppHeader.vue'
import UserAvatar from '@/components/user-profile/UserAvatar.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import GroupCardSkeleton from '@/components/group/GroupCardSkeleton.vue'

const auth = useAuthStore()
const { groups, loading, fetchGroups } = useListGroup()

onMounted(() => {
  if (auth.user?.id) fetchGroups(auth.user.id)
})
</script>

<template>
  <div class="min-h-screen">
    <AppHeader>
      <template #left>
        <h3>Nhóm chi tiêu</h3>
      </template>

      <template #right>
        <UserAvatar :src="auth.user?.user_metadata?.avatar_url" :name="auth.user?.email" size="lg" />
      </template>
    </AppHeader>

    <main class="mx-auto max-w-screen-lg px-3 py-3">
      <div class="groups-grid">
        <template v-if="loading">
          <GroupCardSkeleton v-for="i in 6" :key="i" />
        </template>
        <template v-else>
          <GroupCard v-for="group in groups" :key="group.id" :group="group" />
        </template>
      </div>
    </main>
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
</style>
