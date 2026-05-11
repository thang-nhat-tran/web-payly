<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/composables/auth/useLogout'

const router = useRouter()
const auth = useAuthStore()
const { logout, logoutLoading } = useLogout()

async function handleLogout() {
  await logout()
  router.replace('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">P</div>
        <span class="font-semibold text-gray-900">Payly</span>
      </div>

      <button class="text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors" :disabled="logoutLoading" @click="handleLogout">
        {{ logoutLoading ? 'Signing out…' : 'Sign out' }}
      </button>
    </header>

    <main class="px-4 py-6 max-w-2xl mx-auto">
      <h1 class="text-xl font-bold text-gray-900">Welcome, {{ auth.user?.email }}</h1>
      <p class="mt-1 text-sm text-gray-500">Your personal finance manager</p>
    </main>
  </div>
</template>
