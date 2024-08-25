ALTER TABLE public.recipes
  DROP COLUMN ingredients;

ALTER TABLE public.recipes
  ADD COLUMN ingredients jsonb[] NOT NULL DEFAULT '{}'::jsonb[];

