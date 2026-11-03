-- ==============================================================================
-- TITIKPKL DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================

-- 1. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('CONSUMER', 'MERCHANT')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. MERCHANTS TABLE
CREATE TABLE IF NOT EXISTS public.merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT NOT NULL,
  business_code TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT DEFAULT 'Kuliner' NOT NULL,
  is_premium BOOLEAN DEFAULT false NOT NULL,
  qris_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. VENDOR_LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.vendor_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE UNIQUE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_live BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MENU_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  description TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Profiles: Siapapun dapat membaca profil, user hanya bisa edit profil miliknya
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Merchants: Publik bisa melihat, merchant hanya bisa mengelola miliknya
CREATE POLICY "Merchants viewable by everyone." 
  ON public.merchants FOR SELECT USING (true);

CREATE POLICY "Merchants can insert own data." 
  ON public.merchants FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Merchants can update own data." 
  ON public.merchants FOR UPDATE USING (auth.uid() = user_id);

-- Vendor Locations: Publik bisa melihat pedagang yang live, pedagang bisa update lokasinya
CREATE POLICY "Locations viewable by everyone." 
  ON public.vendor_locations FOR SELECT USING (true);

CREATE POLICY "Merchants can insert their location." 
  ON public.vendor_locations FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants 
      WHERE id = merchant_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their location." 
  ON public.vendor_locations FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.merchants 
      WHERE id = merchant_id AND user_id = auth.uid()
    )
  );

-- Menu Items: Publik bisa melihat menu yang tersedia, merchant kelola menunya
CREATE POLICY "Menu items viewable by everyone." 
  ON public.menu_items FOR SELECT USING (true);

CREATE POLICY "Merchants can manage own menu items." 
  ON public.menu_items FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.merchants 
      WHERE id = merchant_id AND user_id = auth.uid()
    )
  );

-- ==============================================================================
-- TRIGGER AUTO CREATE PROFILE & MERCHANT ON REGISTER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  selected_role TEXT;
  user_name TEXT;
  new_code TEXT;
BEGIN
  selected_role := COALESCE(new.raw_user_meta_data->>'role', 'CONSUMER');
  user_name := COALESCE(new.raw_user_meta_data->>'name', 'Pengguna TitikPKL');

  -- 1. Insert ke profiles
  INSERT INTO public.profiles (id, name, role)
  VALUES (new.id, user_name, selected_role);

  -- 2. Jika MERCHANT, otomatis buatkan record merchants awal
  IF selected_role = 'MERCHANT' THEN
    new_code := 'PKL-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
    INSERT INTO public.merchants (user_id, business_name, business_code, category)
    VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'business_name', 'Warung ' || user_name),
      new_code,
      COALESCE(new.raw_user_meta_data->>'category', 'Kuliner')
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang trigger ke auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS (Untuk live update di Phase 3)
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendor_locations;
