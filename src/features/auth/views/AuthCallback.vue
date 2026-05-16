<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth.store'

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  router.replace(auth.isAuthenticated ? '/' : '/sign-in')
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p>Signing you in…</p>
  </div>
</template>
