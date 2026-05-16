import { ref } from 'vue'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { authApi } from '@/features/auth/api/auth.api'

export function useSignOut() {
  const store = useAuthStore()
  const signOutLoading = ref(false)

  async function signOut() {
    signOutLoading.value = true
    try {
      await authApi.signOut()
      store.setSession(null)
    } finally {
      signOutLoading.value = false
    }
  }

  return { signOut, signOutLoading }
}
