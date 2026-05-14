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
  padding: var(--spacing-4) var(--spacing-4) 0;
}
</style>
