ALTER TABLE public.defectors ADD COLUMN other_language text;

CREATE OR REPLACE FUNCTION public.update_defectors_insert_policy_check()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT true;
$$;

DROP POLICY IF EXISTS "public insert defectors" ON public.defectors;

CREATE POLICY "public insert defectors"
  ON public.defectors FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 80
    AND char_length(email) BETWEEN 3 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND streak >= 0 AND streak <= 100000
    AND (
      language IN ('Japanese','Spanish','Korean','French','Mandarin','German')
      OR (
        language = 'Other'
        AND other_language IS NOT NULL
        AND char_length(other_language) BETWEEN 1 AND 60
      )
    )
  );