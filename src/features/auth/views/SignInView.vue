<script setup lang="ts">
import { useSignInWithGoogle } from '@/features/auth/composables/useSignInWithGoogle'
import IconGoogle from '@/shared/components/icons/IconGoogle.vue'
import AppLogo from '@/shared/components/app/AppLogo.vue'

const { signInWithGoogle, signInLoading, signInError } = useSignInWithGoogle()
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <h2>Welcome to Payly</h2>
    <AppLogo size="2xl" />

    <button :disabled="signInLoading" @click="signInWithGoogle" class="btn-secondary">
      <IconGoogle class="shrink-0" />
      <span>{{ signInLoading ? 'Redirecting…' : 'Continue with Google' }}</span>
    </button>

    <p v-if="signInError" class="mt-4 text-xs text-red-600 text-center">{{ signInError }}</p>
  </div>
</template>
