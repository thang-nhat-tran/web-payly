<script setup lang="ts">
import Skeleton from '@/shared/components/ui/Skeleton.vue'
</script>

<template>
  <div class="card-shell">
    <!-- Header -->
    <div class="skel-header">
      <Skeleton width="55%" height="2.2rem" />
      <Skeleton width="80%" height="1.4rem" />
    </div>

    <!-- Content -->
    <div class="skel-content">
      <div class="skel-amount-row">
        <Skeleton width="40px" height="40px" border-radius="var(--radius-circle)" />
        <div class="skel-amount-lines">
          <Skeleton width="120px" height="2.4rem" />
          <Skeleton width="70px" height="1.3rem" />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="skel-footer">
      <div class="skel-avatars">
        <Skeleton
          v-for="i in 3"
          :key="i"
          width="28px"
          height="28px"
          border-radius="var(--radius-circle)"
          class="skel-avatar"
        />
      </div>
      <Skeleton width="72px" height="3.2rem" border-radius="var(--radius-cta)" class="skel-btn" />
    </div>
  </div>
</template>

<style scoped>
.card-shell {
  background-color: var(--color-surface-white);
  border-radius: var(--radius-hero);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.skel-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: var(--spacing-4) var(--spacing-4) 0;
}

.skel-content {
  padding: var(--spacing-3) var(--spacing-4);
  flex: 1;
}

.skel-amount-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.skel-amount-lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skel-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-3) var(--spacing-4);
  border-top: 1px solid var(--color-dust);
}

.skel-avatars {
  display: flex;
  align-items: center;
}

.skel-avatar + .skel-avatar {
  margin-left: -8px;
}

.skel-btn {
  margin-left: auto;
}
</style>
