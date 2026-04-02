---------------------------------------------------------
-- 1. Create Categories Table
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

-- Admin only write access
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

---------------------------------------------------------
-- 2. Update Portfolio Table
---------------------------------------------------------

-- Add category_id column
ALTER TABLE public.portfolio ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Remove old category (text) and year columns
ALTER TABLE public.portfolio DROP COLUMN IF EXISTS category;
ALTER TABLE public.portfolio DROP COLUMN IF EXISTS year;

---------------------------------------------------------
-- 3. Initial Seed Data: Categories
---------------------------------------------------------
INSERT INTO public.categories (name)
VALUES ('Architecture'), ('Photography'), ('Branding'), ('Digital Art')
ON CONFLICT (name) DO NOTHING;
