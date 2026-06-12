import { supabase } from '@/shared/lib/supabase'
import type { AuthChangeEvent, Session } from '@/shared/lib/supabase'

export const authApi = {
  getSession: () => supabase.auth.getSession(),

  signInWithGoogle: (redirectTo: string) =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    }),

  signOut: () => supabase.auth.signOut(),

  onAuthStateChange: (cb: (event: AuthChangeEvent, session: Session | null) => void) =>
    supabase.auth.onAuthStateChange(cb),
}
