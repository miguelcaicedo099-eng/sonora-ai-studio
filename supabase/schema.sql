-- ==============================================================================
-- SONORA AI - SUPABASE PRODUCTION DATABASE SCHEMA
-- Execute this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'producer')),
  credits INTEGER DEFAULT 50, -- 50 Daily Free Credits (5 songs)
  has_infinite_tokens BOOLEAN DEFAULT FALSE,
  is_vip BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TRACKS TABLE (User Created Songs & Shared Feed)
CREATE TABLE IF NOT EXISTS public.tracks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT DEFAULT 'Tú & SONORA AI',
  prompt TEXT,
  style TEXT,
  category TEXT DEFAULT 'urbano',
  lyrics JSONB DEFAULT '[]'::jsonb,
  audio_url TEXT NOT NULL,
  image_url TEXT,
  duration INTEGER DEFAULT 180,
  bpm INTEGER DEFAULT 120,
  key TEXT DEFAULT 'C Major',
  is_instrumental BOOLEAN DEFAULT FALSE,
  vocal_type TEXT DEFAULT 'Femenina',
  model TEXT DEFAULT 'v4.2 Ultra',
  plays INTEGER DEFAULT 1,
  likes INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TRANSACTIONS TABLE (WebPay Credit Packs)
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  pack_id TEXT NOT NULL,
  amount_clp INTEGER NOT NULL,
  credits_added INTEGER NOT NULL,
  payment_method TEXT DEFAULT 'WebPay Plus',
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES FOR PROFILES
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6. RLS POLICIES FOR TRACKS
CREATE POLICY "Public tracks are viewable by everyone" 
  ON public.tracks FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracks" 
  ON public.tracks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracks" 
  ON public.tracks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracks" 
  ON public.tracks FOR DELETE USING (auth.uid() = user_id);

-- 7. RLS POLICIES FOR TRANSACTIONS
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- 8. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    credits, 
    role, 
    is_vip, 
    has_infinite_tokens
  )
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    -- Miguel Admin automatically gets Infinite Tokens and VIP
    CASE WHEN new.email ILIKE '%miguel%' THEN 999999 ELSE 50 END,
    CASE WHEN new.email ILIKE '%miguel%' THEN 'admin' ELSE 'user' END,
    CASE WHEN new.email ILIKE '%miguel%' THEN true ELSE false END,
    CASE WHEN new.email ILIKE '%miguel%' THEN true ELSE false END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 9. REALTIME PUBLICATION (Allows live chat and live credit sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tracks;
