-- Private bucket for receipt uploads
insert into storage.buckets (id, name, public)
values ('bill-uploads', 'bill-uploads', false)
on conflict (id) do nothing;

-- Lock down: no anon/authenticated access. Only service_role (used by edge functions) can touch it.
-- No policies created => RLS denies all non-service_role access by default.

-- Track stored file metadata on scan_logs
alter table public.scan_logs
  add column if not exists image_path text,
  add column if not exists mime_type text,
  add column if not exists size_bytes integer;