ALTER TABLE public.scan_logs ADD COLUMN IF NOT EXISTS ip text;
CREATE INDEX IF NOT EXISTS scan_logs_ip_created_at_idx ON public.scan_logs (ip, created_at DESC);
CREATE INDEX IF NOT EXISTS scan_logs_user_id_created_at_idx ON public.scan_logs (user_id, created_at DESC);