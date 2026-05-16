<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import GroupDetailHeader from '@/features/group/components/GroupDetailHeader.vue'
import GroupDetailTabs from '@/features/group/components/GroupDetailTabs.vue'
import UserAvatar from '@/shared/components/user-profile/UserAvatar.vue'
import { Plus } from 'lucide-vue-next'
import type { DetailTab } from '@/features/group/types/group.types'

const router = useRouter()
const auth = useAuthStore()

const activeTab = ref<DetailTab>('bills')

// TODO: replace with useGroupDetail composable
const group = {
  name: 'Saigon Gateway',
  subtitle: 'Chưa có thành viên · Đã tạo 3 ngày trước',
  coverUrl: '',
  pendingAmount: 0,
  totalAmount: 0,
}
</script>

<template>
  <div class="page">
    <GroupDetailHeader
      :name="group.name"
      :subtitle="group.subtitle"
      :cover-url="group.coverUrl"
      @back="router.back()"
    />

    <div class="body">
      <GroupDetailTabs :active="activeTab" @select="activeTab = $event" />

      <div class="tab-content">
        <template v-if="activeTab === 'bills'">
          <div class="empty-state">
            <p class="empty-text">Bạn chưa có hóa đơn nào!</p>
          </div>
        </template>

        <template v-else-if="activeTab === 'members'">
          <div class="empty-state">
            <p class="empty-text">Chưa có thành viên nào.</p>
          </div>
        </template>

        <template v-else>
          <div class="empty-state">
            <p class="empty-text">Chưa có kết toán nào.</p>
          </div>
        </template>
      </div>
    </div>

    <div class="fabs">
      <UserAvatar
        :src="auth.user?.user_metadata?.avatar_url"
        :name="auth.user?.email"
        size="lg"
        class="fab-avatar"
      />
      <button class="fab" aria-label="Thêm hóa đơn">
        <Plus :size="22" :stroke-width="2" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100svh;
  background-color: var(--color-canvas);
  display: flex;
  flex-direction: column;
}

.body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tab-content {
  flex: 1;
  padding: var(--spacing-2);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-7) var(--spacing-3);
}

.empty-text {
  font-size: var(--text-base);
  color: var(--color-slate);
}

.fabs {
  position: fixed;
  bottom: var(--spacing-4);
  right: var(--spacing-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
}

.fab-avatar {
  cursor: pointer;
  box-shadow: var(--shadow-card);
}

.fab {
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
