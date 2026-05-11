<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  router.replace(auth.isAuthenticated ? '/' : '/login')
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p>Signing you in…</p>
  </div>
</template>
