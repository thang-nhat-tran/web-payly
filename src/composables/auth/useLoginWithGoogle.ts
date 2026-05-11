import { ref } from 'vue'
import { authApi } from '@/api/authApi'

export function useLoginWithGoogle() {
  const loginLoading = ref(false)
  const loginError = ref('')

  async function loginWithGoogle() {
    loginLoading.value = true
    loginError.value = ''
    try {
      const { error } = await authApi.loginWithGoogle(`${window.location.origin}/auth/callback`)
      if (error) throw error
    } catch (e: unknown) {
      loginError.value = e instanceof Error ? e.message : String(e)
    } finally {
      loginLoading.value = false
    }
  }

  return { loginWithGoogle, loginLoading, loginError }
}
