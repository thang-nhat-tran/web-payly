<script setup lang="ts">
import { ref } from 'vue'
const year = ref(new Date().getFullYear())
</script>

<template>
  <footer>
    <p>Copyright {{ year }}</p>
  </footer>
</template>

<style scoped></style>
