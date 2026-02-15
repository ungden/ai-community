-- Migration: Allow authenticated users to create their own posts
-- Run this in Supabase SQL Editor

-- Drop the admin-only policy for posts if it exists
DROP POLICY IF EXISTS "Admins can manage posts" ON posts;

-- Create policy for users to create their own posts
CREATE POLICY "Users can create own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Create policy for users to update their own posts
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Create policy for users to delete their own posts
CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- Admins can still manage all posts
CREATE POLICY "Admins can manage all posts" ON posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_post_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from title (simplified - just lowercase and replace spaces)
  base_slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := substring(base_slug from 1 for 50);
  
  -- Add random suffix to ensure uniqueness
  final_slug := base_slug || '-' || substring(md5(random()::text) from 1 for 6);
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug
DROP TRIGGER IF EXISTS generate_post_slug_trigger ON posts;
CREATE TRIGGER generate_post_slug_trigger
  BEFORE INSERT ON posts
  FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '')
  EXECUTE FUNCTION generate_post_slug();

-- Auto-publish posts when created (for user posts)
CREATE OR REPLACE FUNCTION auto_publish_post()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS NULL OR NEW.status = 'draft' THEN
    NEW.status := 'published';
    NEW.published_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_publish_post_trigger ON posts;
CREATE TRIGGER auto_publish_post_trigger
  BEFORE INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION auto_publish_post();
