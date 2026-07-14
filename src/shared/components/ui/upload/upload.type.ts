import type { HTMLAttributes } from 'vue'

export type UploadStatus = 'uploading' | 'success' | 'error'

export interface UploadItem {
  id: string
  file: File
  /** Object URL for local preview; revoked when the item is removed/unmounted. */
  previewUrl: string
  status: UploadStatus
  /** 0-100. Stays 0 unless `uploadFn` reports real progress via its callback. */
  progress: number
  /** Storage path returned by `uploadFn` once uploaded — not a URL. */
  path?: string
  error?: string
}

/**
 * Injected by the parent so this component stays free of API/business logic, e.g.
 * `(file) => expenseApi.uploadSettlementEvidence(userId, file)`.
 * `onProgress` is optional — call it if the underlying upload can report real progress.
 * Resolves to the storage path (not a URL) so callers manage paths, not URLs.
 */
export type UploadFn = (file: File, onProgress?: (percent: number) => void) => Promise<string>

export interface UploadProps {
  uploadFn: UploadFn
  /** Comma-separated MIME patterns, e.g. 'image/*'. Only images are supported today. */
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSizeMB?: number
  disabled?: boolean
  class?: HTMLAttributes['class']
}
