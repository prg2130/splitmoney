CREATE TABLE public.scan_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_scan_logs_user_created ON public.scan_logs(user_id, created_at DESC);

ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scan logs"
ON public.scan_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);