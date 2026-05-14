<script setup lang="ts">
import { useLoginWithGoogle } from '@/composables/auth/useLoginWithGoogle'
import IconGoogle from '@/components/icons/IconGoogle.vue'
import AppLogo from '@/components/app/AppLogo.vue'

const { loginWithGoogle, loginLoading, loginError } = useLoginWithGoogle()
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <h2>Welcome to Payly</h2>
    <AppLogo size="2xl" />

    <button :disabled="loginLoading" @click="loginWithGoogle" class="btn-secondary">
      <IconGoogle class="shrink-0" />
      <span>{{ loginLoading ? 'Redirecting…' : 'Continue with Google' }}</span>
    </button>

    <p v-if="loginError" class="mt-4 text-xs text-red-600 text-center">{{ loginError }}</p>
  </div>
</template>
