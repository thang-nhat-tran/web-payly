<template>
  <div class="card-header">
    <slot />
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: var(--spacing-lg) var(--spacing-lg) 0;
}
</style>
