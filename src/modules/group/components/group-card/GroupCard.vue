<script setup lang="ts">
import { Wallet } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card'
import Button from '@/shared/components/ui/Button.vue'
import MemberAvatarStack from '@/modules/group-member/components/MemberAvatarStack.vue'
import type { GroupWithStats } from '@/modules/group/types/group.types'
import { formatVNDtoK } from '@/shared/utils/currency.util'

defineProps<{ group: GroupWithStats }>()
const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <Card clickable @click="emit('open')">
    <CardHeader>
      <CardTitle>{{ group.name }}</CardTitle>
      <CardDescription v-if="group.description">{{ group.description }}</CardDescription>
    </CardHeader>

    <CardContent>
      <div class="amount-row">
        <div class="amount-icon">
          <Wallet :size="18" :stroke-width="1.5" />
        </div>
        <div>
          <p class="amount">{{ formatVNDtoK(group.totalAmount) }}</p>
          <p class="amount-label">Tổng chi tiêu</p>
        </div>
      </div>
    </CardContent>

    <CardFooter class="border-t border-gray-300">
      <MemberAvatarStack :avatar-urls="group.memberAvatarUrls" />
      <Button size="sm" class="open-btn" @click.stop="emit('open')">Mở →</Button>
    </CardFooter>
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
