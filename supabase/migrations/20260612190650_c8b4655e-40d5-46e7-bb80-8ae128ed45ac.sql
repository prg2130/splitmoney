
-- Restrict bill-uploads bucket access. Files are written server-side by the
-- scan-bill edge function (service role bypasses RLS). Object paths follow
-- "YYYY-MM-DD/<user_id>/<uuid>.<ext>" so owner = second path segment.

CREATE POLICY "Users can read their own bill uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'bill-uploads'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- No INSERT/UPDATE/DELETE policies for authenticated/anon → denied by default.
-- service_role bypasses RLS and continues to manage uploads via the edge function.
