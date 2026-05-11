import { supabaseClient } from '@/api/supabaseClient'

export const authApi = {
  getSession: () => supabaseClient.getSession(),

  loginWithGoogle: (redirectTo: string) => supabaseClient.signInWithGoogle(redirectTo),

  logout: () => supabaseClient.signOut(),

  onAuthStateChange: supabaseClient.onAuthStateChange,
}
