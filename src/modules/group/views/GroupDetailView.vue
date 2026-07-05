<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGroupDetail } from '@/modules/group/composables/useGroupDetail'
import GroupDetailHeader from '@/modules/group/components/group-detail/GroupDetailHeader.vue'
import GroupDetailSkeleton from '@/modules/group/components/group-detail/GroupDetailSkeleton.vue'
import AppFab from '@/shared/components/app/AppFab.vue'
import ExpenseList from '@/modules/expense/components/ExpenseList.vue'
import DebtList from '@/modules/expense/components/DebtList.vue'
import { Receipt } from 'lucide-vue-next'
import GroupSidebar from '../components/group-sidebar/GroupSidebar.vue'
import type { GroupMenuKeys } from '../types/group-menu.type.ts'
import GroupMemberView from '@/modules/group-member/views/GroupMemberView.vue'
const router = useRouter()
const route = useRoute()
const groupDetail = useGroupDetail(route.params.id as string)
const group = computed(() => groupDetail.data.value)

const activeTab = ref<GroupMenuKeys>('expense')
const handleTabSelect = (tab: GroupMenuKeys) => {
  sidebarOpen.value = false
  activeTab.value = tab
}

const sidebarOpen = ref(false)

const handleBack = () => {
  router.push('/groups')
}

const goToCreateExpense = () => {
  router.push(`/groups/${route.params.id}/expenses/new`)
}

onMounted(() => {
  groupDetail.query()
})
</script>

<template>
  <GroupDetailSkeleton v-if="groupDetail.isPending.value || !group" />
  <div v-else-if="groupDetail.data.value">
    <GroupDetailHeader
      :name="group.name"
      :subtitle="group.description"
      :cover-url="group.coverImageUrl"
      @back="handleBack"
      @openSidebar="sidebarOpen = true"
    />

    <ExpenseList v-if="activeTab === 'expense'" :group-id="group.id" />
    <DebtList v-else-if="activeTab === 'debt'" :group-id="group.id" />
    <GroupMemberView v-else-if="activeTab === 'member'" :group-id="group.id" />
  </div>
  <GroupSidebar
    v-model:open="sidebarOpen"
    :selected-menu-item="activeTab"
    @update:selected-menu-item="handleTabSelect"
  />
  <AppFab
    v-if="group && activeTab === 'expense'"
    :icon="Receipt"
    @click="goToCreateExpense"
    mask="false"
    maskClosable="false"
  />
</template>
