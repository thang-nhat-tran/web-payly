<script setup lang="ts">
import { computed } from 'vue'
import { ListFilter } from 'lucide-vue-next'
import { Dropdown } from '@/shared/components/ui/dropdown'
import type { DropdownOption } from '@/shared/components/ui/dropdown/dropdown.type'
import Button from '@/shared/components/ui/Button.vue'
import type { GroupMember } from '@/modules/group-member/types/group-member.type'

const props = defineProps<{ members: GroupMember[] }>()
const selectedMemberId = defineModel<string | undefined>('selectedMemberId')

const ALL_KEY = 'all'
const ALL_LABEL = 'Tất cả thành viên'

const options = computed<DropdownOption[]>(() => [
  { key: ALL_KEY, label: ALL_LABEL },
  ...props.members.map((member) => ({ key: member.id, label: member.name })),
])

const dropdownKey = computed<string>({
  get: () => selectedMemberId.value ?? ALL_KEY,
  set: (key) => {
    selectedMemberId.value = key === ALL_KEY ? undefined : key
  },
})

const triggerLabel = computed(
  () => props.members.find((member) => member.id === selectedMemberId.value)?.name ?? ALL_LABEL,
)
</script>

<template>
  <Dropdown v-model:selected-key="dropdownKey" :options="options" placement="bottom-end" size="sm">
    <template #trigger>
      <Button variant="outline" size="sm">
        <ListFilter :size="16" />
        {{ triggerLabel }}
      </Button>
    </template>
  </Dropdown>
</template>
