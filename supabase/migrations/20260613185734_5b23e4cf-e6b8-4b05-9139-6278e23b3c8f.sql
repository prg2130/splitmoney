-- Remove permissive anonymous upload policy on bill-uploads
DROP POLICY IF EXISTS "Anyone can upload bill images" ON storage.objects;

-- Restrict scan_logs writes: only the row owner may insert/update/delete
-- (Edge functions use the service role and bypass RLS, so server-side logging keeps working.)
CREATE POLICY "Users can insert own scan logs"
ON public.scan_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scan logs"
ON public.scan_logs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scan logs"
ON public.scan_logs
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
