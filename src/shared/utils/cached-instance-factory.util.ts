type KeyResolverFn<TOptions> = (options: TOptions) => string

type FactoryFn<TOptions, TValue> = (options: TOptions) => TValue

function stableObjectKey(options: unknown): string {
  if (typeof options !== 'object' || options === null || Array.isArray(options)) {
    throw new Error('[stableObjectKey]: Invalid input. Options must be a plain object.')
  }
  const sortedKeys = Object.keys(options).sort()
  return JSON.stringify(options, sortedKeys)
}

export function createCachedInstance<TOptions, TValue>(
  create: FactoryFn<TOptions, TValue>,
  getKey: KeyResolverFn<TOptions> = stableObjectKey,
) {
  const cache = new Map<string, TValue>()

  return (options: TOptions): TValue => {
    const key = getKey(options)
    if (cache.has(key)) {
      return cache.get(key)!
    }

    const value = create(options)
    cache.set(key, value)

    return value
  }
}
