<template>
  <p class="description">
    <slot />
  </p>
</template>

<style scoped>
.description {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.4;
}
</style>
