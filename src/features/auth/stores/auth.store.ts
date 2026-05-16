import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/features/auth/api/auth.api'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  function setSession(newSession: Session | null) {
    session.value = newSession
    user.value = newSession?.user ?? null
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
    setLoading(false)
    setInitialized()

    authApi.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
  }

  return { user, session, loading, initialized, isAuthenticated, setSession, setLoading, setInitialized, init }
})
