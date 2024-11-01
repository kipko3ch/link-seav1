-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reset_otp VARCHAR(6),
    reset_otp_expires TIMESTAMP WITH TIME ZONE,
    bio TEXT
);

-- Links table
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    position INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    click_count INTEGER DEFAULT 0,
    type VARCHAR(50)
);

-- Themes table
CREATE TABLE themes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(50) NOT NULL,
    background_color VARCHAR(7),
    text_color VARCHAR(7),
    accent_color VARCHAR(7),
    is_active BOOLEAN DEFAULT false
);

-- Click tracking table
CREATE TABLE clicks (
    id SERIAL PRIMARY KEY,
    link_id INTEGER REFERENCES links(id),
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT
);

-- Add click_count to links table
ALTER TABLE links ADD COLUMN click_count INTEGER DEFAULT 0;

-- Delete all existing users and reset the sequence
TRUNCATE users CASCADE;
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- Add UNIQUE constraint to username if not already present
ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username);

-- Add OTP fields to users table if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_otp VARCHAR(6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_otp_expires TIMESTAMP WITH TIME ZONE;

-- Update links table to include type
ALTER TABLE links ADD COLUMN IF NOT EXISTS type VARCHAR(50);

-- Clear all existing links and reset sequence
TRUNCATE links CASCADE;
ALTER SEQUENCE links_id_seq RESTART WITH 1;

-- Add bio column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add this function to clean up orphaned links
CREATE OR REPLACE FUNCTION cleanup_orphaned_links() RETURNS void AS $$
BEGIN
    -- Delete clicks for links that don't exist
    DELETE FROM clicks 
    WHERE link_id NOT IN (SELECT id FROM links);
    
    -- Delete links without valid users
    DELETE FROM links 
    WHERE user_id NOT IN (SELECT id FROM users);
END;
$$ LANGUAGE plpgsql;

-- Create an index to improve delete performance
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);

-- Modify the links table to cascade delete clicks
ALTER TABLE clicks
DROP CONSTRAINT clicks_link_id_fkey,
ADD CONSTRAINT clicks_link_id_fkey 
    FOREIGN KEY (link_id) 
    REFERENCES links(id) 
    ON DELETE CASCADE;

-- Modify the links table to cascade delete when user is deleted
ALTER TABLE links
DROP CONSTRAINT links_user_id_fkey,
ADD CONSTRAINT links_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE;