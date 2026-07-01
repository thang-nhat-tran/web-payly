<script setup lang="ts">
import { HouseIcon } from 'lucide-vue-next'
import { Card, CardDescription, CardContent } from '@/shared/components/ui/card'
import AvatarStack from '@/shared/components/ui/AvatarStack.vue'
import type { GroupWithStats } from '@/modules/group/types/group.types'
import Typography from '@/shared/components/ui/typography/Typography.vue'

defineProps<{ group: GroupWithStats }>()
const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <Card clickable @click="emit('open')">
    <CardContent class="p-8">
      <div class="flex items-center gap-4">
        <div class="bg-bg-base p-6 rounded-md">
          <HouseIcon :size="24" :stroke-width="2" />
        </div>
        <div>
          <Typography size="md" weight="semibold">{{ group.name }}</Typography>
          <AvatarStack :avatar-urls="group.memberAvatarUrls" size="xs" />
        </div>
      </div>
      <CardDescription v-if="group.description">{{ group.description }}</CardDescription>
    </CardContent>
  </Card>
</template>

<style scoped>
.amount-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.amount-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-round);
  background-color: var(--color-bg-base);
  color: var(--color-text-main);
  flex-shrink: 0;
}

.amount {
  font-size: var(--text-md);
  font-weight: 500;
  letter-spacing: var(--tracking-normal);
  color: var(--color-text-main);
  line-height: 1.2;
}

.amount-label {
  font-size: var(--text-xs);
  font-weight: 450;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.icon-members {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.meta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-left: var(--spacing-xs);
}

.open-btn {
  margin-left: auto;
}
</style>
