function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
}

export function toCamelCase<T>(data: unknown): T {
  if (Array.isArray(data)) return data.map(toCamelCase) as T
  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([k, v]) => [
        snakeToCamel(k),
        toCamelCase(v),
      ]),
    ) as T
  }
  return data as T
}

export function toSnakeCase<T>(data: unknown): T {
  if (Array.isArray(data)) return data.map(toSnakeCase) as T
  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([k, v]) => [
        camelToSnake(k),
        toSnakeCase(v),
      ]),
    ) as T
  }
  return data as T
}
