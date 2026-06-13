
-- split_sessions
CREATE TABLE public.split_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_total numeric,
  currency text,
  subtotal numeric,
  tax_total numeric,
  tip_total numeric,
  service_total numeric,
  people_count integer,
  items_count integer,
  split_mode text,
  scan_log_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.split_sessions TO anon, authenticated;
GRANT ALL ON public.split_sessions TO service_role;
ALTER TABLE public.split_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert split sessions"
  ON public.split_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- split_participants
CREATE TABLE public.split_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.split_sessions(id) ON DELETE CASCADE,
  name text,
  amount_owed numeric,
  items_assigned_count integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.split_participants TO anon, authenticated;
GRANT ALL ON public.split_participants TO service_role;
ALTER TABLE public.split_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert split participants"
  ON public.split_participants FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
CREATE INDEX split_participants_session_id_idx ON public.split_participants(session_id);

-- split_items
CREATE TABLE public.split_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.split_sessions(id) ON DELETE CASCADE,
  name text,
  price numeric,
  quantity integer,
  assigned_to text[],
  assignee_count integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.split_items TO anon, authenticated;
GRANT ALL ON public.split_items TO service_role;
ALTER TABLE public.split_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert split items"
  ON public.split_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
CREATE INDEX split_items_session_id_idx ON public.split_items(session_id);

-- feedback: add session link
ALTER TABLE public.feedback ADD COLUMN session_id uuid;
