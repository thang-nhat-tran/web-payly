const PREFIX = 'payly'

/**
 * Central registry of browser storage keys. Add new keys here (namespaced with
 * `PREFIX`) rather than inlining string literals at call sites, so every key
 * stays unique and greppable.
 */
export const STORAGE_KEYS = {
  debtListSelectionTooltipHidden: `${PREFIX}:debtListSelectionTooltipHidden`,
} satisfies Record<string, `${typeof PREFIX}:${string}`>

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
