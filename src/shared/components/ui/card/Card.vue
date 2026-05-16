<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="card-shell">
    <slot />
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
</style>
