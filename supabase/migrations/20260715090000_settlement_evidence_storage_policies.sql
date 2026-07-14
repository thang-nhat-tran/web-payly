-- storage.objects has RLS enabled with no policies yet, so every read/write on the
-- private-assets bucket is denied. Scope settlement-evidence access to each user's
-- own folder: settlement-evidences/{auth.uid()}/... (see buildSettlementEvidencePath).
CREATE POLICY "Users can upload their own settlement evidence"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'private-assets'
  AND (storage.foldername(name))[1] = 'settlement-evidences'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Users can view their own settlement evidence"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'private-assets'
  AND (storage.foldername(name))[1] = 'settlement-evidences'
  AND (storage.foldername(name))[2] = auth.uid()::text
);
