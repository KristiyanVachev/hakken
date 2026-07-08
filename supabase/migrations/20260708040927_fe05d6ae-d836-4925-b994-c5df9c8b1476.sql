
DROP VIEW IF EXISTS public.defectors_public;

GRANT SELECT (id, name, streak, language, other_language, created_at)
  ON public.defectors TO anon, authenticated;

CREATE POLICY "public read defectors safe columns"
ON public.defectors
FOR SELECT
TO anon, authenticated
USING (true);

CREATE VIEW public.defectors_public
WITH (security_invoker = true) AS
SELECT id, name, streak, language, other_language, created_at
FROM public.defectors;

GRANT SELECT ON public.defectors_public TO anon, authenticated;
