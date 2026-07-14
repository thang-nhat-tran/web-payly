import { supabase } from '../../supabase'
import type { UploadOptions, UploadResult } from './storage.type'
import { UPLOAD_PRESETS, type UploadPresetKey } from './upload-preset'

function assertValidFile(file: File, options?: Pick<UploadOptions, 'maxSizeMB' | 'allowedMimeTypes'>) {
  if (options?.maxSizeMB && file.size > options.maxSizeMB * 1024 * 1024) {
    throw new Error(`File "${file.name}" exceeds the ${options.maxSizeMB}MB limit.`)
  }
  if (options?.allowedMimeTypes && !(options.allowedMimeTypes as readonly string[]).includes(file.type)) {
    throw new Error(`File "${file.name}" has an unsupported type: ${file.type || 'unknown'}.`)
  }
}

/** Uploads `file` to `path` under the preset's bucket. Returns the stored path, not a URL. */
export async function uploadFile(file: File, path: string, preset: UploadPresetKey): Promise<UploadResult> {
  const rule = UPLOAD_PRESETS[preset]
  assertValidFile(file, rule)

  const { error } = await supabase.storage.from(rule.bucket).upload(path, file, {
    upsert: rule.upsert,
    cacheControl: rule.cacheControl,
  })

  if (error) throw error

  return { path }
}

/** Synchronously builds the public URL for a path in a public bucket (e.g. `public-assets`). */
export function getPublicFileUrl(preset: UploadPresetKey, path: string): string {
  const { bucket } = UPLOAD_PRESETS[preset]
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/** Creates a short-lived signed URL for a path in a private bucket (e.g. `private-assets`). */
export async function getPrivateFileUrl(
  preset: UploadPresetKey,
  path: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const { bucket } = UPLOAD_PRESETS[preset]
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds)
  if (error) throw error
  return data.signedUrl
}
