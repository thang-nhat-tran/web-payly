<script setup lang="ts">
import { useLoginWithGoogle } from '@/composables/auth/useLoginWithGoogle'
import IconGoogle from '@/components/common/icons/IconGoogle.vue'

const { loginWithGoogle, loginLoading, loginError } = useLoginWithGoogle()
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm">
      <!-- Brand -->
      <div class="text-center mb-8">
        <h1>Welcome back</h1>
        <p>Sign in to continue to your account</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <button
          class="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="loginLoading"
          @click="loginWithGoogle"
        >
          <IconGoogle class="shrink-0" />
          <span>{{ loginLoading ? 'Redirecting…' : 'Continue with Google' }}</span>
        </button>

        <p v-if="loginError" class="mt-4 text-xs text-red-600 text-center">{{ loginError }}</p>
      </div>
    </div>
  </div>
</template>
