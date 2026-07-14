export type AllowedMimeType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/webp'
  | 'application/pdf'
  | 'text/plain'
  | 'application/json'

export type BucketName = 'public-assets' | 'private-assets'

export interface UploadOptions {
  bucket: BucketName
  /** Overwrite an existing object at the same path. Defaults to false. */
  upsert?: boolean
  cacheControl?: string
  contentType?: AllowedMimeType
  /** Reject the file client-side before uploading if it exceeds this size. */
  maxSizeMB?: number
  /** Reject the file client-side before uploading if its MIME type isn't listed. */
  allowedMimeTypes?: AllowedMimeType[]
}

export interface UploadResult {
  /** Storage object key, e.g. `settlement-evidences/{userId}/{uuid}.png` — not a URL. */
  path: string
}
