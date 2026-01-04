-- ==========================================
-- SUPABASE DATABASE SCHEMA
-- Naotica Studio
-- ==========================================
-- Cara pakai:
-- 1. Buka Supabase Dashboard
-- 2. Pergi ke SQL Editor
-- 3. Copy-paste seluruh file ini
-- 4. Klik "Run"
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USAGE LOGS TABLE
-- Menyimpan log penggunaan API
-- ==========================================
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool VARCHAR(50) NOT NULL, -- 'downloader', 'chatbot', 'upscaler', 'bgremover'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    referrer TEXT,
    ip_hash VARCHAR(64), -- Hashed IP for privacy
    success BOOLEAN DEFAULT TRUE,
    metadata JSONB -- Additional data if needed
);

-- Index for faster queries
CREATE INDEX idx_usage_logs_tool ON usage_logs(tool);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at DESC);

-- ==========================================
-- PROJECTS TABLE
-- Portfolio projects untuk galeri
-- ==========================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    link TEXT,
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for featured projects
CREATE INDEX idx_projects_featured ON projects(featured);

-- ==========================================
-- SERVICES TABLE
-- Work experience/services untuk homepage
-- ==========================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_name VARCHAR(255) NOT NULL,
    description TEXT,
    start_year INT NOT NULL,
    end_year INT, -- NULL means "Now"/ongoing
    link TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for services display order
CREATE INDEX idx_services_display_order ON services(display_order);

-- ==========================================
-- SETTINGS TABLE
-- Global app settings
-- ==========================================
CREATE TABLE IF NOT EXISTS settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
    total_hits INT DEFAULT 0,
    site_name VARCHAR(255) DEFAULT 'Naotica Studio',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (id, total_hits, site_name) 
VALUES ('main', 0, 'Naotica Studio')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- ADMIN SESSIONS TABLE
-- Secure admin sessions
-- ==========================================
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for token lookup
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- Mengamankan data
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Public can read projects (for portfolio display)
CREATE POLICY "Public can view projects" ON projects
    FOR SELECT USING (true);

-- Only service role can modify projects
CREATE POLICY "Service role can manage projects" ON projects
    FOR ALL USING (auth.role() = 'service_role');

-- Public can read services (for homepage display)
CREATE POLICY "Public can view services" ON services
    FOR SELECT USING (true);

-- Only service role can modify services
CREATE POLICY "Service role can manage services" ON services
    FOR ALL USING (auth.role() = 'service_role');

-- Only service role can access usage_logs
CREATE POLICY "Service role can manage usage_logs" ON usage_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Only service role can access settings
CREATE POLICY "Service role can manage settings" ON settings
    FOR ALL USING (auth.role() = 'service_role');

-- Only service role can access admin_sessions
CREATE POLICY "Service role can manage admin_sessions" ON admin_sessions
    FOR ALL USING (auth.role() = 'service_role');

-- ==========================================
-- FUNCTIONS
-- Helper functions
-- ==========================================

-- Function to increment total hits
CREATE OR REPLACE FUNCTION increment_total_hits()
RETURNS void AS $$
BEGIN
    UPDATE settings 
    SET total_hits = total_hits + 1,
        updated_at = NOW()
    WHERE id = 'main';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log API usage
CREATE OR REPLACE FUNCTION log_api_usage(
    p_tool VARCHAR,
    p_user_agent TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL,
    p_ip_hash VARCHAR DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE
)
RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO usage_logs (tool, user_agent, referrer, ip_hash, success)
    VALUES (p_tool, p_user_agent, p_referrer, p_ip_hash, p_success)
    RETURNING id INTO new_id;
    
    -- Also increment total hits
    PERFORM increment_total_hits();
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- SAMPLE DATA (Optional)
-- Hapus jika tidak perlu
-- ==========================================

-- Sample projects
INSERT INTO projects (title, description, image_url, link, tags, featured, display_order) VALUES
('All-in-One Downloader', 'Download videos from multiple platforms', NULL, '/tools', ARRAY['tool', 'video', 'download'], true, 1),
('AI Chatbot', 'Powered by DeepSeek AI', NULL, '/tools', ARRAY['ai', 'chat', 'deepseek'], true, 2),
('Image Tools', 'Upscale and remove backgrounds', NULL, '/tools', ARRAY['image', 'ai', 'tool'], true, 3)
ON CONFLICT DO NOTHING;

-- ==========================================
-- DONE!
-- Schema berhasil dibuat
-- ==========================================
