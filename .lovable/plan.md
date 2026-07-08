# Hakken — Punk Zine Landing Page

Single-page, mobile-first landing site with ransom-note aesthetic and Supabase-backed email capture + public wall.

## Design system (src/styles.css)

- Background: cream `oklch(0.96 0.02 85)` (paper)
- Foreground: near-black ink
- Accent: warm red-orange `oklch(0.62 0.22 35)` for DECEASED stamp, highlights, focus rings
- Fonts loaded via `<link>` in `__root.tsx` head:
  - **Special Elite** — typewriter (manifesto, wall, form)
  - **Anton**, **Rubik Mono One**, **Archivo Black**, **Bungee** — mixed display fonts for ransom-note letters
- Custom utilities: `.torn-edge` (SVG mask for torn paper between sections), `.stamp-btn` (hard black offset shadow, no border-radius, slight rotation on hover), `.tape` (yellowed tape strip), `.ransom-letter` variants

## Sections (all in `src/routes/index.tsx`)

1. **Hero**
   - Top-left wordmark "Hakken" in bold display font
   - Ransom-note headline `GOD SAVE THE STREAK` — each letter wrapped in a `<span>` with randomized font family, size (0.9–1.3em), rotation (-8° to 8°), some inverted (black bg / cream text), some highlighted
   - Subhead in typewriter font
   - Owl silhouette (inline SVG) inside a "WANTED" poster frame, with red "DECEASED" stamp overlay (rotated -12°, semi-transparent red, distressed border)
   - `Defect →` stamp button scrolls to `#defect`

2. **Manifesto** — 3 numbered blocks (01/02/03), thick 6px top border, alternating rotation (-1°, 1°, -0.5°), typewriter body

3. **Try it** — Framing line + static breakdown of お前はもう死んでいる
   - Word table (5 rows, monospace)
   - Natural translation line
   - Insight box (bordered, taped-on style)

4. **Defect** (`id="defect"`) — Email capture form
   - Fields: name, email, streak (number, min 0), language (select: Japanese; Spanish/Korean/French/Mandarin/German each labeled "(coming soon)")
   - Zod validation client-side
   - On submit → insert into `defectors` table, show success message, refetch wall

5. **Wall of Defectors**
   - Top counter: "X,XXX days rescued from the owl" (sum of all streaks)
   - List: "Name — N days — Language" one per line in typewriter font

6. **Footer** — "Built in one night at Punk Software Hack Night." + Hakken wordmark

## Backend (Lovable Cloud / Supabase)

Enable Lovable Cloud, then migration:

```sql
create table public.defectors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  streak integer not null default 0 check (streak >= 0),
  language text not null,
  created_at timestamptz not null default now()
);

grant select, insert on public.defectors to anon;
grant select, insert on public.defectors to authenticated;
grant all on public.defectors to service_role;

alter table public.defectors enable row level security;

create policy "public read" on public.defectors for select using (true);
create policy "public insert" on public.defectors for insert with check (
  length(name) between 1 and 80
  and length(email) between 3 and 200
  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and streak >= 0 and streak <= 100000
  and language in ('Japanese','Spanish','Korean','French','Mandarin','German')
);
```

Note: emails are publicly readable per the spec ("public read so the wall works"). Wall will display name + streak + language only (email stored but not rendered).

## Data flow

- Browser `supabase` client (`@/integrations/supabase/client`)
- TanStack Query: `useSuspenseQuery` for wall via loader `ensureQueryData`, invalidated after successful insert
- Loader wrapped so failures fall back gracefully (empty wall)

## Head metadata (`__root.tsx`)

- Title: "Hakken — God Save the Streak"
- Description: "A self-taught rebellion. Kill the owl, keep the habit."
- og:title / og:description / twitter:card = summary_large_image
- Add Google Fonts `<link>` tags for the display + typewriter fonts

## Files touched

- `src/styles.css` — palette, torn-edge utility, stamp-btn utility, ransom-letter helpers
- `src/routes/__root.tsx` — head metadata + font `<link>` tags
- `src/routes/index.tsx` — full landing page (all sections)
- `src/components/hakken/*` — RansomHeadline, OwlPoster, DefectForm, WallOfDefectors, TornDivider
- New migration for `defectors` table
- Enable Lovable Cloud
