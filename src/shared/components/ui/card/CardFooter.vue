<template>
  <div class="card-footer">
    <slot />
  </div>
</template>

<style scoped>
.card-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-3) var(--spacing-4);
  border-top: 1px solid var(--color-dust);
}
</style>
