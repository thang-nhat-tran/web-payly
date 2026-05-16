<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import defaultCover from '@/assets/default-group-cover.png'

defineProps<{
  name: string
  subtitle: string
  coverUrl?: string
}>()

defineEmits<{ back: [] }>()
</script>

<template>
  <div
    class="hero"
    :style="{ backgroundImage: `url(${coverUrl || defaultCover})` }"
  >
    <div class="overlay" />
    <div class="hero-inner">
      <button class="back-btn" aria-label="Quay lại" @click="$emit('back')">
        <ArrowLeft :size="20" :stroke-width="2" />
      </button>
      <div class="info">
        <h2 class="name">{{ name }}</h2>
        <p class="subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  height: 200px;
  background-color: var(--color-ink);
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(20, 20, 19, 0.3) 0%,
    rgba(20, 20, 19, 0.72) 100%
  );
}

.hero-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--spacing-2) var(--spacing-2) var(--spacing-3);
}

.back-btn {
  position: absolute;
  top: var(--spacing-2);
  left: var(--spacing-2);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-circle);
  background: rgba(255, 255, 255, 0.18);
  border: none;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s var(--ease-standard);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  color: #fff;
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: var(--tracking-headline);
  margin: 0;
}

.subtitle {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}
</style>
