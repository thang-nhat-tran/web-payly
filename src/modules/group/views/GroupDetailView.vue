<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGroupDetail } from '@/modules/group/composables/useGroupDetail'
import GroupDetailHeader from '@/modules/group/components/group-detail/GroupDetailHeader.vue'
import GroupDetailTabs from '@/modules/group/components/group-detail/GroupDetailTabs.vue'
import GroupDetailSkeleton from '@/modules/group/components/group-detail/GroupDetailSkeleton.vue'
import AppFab from '@/shared/components/app/AppFab.vue'
import ExpenseList from '@/modules/expense/components/ExpenseList.vue'
import DebtList from '@/modules/expense/components/DebtList.vue'
import { Receipt } from 'lucide-vue-next'
import { type GroupDetailTab } from '@/modules/group/components/group-detail/group-detail.constants'
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

const goToCreateExpense = () => {
  router.push(`/groups/${route.params.id}/expenses/new`)
}

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
        <ExpenseList v-if="activeTab === 'expenses'" :group-id="group.id" />
        <DebtList v-else :group-id="group.id" />
      </div>
    </div>
  </div>

  <AppFab v-if="group && activeTab === 'expenses'" :icon="Receipt" @click="goToCreateExpense" />
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
</style>
