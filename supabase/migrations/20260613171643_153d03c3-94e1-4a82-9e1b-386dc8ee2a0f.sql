CREATE POLICY "Anyone can upload bill images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'bill-uploads');