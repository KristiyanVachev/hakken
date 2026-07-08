
DROP VIEW IF EXISTS public.defectors_public;
CREATE VIEW public.defectors_public AS
SELECT id, name, streak, language, other_language, created_at
FROM public.defectors;
ALTER VIEW public.defectors_public OWNER TO postgres;
GRANT SELECT ON public.defectors_public TO anon, authenticated;
