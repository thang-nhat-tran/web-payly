<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGroupDetail } from '@/modules/group/composables/useGroupDetail'
import GroupDetailHeader from '@/modules/group/components/group-detail/GroupDetailHeader.vue'
import GroupDetailTabs from '@/modules/group/components/group-detail/GroupDetailTabs.vue'
import GroupDetailSkeleton from '@/modules/group/components/group-detail/GroupDetailSkeleton.vue'
import AppFab from '@/shared/components/app/AppFab.vue'
import ExpenseSplitList from '@/modules/expense/components/ExpenseSplitList.vue'
import { Receipt } from 'lucide-vue-next'
import { TAB_EMPTY_MESSAGE, type GroupDetailTab } from '@/modules/group/components/group-detail/group.constants'
import GroupMemberModal from '@/modules/group-member/components/group-member-modal/GroupMemberModal.vue'
const router = useRouter()
const route = useRoute()
const groupDetail = useGroupDetail(route.params.id as string)
const group = computed(() => groupDetail.data.value)

const activeTab = ref<GroupDetailTab>('expenses')
const handleTabSelect = (tab: GroupDetailTab) => {
  activeTab.value = tab
}

const handleBack = () => {
  router.push('/groups')
}

const showGroupMemberModal = ref(false)
onMounted(() => {
  groupDetail.query()
})
</script>

<template>
  <GroupMemberModal
    v-if="group"
    :open="showGroupMemberModal"
    :group-id="group.id"
    :invite-token="group.inviteToken"
    @close="showGroupMemberModal = false"
  />
  <GroupDetailSkeleton v-if="groupDetail.isPending.value || !group" />

  <div v-else-if="groupDetail.data.value" class="page">
    <GroupDetailHeader
      :name="group.name"
      :subtitle="group.description"
      :cover-url="group.coverImageUrl"
      @back="handleBack"
      @selectMembers="showGroupMemberModal = true"
    />

    <div class="body">
      <GroupDetailTabs :active="activeTab" @select="handleTabSelect" />

      <div class="tab-content">
        <ExpenseSplitList v-if="activeTab === 'expenses'" @pay="() => {}" @detail="() => {}" />
        <div v-else class="empty-state">
          <p class="empty-text">{{ TAB_EMPTY_MESSAGE[activeTab] }}</p>
        </div>
      </div>
    </div>
  </div>

  <AppFab v-if="group && activeTab === 'expenses'" :icon="Receipt" @click="() => {}" />
</template>

<style scoped>
.page {
  min-height: 100svh;
  background-color: var(--color-bg-base);
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
  padding: var(--spacing-3xl) var(--spacing-md);
}

.empty-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
</style>
