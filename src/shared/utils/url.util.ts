/**
 * Normalizes a raw value (typically `route.query.*`, which can be a string,
 * string[] or undefined) to a safe internal path.
 *
 * Only same-origin absolute paths are allowed: the value must start with a
 * single `/`. Protocol-relative (`//evil.com`) and absolute external URLs are
 * rejected to prevent open-redirect attacks.
 *
 * @returns the safe path, or `null` when the value is absent or unsafe.
 */
export function safeInternalPath(value: unknown): string | null {
  const path = Array.isArray(value) ? value[0] : value
  if (typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')) {
    return path
  }
  return null
}
