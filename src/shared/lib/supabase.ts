import { createClient, PostgrestError } from '@supabase/supabase-js'
import { toCamelCase, toSnakeCase } from '@/shared/lib/case-converter'

// Re-export SDK types so modules never import `@supabase/supabase-js` directly (Hard Rule 1).
export type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

type QueryBuilder = ReturnType<typeof supabase.from>

function wrapFrom(builder: QueryBuilder): QueryBuilder {
  return new Proxy(builder, {
    get(target, prop: string) {
      if (prop === 'insert' || prop === 'update' || prop === 'upsert') {
        return (payload: unknown, options?: unknown) =>
          (target[prop as keyof QueryBuilder] as (...args: unknown[]) => unknown).call(
            target,
            toSnakeCase(payload),
            options,
          )
      }
      const val = target[prop as keyof QueryBuilder]
      return typeof val === 'function'
        ? (val as (...args: unknown[]) => unknown).bind(target)
        : val
    },
  })
}

export function from(table: string): QueryBuilder {
  return wrapFrom(supabase.from(table as never))
}

export async function supabaseCall<T>(
  promise: PromiseLike<{ data: unknown; error: PostgrestError | null }>,
): Promise<T> {
  const { data, error } = await promise
  if (error) throw new Error(error.message)
  return toCamelCase<T>(data)
}
