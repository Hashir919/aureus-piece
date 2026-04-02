---------------------------------------------------------
-- 1. Table Creation: Portfolio
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read portfolio" ON public.portfolio FOR SELECT USING (true);

-- Admin only write access (Authenticated)
CREATE POLICY "Admin write portfolio" ON public.portfolio FOR ALL USING (auth.role() = 'authenticated');

---------------------------------------------------------
-- 2. Table Creation: Testimonials
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  review TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);

-- Admin only write access (Authenticated)
CREATE POLICY "Admin write testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

---------------------------------------------------------
-- 3. Table Creation: About
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL
);

ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read about" ON public.about FOR SELECT USING (true);

-- Admin only write access (Authenticated)
CREATE POLICY "Admin write about" ON public.about FOR ALL USING (auth.role() = 'authenticated');

---------------------------------------------------------
-- 4. Initial Seed Data: About
---------------------------------------------------------
INSERT INTO public.about (content)
VALUES ('Aureus Studio operates at the intersection of technical precision and ethereal aesthetics. We don''t just build brands; we architect digital universes.');

---------------------------------------------------------
-- 5. Storage Setup
---------------------------------------------------------
-- Run the following commands in the Supabase Dashboard SQL Editor
-- to create the bucket and set permissions.

-- Create Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- 1. Allow public select access to portfolio images
CREATE POLICY "Public Select"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio-images' );

-- 2. Allow authenticated users to upload images
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'portfolio-images' AND auth.role() = 'authenticated' );

-- 3. Allow authenticated users to update/delete their own images
CREATE POLICY "Admin Update/Delete"
ON storage.objects FOR ALL
USING ( bucket_id = 'portfolio-images' AND auth.role() = 'authenticated' );
