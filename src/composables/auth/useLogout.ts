import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/authApi'

export function useLogout() {
  const store = useAuthStore()
  const logoutLoading = ref(false)

  async function logout() {
    logoutLoading.value = true
    try {
      await authApi.logout()
      store.setSession(null)
    } finally {
      logoutLoading.value = false
    }
  }

  return { logout, logoutLoading }
}
