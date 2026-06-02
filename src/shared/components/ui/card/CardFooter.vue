<template>
  <div class="card-footer">
    <slot />
  </div>
</template>

<style scoped>
.card-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-text-disabled);
}
</style>
