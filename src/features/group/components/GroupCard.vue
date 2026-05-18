<script setup lang="ts">
import { computed } from 'vue'
import { Wallet } from 'lucide-vue-next'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/components/ui/card'
import UserAvatar from '@/shared/components/user-profile/UserAvatar.vue'
import type { GroupWithStats } from '@/features/group/types/group.types'

const props = defineProps<{ group: GroupWithStats }>()
const emit = defineEmits<{ open: [] }>()

const MAX_VISIBLE = 4

const visibleMembers = computed(() => props.group.members.slice(0, MAX_VISIBLE))
const extraCount = computed(() =>
  Math.max(0, props.group.members.length - MAX_VISIBLE),
)

function formatAmount(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}
</script>

<template>
  <Card clickable @click="emit('open')">
    <CardHeader>
      <CardTitle>{{ group.name }}</CardTitle>
      <CardDescription v-if="group.description">{{
        group.description
      }}</CardDescription>
    </CardHeader>

    <CardContent>
      <div class="amount-row">
        <div class="amount-icon">
          <Wallet :size="18" :stroke-width="1.5" />
        </div>
        <div>
          <p class="amount">{{ formatAmount(group.totalAmount) }}</p>
          <p class="amount-label">Tổng chi tiêu</p>
        </div>
      </div>
    </CardContent>

    <CardFooter>
      <!-- Stacked member avatars -->
      <div class="avatar-stack">
        <div v-for="(member, i) in visibleMembers" :key="i" class="avatar-ring">
          <UserAvatar :name="member.name" :src="member.avatarUrl" size="xs" />
        </div>
        <div v-if="extraCount > 0" class="avatar-ring avatar-extra">+{{ extraCount }}</div>
      </div>
      <button class="btn-primary open-btn" @click.stop="emit('open')">Mở →</button>
    </CardFooter>
  </Card>
</template>

<style scoped>
.amount-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.amount-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-circle);
  background-color: var(--color-canvas);
  color: var(--color-ink);
  flex-shrink: 0;
}

.amount {
  font-size: var(--text-h3);
  font-weight: 500;
  letter-spacing: var(--tracking-headline);
  color: var(--color-ink);
  line-height: 1.2;
}

.amount-label {
  font-size: var(--text-sm);
  font-weight: 450;
  color: var(--color-slate);
  margin-top: 2px;
}

/* Stacked avatars */
.avatar-stack {
  display: flex;
  align-items: center;
}

.avatar-ring {
  border-radius: var(--radius-circle);
  border: 2px solid var(--color-surface-white);
  flex-shrink: 0;
}

.avatar-ring + .avatar-ring {
  margin-left: -8px;
}

.avatar-extra {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: var(--color-canvas);
  color: var(--color-slate);
  font-size: 1.1rem;
  font-weight: 600;
}

.icon-members {
  color: var(--color-slate);
  flex-shrink: 0;
}

.meta {
  font-size: var(--text-sm);
  color: var(--color-slate);
  margin-left: var(--spacing-1);
}

.open-btn {
  margin-left: auto;
  padding: 4px 18px;
  font-size: var(--text-sm);
}
</style>
