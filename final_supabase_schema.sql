-- ========================================================
-- 1. CLEANUP (Optional: Only if you want to reset everything)
-- ========================================================
-- DROP TABLE IF EXISTS public.portfolio;
-- DROP TABLE IF EXISTS public.categories;
-- DROP TABLE IF EXISTS public.testimonials;
-- DROP TABLE IF EXISTS public.about;

-- ========================================================
-- 2. CREATE TABLES
-- ========================================================

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Portfolio Table
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  review TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- About Table
CREATE TABLE IF NOT EXISTS public.about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL
);

-- ========================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ========================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- 4. POLICIES (Public Read / Admin Write)
-- ========================================================

-- Categories Policies
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

-- Portfolio Policies
CREATE POLICY "Public read portfolio" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Admin write portfolio" ON public.portfolio FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials Policies
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admin write testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- About Policies
CREATE POLICY "Public read about" ON public.about FOR SELECT USING (true);
CREATE POLICY "Admin write about" ON public.about FOR ALL USING (auth.role() = 'authenticated');

-- ========================================================
-- 5. STORAGE SETUP (Bucket and Policies)
-- ========================================================

-- Create Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Select Images" ON storage.objects FOR SELECT USING ( bucket_id = 'portfolio-images' );
CREATE POLICY "Admin Upload Images" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'portfolio-images' AND auth.role() = 'authenticated' );
CREATE POLICY "Admin Full Access Images" ON storage.objects FOR ALL USING ( bucket_id = 'portfolio-images' AND auth.role() = 'authenticated' );

-- ========================================================
-- 6. SEED DATA
-- ========================================================

-- Initial Categories
INSERT INTO public.categories (name)
VALUES ('Architecture'), ('Photography'), ('Branding'), ('Digital Art')
ON CONFLICT (name) DO NOTHING;

-- Initial About Story
INSERT INTO public.about (content)
VALUES ('Aureus Studio operates at the intersection of technical precision and ethereal aesthetics. We don''t just build brands; we architect digital universes.')
ON CONFLICT DO NOTHING;
