<script setup lang="ts">
import { useSignInWithGoogle } from '@/modules/auth/composables/useSignInWithGoogle'
import IconGoogle from '@/shared/components/icons/IconGoogle.vue'
import AppLogo from '@/shared/components/app/AppLogo.vue'
import { Button } from '@/shared/components/ui/button'

const { signInWithGoogle, signInLoading, signInError } = useSignInWithGoogle()
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <h2>Welcome to Payly</h2>
    <AppLogo size="2xl" />

    <Button variant="secondary" :disabled="signInLoading" @click="signInWithGoogle">
      <IconGoogle class="shrink-0" />
      <span>{{ signInLoading ? 'Redirecting…' : 'Continue with Google' }}</span>
    </Button>

    <p v-if="signInError" class="mt-lg text-xs text-red-600 text-center">{{ signInError }}</p>
  </div>
</template>
