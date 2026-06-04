import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Re-export SDK types so modules never import `@supabase/supabase-js` directly (Hard Rule 1).
export type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
