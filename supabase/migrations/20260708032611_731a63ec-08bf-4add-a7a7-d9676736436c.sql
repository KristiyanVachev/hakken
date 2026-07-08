
CREATE TABLE public.defectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  streak integer NOT NULL DEFAULT 0 CHECK (streak >= 0 AND streak <= 100000),
  language text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.defectors TO anon;
GRANT SELECT, INSERT ON public.defectors TO authenticated;
GRANT ALL ON public.defectors TO service_role;

ALTER TABLE public.defectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read defectors"
  ON public.defectors FOR SELECT
  USING (true);

CREATE POLICY "public insert defectors"
  ON public.defectors FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 80
    AND char_length(email) BETWEEN 3 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND streak >= 0 AND streak <= 100000
    AND language IN ('Japanese','Spanish','Korean','French','Mandarin','German')
  );
