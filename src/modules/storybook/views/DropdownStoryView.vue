<script setup lang="ts">
import { ref } from 'vue'
import { Pencil, Copy, Trash2 } from 'lucide-vue-next'
import StoryLayout from '../components/StoryLayout.vue'
import StorySection from '../components/StorySection.vue'
import { Dropdown } from '@/shared/components/ui/dropdown'
import type { DropdownOption } from '@/shared/components/ui/dropdown/dropdown.type'
import Button from '@/shared/components/ui/Button.vue'

const basicOpen = ref(false)
const basicSelected = ref<string>()

const iconSelected = ref<string>()

const placementSelected = ref<string>()

const disabledOpen = ref(false)

const options: DropdownOption[] = [
  { key: 'edit', label: 'Edit' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'disabled', label: 'Disabled option', disabled: true },
  { key: 'delete', label: 'Delete' },
]

const iconOptions: DropdownOption[] = [
  { key: 'edit', label: 'Edit', icon: Pencil },
  { key: 'duplicate', label: 'Duplicate', icon: Copy },
  { key: 'delete', label: 'Delete', icon: Trash2 },
]

function logSelect(key: string) {
  console.log('selected', key)
}
</script>

<template>
  <StoryLayout title="Dropdown">
    <StorySection title="Basic">
      <Dropdown v-model:open="basicOpen" v-model:selected-key="basicSelected" :options="options" @select="logSelect">
        <template #trigger>
          <Button variant="outline">{{ basicSelected ? `Selected: ${basicSelected}` : 'Open dropdown' }}</Button>
        </template>
      </Dropdown>
    </StorySection>

    <StorySection title="With icons">
      <Dropdown v-model:selected-key="iconSelected" :options="iconOptions">
        <template #trigger>
          <Button variant="outline">{{ iconSelected ? `Selected: ${iconSelected}` : 'Actions' }}</Button>
        </template>
      </Dropdown>
    </StorySection>

    <StorySection title="Placement">
      <div class="flex flex-wrap items-center gap-lg">
        <Dropdown v-model:selected-key="placementSelected" size="sm" placement="bottom-start" :options="options">
          <template #trigger>
            <Button variant="outline" size="sm">bottom-start</Button>
          </template>
        </Dropdown>

        <Dropdown v-model:selected-key="placementSelected" placement="bottom-end" :options="options">
          <template #trigger>
            <Button variant="outline" size="sm">bottom-end</Button>
          </template>
        </Dropdown>

        <Dropdown v-model:selected-key="placementSelected" placement="top-start" :options="options">
          <template #trigger>
            <Button variant="outline" size="sm">top-start</Button>
          </template>
        </Dropdown>

        <Dropdown v-model:selected-key="placementSelected" placement="top-end" :options="options">
          <template #trigger>
            <Button variant="outline" size="sm">top-end</Button>
          </template>
        </Dropdown>
      </div>
    </StorySection>

    <StorySection title="Disabled">
      <Dropdown v-model:open="disabledOpen" disabled :options="options">
        <template #trigger>
          <Button variant="outline" disabled>Disabled trigger</Button>
        </template>
      </Dropdown>
    </StorySection>
  </StoryLayout>
</template>
