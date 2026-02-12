-- Phase 2B Database Schema Migration
-- This script creates and updates tables for Phase 2B features
-- Run this script in your PostgreSQL database

-- ============================================
-- 1. Create users table (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 2. Update creators table
-- ============================================

-- Add new columns if they don't exist
ALTER TABLE creators 
  ADD COLUMN IF NOT EXISTS display_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS tier VARCHAR(50) DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_creators_slug ON creators(slug);
CREATE INDEX IF NOT EXISTS idx_creators_user_id ON creators(user_id);

-- ============================================
-- 3. Update join_requests table
-- ============================================

-- Add new columns if they don't exist
ALTER TABLE join_requests
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_join_requests_creator_id ON join_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON join_requests(status);
CREATE INDEX IF NOT EXISTS idx_join_requests_created_at ON join_requests(created_at);

-- ============================================
-- 4. Create access_tokens table (new)
-- ============================================

CREATE TABLE IF NOT EXISTS access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  join_request_id UUID NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_join_request
    FOREIGN KEY(join_request_id) 
    REFERENCES join_requests(id)
    ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_access_tokens_join_request ON access_tokens(join_request_id);
CREATE INDEX IF NOT EXISTS idx_access_tokens_expires ON access_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON access_tokens(token);

-- ============================================
-- 5. Create updated_at trigger function
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to join_requests table
DROP TRIGGER IF EXISTS update_join_requests_updated_at ON join_requests;
CREATE TRIGGER update_join_requests_updated_at
  BEFORE UPDATE ON join_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. Insert sample data (optional, for testing)
-- ============================================

-- Insert a test user (password: 'password123' - bcrypt hash)
INSERT INTO users (id, email, password_hash, is_active)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'testcreator@example.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Insert a test creator
INSERT INTO creators (id, user_id, slug, display_name, bio, tier, is_active)
VALUES (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'testcreator',
  'Test Creator',
  'A test creator account for development and testing',
  'free',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 7. Verify installation
-- ============================================

-- Check table existence and row counts
DO $$
DECLARE
  users_count INT;
  creators_count INT;
  requests_count INT;
  tokens_count INT;
BEGIN
  SELECT COUNT(*) INTO users_count FROM users;
  SELECT COUNT(*) INTO creators_count FROM creators;
  SELECT COUNT(*) INTO requests_count FROM join_requests;
  SELECT COUNT(*) INTO tokens_count FROM access_tokens;
  
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Table counts:';
  RAISE NOTICE '  - users: %', users_count;
  RAISE NOTICE '  - creators: %', creators_count;
  RAISE NOTICE '  - join_requests: %', requests_count;
  RAISE NOTICE '  - access_tokens: %', tokens_count;
END $$;

-- ============================================
-- Migration complete!
-- ============================================
