<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts" generic="T">
import type { HTMLAttributes } from 'vue'
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from '@/shared/components/ui/modal'
import { Button } from '@/shared/components/ui/button'

/**
 * A modal with a selectable list. `v-model` is always an array of keys:
 * - single mode (default): tapping selects one and closes immediately
 * - multi mode (`multiple`): tapping toggles; a "Xong" button confirms
 *
 * Each row's content is provided via the `#item` slot.
 */
const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    items: T[]
    itemKey: (item: T) => string
    multiple?: boolean
    lockedKeys?: string[]
    class?: HTMLAttributes['class']
  }>(),
  { multiple: false },
)

const selected = defineModel<string[]>({ required: true })
const emit = defineEmits<{ close: [] }>()

const isSelected = (key: string) => selected.value.includes(key)
const isLocked = (key: string) => props.lockedKeys?.includes(key) ?? false

function onSelect(item: T) {
  const key = props.itemKey(item)
  if (isLocked(key)) return

  if (props.multiple) {
    console.log('item', item)
    console.log('isSelected', isSelected(key))
    console.log('b selected', selected.value)
    if (isSelected(key)) selected.value = selected.value.filter((k) => k !== key)
    else selected.value = [...selected.value, key]
    console.log('a selected', selected.value)
  } else {
    selected.value = [key]
    emit('close')
  }
}
</script>

<template>
  <Modal :open="open" :class="props.class" @close="emit('close')">
    <ModalHeader>
      <ModalTitle>{{ title }}</ModalTitle>
      <ModalClose />
    </ModalHeader>

    <ModalBody class="flex flex-col gap-1 pb-md">
      <button
        v-for="item in items"
        :key="itemKey(item)"
        type="button"
        class="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition-colors"
        :class="isSelected(itemKey(item)) ? 'bg-green-50' : 'hover:bg-bg-soft'"
        @click="onSelect(item)"
      >
        <span class="flex min-w-0 flex-1 items-center">
          <slot name="item" :item="item" :selected="isSelected(itemKey(item))" />
        </span>

        <span
          class="h-5 w-5 shrink-0 rounded-round border-2"
          :class="isSelected(itemKey(item)) ? 'border-green-600 bg-green-600' : 'border-text-disabled'"
        />
      </button>
    </ModalBody>

    <ModalFooter v-if="multiple">
      <Button class="w-full" @click="emit('close')">Xong</Button>
    </ModalFooter>
  </Modal>
</template>
