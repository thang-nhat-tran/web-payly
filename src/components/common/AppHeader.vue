<script setup lang="ts">
import { ref } from 'vue'
const year = ref(new Date().getFullYear())
</script>

<template>
  <h1>Hello VueJS {{ year }}</h1>
</template>

<style scoped></style>
