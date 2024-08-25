ALTER TABLE public.recipes
  ADD COLUMN original_ingredients text[] NOT NULL DEFAULT '{}'::text[];

