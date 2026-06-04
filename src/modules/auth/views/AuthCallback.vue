<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { safeInternalPath } from '@/shared/utils/url.util'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  if (!auth.isAuthenticated) {
    router.replace('/sign-in')
    return
  }

  const redirect = safeInternalPath(route.query.redirect)
  router.replace(redirect ?? '/')
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p>Signing you in…</p>
  </div>
</template>
