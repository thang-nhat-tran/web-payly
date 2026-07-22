/** Abstraction over a browser key-value store (e.g. `localStorage`, `sessionStorage`), so the provider can be swapped without touching call sites. */
export interface StorageService {
  /** Returns the parsed value for `key`, or `null` if missing or unparsable. */
  get<T>(key: string): T | null
  /** Serializes and persists `value` under `key`. */
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
}
