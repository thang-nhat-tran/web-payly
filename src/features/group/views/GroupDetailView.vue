<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGroupDetail } from '@/features/group/composables/useGroupDetail'
import GroupDetailHeader from '@/features/group/components/GroupDetailHeader.vue'
import GroupDetailTabs from '@/features/group/components/GroupDetailTabs.vue'
import GroupDetailSkeleton from '@/features/group/components/GroupDetailSkeleton.vue'
import AppFab from '@/shared/components/app/AppFab.vue'
import { Receipt } from 'lucide-vue-next'
import {
  TAB_EMPTY_MESSAGE,
  type GroupDetailTab,
} from '@/features/group/types/group.types'

const router = useRouter()
const route = useRoute()
const groupDetail = useGroupDetail()

const activeTab = ref<GroupDetailTab>('expenses')
const handleTabSelect = (tab: GroupDetailTab) => {
  activeTab.value = tab
}

const group = computed(() => groupDetail.data.value)

onMounted(() => {
  groupDetail.query(route.params.id as string)
})
</script>

<template>
  <GroupDetailSkeleton v-if="groupDetail.isPending.value || !group" />

  <div v-else-if="groupDetail.data.value" class="page">
    <GroupDetailHeader
      :name="group.name"
      :subtitle="group.description"
      :cover-url="group.coverImageUrl"
      @back="router.back()"
    />

    <div class="body">
      <GroupDetailTabs :active="activeTab" @select="handleTabSelect" />

      <div class="tab-content">
        <div class="empty-state">
          <p class="empty-text">{{ TAB_EMPTY_MESSAGE[activeTab] }}</p>
        </div>
      </div>
    </div>
  </div>

  <AppFab
    v-if="group && activeTab === 'expenses'"
    :icon="Receipt"
    @click="() => {}"
  />
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
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-grow: 1;
  padding: var(--spacing-7) var(--spacing-3);
}

.empty-text {
  font-size: var(--text-base);
  color: var(--color-slate);
}
</style>
