<script setup lang="ts">
import AppLogo from '@/shared/components/app/AppLogo.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Typography from '@/shared/components/ui/typography/Typography.vue'
import Menu from '@/shared/components/ui/menu/Menu.vue'
import type { GroupMenuKeys } from '../../types/group-menu.type'
import { menuItems } from '../../types/group-menu.type'

const open = defineModel<boolean>('open', { default: false })
const selectedMenuItem = defineModel<GroupMenuKeys>('selectedMenuItem', { default: 'expense' })
</script>

<template>
  <Drawer v-model:open="open" size="small" placement="right" title="Payly">
    <template #header>
      <div class="flex items-center px-6 py-3">
        <AppLogo size="md" />
        <Typography size="md" weight="semibold">Payly</Typography>
      </div>
    </template>
    <Menu
      :items="menuItems"
      class="w-full"
      variant="flat"
      :selectedKeys="[selectedMenuItem]"
      @update:selectedKeys="(keys) => (selectedMenuItem = keys[0] as GroupMenuKeys)"
    />
  </Drawer>
</template>
