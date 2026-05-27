<script setup lang="ts">
// Slots: left (brand / logo), center (nav links), right (actions / user)
</script>

<template>
  <header class="sticky top-0 z-50 bg-surface-white shadow-float">
    <div class="mx-auto px-3 h-24 flex items-center gap-4">
      <div class="flex shrink-0 items-center">
        <slot name="left" />
      </div>

      <div class="flex flex-1 items-center justify-center">
        <slot name="center" />
      </div>

      <div class="flex shrink-0 items-center">
        <slot name="right" />
      </div>
    </div>
  </header>
</template>
