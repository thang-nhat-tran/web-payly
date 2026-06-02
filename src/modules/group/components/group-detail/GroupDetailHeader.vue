<script setup lang="ts">
import { ArrowLeft, Users } from 'lucide-vue-next'
import defaultCover from '@/assets/images/default-group-cover.jpg'

defineProps<{
  name: string
  subtitle?: string | null
  coverUrl?: string | null
}>()

defineEmits<{ back: []; selectMembers: [] }>()
</script>

<template>
  <div class="hero" :style="{ backgroundImage: `url(${coverUrl || defaultCover})` }">
    <div class="overlay" />
    <div class="hero-inner">
      <div class="top-row">
        <button class="icon-btn" aria-label="Quay lại" @click="$emit('back')">
          <ArrowLeft :size="20" :stroke-width="2" />
        </button>
        <button class="icon-btn" aria-label="Thành viên" @click="$emit('selectMembers')">
          <Users :size="20" :stroke-width="2" />
        </button>
      </div>

      <div class="info">
        <p class="name">{{ name }}</p>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  height: 200px;
  background-color: var(--color-text-main);
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(20, 20, 19, 0.3) 0%, rgba(20, 20, 19, 0.72) 100%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-md);
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-round);
  background: rgba(255, 255, 255, 0.18);
  border: none;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s var(--ease-standard);
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  color: #fff;
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: var(--tracking-normal);
  margin: 0;
}

.subtitle {
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}
</style>
