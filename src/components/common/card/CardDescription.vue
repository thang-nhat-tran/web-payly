<template>
  <p class="description">
    <slot />
  </p>
</template>

<style scoped>
.description {
  font-size: var(--text-base);
  color: var(--color-slate);
  line-height: 1.4;
}
</style>
