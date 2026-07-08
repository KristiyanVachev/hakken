
DROP POLICY IF EXISTS "public read defectors" ON public.defectors;
REVOKE SELECT ON public.defectors FROM anon;
REVOKE SELECT ON public.defectors FROM authenticated;

CREATE OR REPLACE VIEW public.defectors_public
WITH (security_invoker = true) AS
SELECT id, name, streak, language, other_language, created_at
FROM public.defectors;

GRANT SELECT ON public.defectors_public TO anon, authenticated;

CREATE POLICY "public read defectors safe columns"
ON public.defectors
FOR SELECT
TO anon, authenticated
USING (true);
