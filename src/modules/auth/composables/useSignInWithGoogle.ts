import { ref } from 'vue'
import { authApi } from '@/modules/auth/api/auth.api'

export function useSignInWithGoogle() {
  const signInLoading = ref(false)
  const signInError = ref('')

  async function signInWithGoogle() {
    signInLoading.value = true
    signInError.value = ''
    try {
      const { error } = await authApi.signInWithGoogle(
        `${window.location.origin}/auth/callback`,
      )
      if (error) throw error
    } catch (e: unknown) {
      signInError.value = e instanceof Error ? e.message : String(e)
    } finally {
      signInLoading.value = false
    }
  }

  return { signInWithGoogle, signInLoading, signInError }
}
