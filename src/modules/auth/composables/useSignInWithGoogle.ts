import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { authApi } from '@/modules/auth/api/auth.api'
import { safeInternalPath } from '@/shared/utils/url.util'

export function useSignInWithGoogle() {
  const route = useRoute()
  const signInLoading = ref(false)
  const signInError = ref('')

  /** Builds the OAuth callback URL, forwarding the `redirect` query so the user
   *  returns to their intended page after Google sign-in. */
  function buildCallbackUrl() {
    const callback = new URL('/auth/callback', window.location.origin)
    const redirect = safeInternalPath(route.query.redirect)
    if (redirect) callback.searchParams.set('redirect', redirect)
    return callback.toString()
  }

  async function signInWithGoogle() {
    signInLoading.value = true
    signInError.value = ''
    try {
      const { error } = await authApi.signInWithGoogle(buildCallbackUrl())
      if (error) throw error
    } catch (e: unknown) {
      signInError.value = e instanceof Error ? e.message : String(e)
    } finally {
      signInLoading.value = false
    }
  }

  return { signInWithGoogle, signInLoading, signInError }
}
