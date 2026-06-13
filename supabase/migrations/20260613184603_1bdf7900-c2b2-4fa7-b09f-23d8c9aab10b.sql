ALTER TABLE public.scan_logs
  ADD COLUMN IF NOT EXISTS bill_total numeric,
  ADD COLUMN IF NOT EXISTS currency text;

CREATE OR REPLACE FUNCTION public.get_split_totals()
RETURNS TABLE (
  currency text,
  total_value numeric,
  total_value_7d numeric,
  total_value_30d numeric,
  scan_count bigint,
  scan_count_7d bigint,
  scan_count_30d bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(currency, '?') AS currency,
    COALESCE(SUM(bill_total), 0) AS total_value,
    COALESCE(SUM(bill_total) FILTER (WHERE created_at >= now() - interval '7 days'), 0) AS total_value_7d,
    COALESCE(SUM(bill_total) FILTER (WHERE created_at >= now() - interval '30 days'), 0) AS total_value_30d,
    COUNT(*) AS scan_count,
    COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days') AS scan_count_7d,
    COUNT(*) FILTER (WHERE created_at >= now() - interval '30 days') AS scan_count_30d
  FROM public.scan_logs
  WHERE bill_total IS NOT NULL
  GROUP BY COALESCE(currency, '?')
  ORDER BY total_value DESC;
$$;

REVOKE ALL ON FUNCTION public.get_split_totals() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_split_totals() TO service_role;
