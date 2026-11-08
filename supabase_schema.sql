-- ==============================================================================
-- DATABASE SCHEMA: WEDDING PLANNER PRO (SUPABASE POSTGRESQL)
-- Panduan: Buka Dashboard Supabase -> Project Anda -> Menu 'SQL Editor' -> Salin & Jalankan (Run)
-- ==============================================================================

-- 1. TABEL: wedding_buyers (Daftar Pembeli Lisensi Lynk.id)
CREATE TABLE IF NOT EXISTS public.wedding_buyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT DEFAULT 'Calon Pengantin',
    phone TEXT DEFAULT '-',
    order_id TEXT DEFAULT 'MANUAL',
    status TEXT DEFAULT 'active', -- 'active', 'revoked'
    notes TEXT DEFAULT 'Pembelian Lynk.id',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pencarian cepat berdasarkan email (lowercase)
CREATE INDEX IF NOT EXISTS idx_wedding_buyers_email ON public.wedding_buyers (LOWER(email));

-- 2. TABEL: wedding_demo_sessions (Pelacakan Sesi Demo 2 Menit & Anti-Abuse)
CREATE TABLE IF NOT EXISTS public.wedding_demo_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint TEXT NOT NULL,
    client_ip TEXT NOT NULL,
    remaining_seconds INTEGER DEFAULT 120,
    expired BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_demo_session UNIQUE (fingerprint, client_ip)
);

CREATE INDEX IF NOT EXISTS idx_demo_sessions_fp ON public.wedding_demo_sessions (fingerprint);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_ip ON public.wedding_demo_sessions (client_ip);

-- 3. TABEL: wedding_app_settings (Pengaturan Master Aplikasi & Toko Lynk.id)
CREATE TABLE IF NOT EXISTS public.wedding_app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. KEAMANAN: ROW LEVEL SECURITY (RLS)
ALTER TABLE public.wedding_buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_demo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_app_settings ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS untuk wedding_buyers:
-- a. Izinkan Verifikasi Email oleh Publik (anon) untuk login customer
DROP POLICY IF EXISTS "Allow anon to verify buyer email" ON public.wedding_buyers;
CREATE POLICY "Allow anon to verify buyer email" 
ON public.wedding_buyers 
FOR SELECT 
TO anon, authenticated
USING (true);

-- b. Izinkan service_role (Backend Netlify) untuk mengelola data pembeli penuh
DROP POLICY IF EXISTS "Allow service_role full access to buyers" ON public.wedding_buyers;
CREATE POLICY "Allow service_role full access to buyers" 
ON public.wedding_buyers 
FOR ALL 
TO service_role 
USING (true)
WITH CHECK (true);

-- c. Izinkan anon melakukan INSERT / UPDATE via webhook Lynk.id jika menggunakan anon key
DROP POLICY IF EXISTS "Allow anon insert buyers from webhook" ON public.wedding_buyers;
CREATE POLICY "Allow anon insert buyers from webhook" 
ON public.wedding_buyers 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update buyers" ON public.wedding_buyers;
CREATE POLICY "Allow anon update buyers" 
ON public.wedding_buyers 
FOR UPDATE 
TO anon, authenticated 
USING (true);

-- Kebijakan RLS untuk wedding_demo_sessions:
-- Izinkan anon untuk membaca, memulai dan memperbarui sisa waktu demo
DROP POLICY IF EXISTS "Allow anon manage demo sessions" ON public.wedding_demo_sessions;
CREATE POLICY "Allow anon manage demo sessions" 
ON public.wedding_demo_sessions 
FOR ALL 
TO anon, authenticated, service_role 
USING (true) 
WITH CHECK (true);

-- Kebijakan RLS untuk wedding_app_settings:
DROP POLICY IF EXISTS "Allow read app settings" ON public.wedding_app_settings;
CREATE POLICY "Allow read app settings" 
ON public.wedding_app_settings 
FOR SELECT 
TO anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow service_role manage settings" ON public.wedding_app_settings;
CREATE POLICY "Allow service_role manage settings" 
ON public.wedding_app_settings 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 5. INITIAL SEED DATA (DATA AWAL LISENSI)
-- Masukkan akun Owner VIP dan tester awal
INSERT INTO public.wedding_buyers (email, name, phone, order_id, status, notes)
VALUES 
    ('olapoal.artgallery@gmail.com', 'Ola Poal (Owner VIP)', '6285388597684', 'OWNER-LIFETIME', 'active', 'Akses VIP Seumur Hidup Pemilik'),
    ('alrizki@gmail.com', 'Alrizal (Admin Tester)', '6285388597684', 'TESTER-VIP', 'active', 'Akses Akun Tester'),
    ('angga.chintya@gmail.com', 'Anggah & Chintya', '6281234567890', 'LYNK-SAMPLE', 'active', 'Sample Pasangan Pengantin'),
    ('pembeli@gmail.com', 'Pembeli Pertama Lynk.id', '6281234567891', 'LYNK-001', 'active', 'Sample Pembeli Lynk.id')
ON CONFLICT (email) DO UPDATE 
SET 
    name = EXCLUDED.name,
    order_id = EXCLUDED.order_id,
    status = 'active',
    updated_at = NOW();

-- Masukkan setelan awal
INSERT INTO public.wedding_app_settings (key, value)
VALUES 
    ('store_config', '{
        "sellerStoreName": "Wedding Planner Pro",
        "lynkidProductUrl": "https://lynk.id/weddingplanner/nikah-impian",
        "accessMode": "whitelist",
        "masterLicenseCode": "NIKAH2026",
        "adminPin": "1234",
        "demoDurationSeconds": 120
    }'::jsonb)
ON CONFLICT (key) DO UPDATE 
SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 6. FUNGSI & TRIGGER OTOMATIS: Update column updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_wedding_buyers_updated_at ON public.wedding_buyers;
CREATE TRIGGER tr_wedding_buyers_updated_at
BEFORE UPDATE ON public.wedding_buyers
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- SELESAI: Database Supabase siap digunakan untuk Wedding Planner Pro!
