
DROP VIEW IF EXISTS public.defectors_public;
DROP POLICY IF EXISTS "public read defectors safe columns" ON public.defectors;
REVOKE SELECT ON public.defectors FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_defectors_public()
RETURNS TABLE (
  id uuid,
  name text,
  streak integer,
  language text,
  other_language text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, streak, language, other_language, created_at
  FROM public.defectors
  ORDER BY created_at DESC
  LIMIT 500;
$$;

REVOKE ALL ON FUNCTION public.get_defectors_public() FROM public;
GRANT EXECUTE ON FUNCTION public.get_defectors_public() TO anon, authenticated;
