import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/modules/auth/api/auth.api'
import { userApi } from '@/modules/user/api/user.api'
import type { User, Session } from '@/shared/lib/supabase'
import type { UserProfile } from '@/modules/user/types/user.type'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const profile = ref<UserProfile | null>(null)
  const loading = ref(true)
  const initialized = ref(false)

  const user = computed<User | null>(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => !!user.value)

  function setSession(newSession: Session | null) {
    session.value = newSession
  }

  async function fetchProfile() {
    if (!user.value) {
      profile.value = null
      return
    }
    try {
      profile.value = await userApi.getMe()
    } catch {
      profile.value = null
    }
  }

  function setLoading(val: boolean) {
    loading.value = val
  }

  function setInitialized() {
    initialized.value = true
  }

  async function init() {
    if (initialized.value) return
    setLoading(true)
    const { data } = await authApi.getSession()
    setSession(data.session)
    await fetchProfile()
    setLoading(false)
    setInitialized()

    authApi.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      fetchProfile()
    })
  }

  return {
    user,
    session,
    profile,
    loading,
    initialized,
    isAuthenticated,
    setSession,
    setLoading,
    setInitialized,
    fetchProfile,
    init,
  }
})
