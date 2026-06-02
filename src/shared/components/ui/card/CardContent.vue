<template>
  <div class="card-content">
    <slot />
  </div>
</template>

<style scoped>
.card-content {
  padding: var(--spacing-md) var(--spacing-lg);
  flex: 1;
}
</style>
