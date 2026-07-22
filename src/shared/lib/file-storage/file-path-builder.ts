function uniqueFileName(file: File): string {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : undefined
  const id = crypto.randomUUID()
  return ext ? `${id}.${ext}` : id
}

// Keyed by the uploading user, not the settlement: the evidence image is uploaded
// during confirmation, before `settle_expense_splits` has created the settlement row.
// Must be at least `{folder}/{owner}/{file}` — storage RLS policies key off
// storage.foldername(name), which treats the last path segment as the file name.
export function buildSettlementEvidencePath(userId: string, file: File) {
  return `settlement-evidences/${userId}/${uniqueFileName(file)}`
}
