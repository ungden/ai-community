-- =====================================================
-- Multi-Group System Migration
-- Adds groups, group_members tables
-- Links posts, courses, events to groups
-- =====================================================

-- Create group privacy type
CREATE TYPE group_privacy AS ENUM ('public', 'private');
CREATE TYPE group_member_role AS ENUM ('owner', 'admin', 'moderator', 'member');

-- =====================================================
-- GROUPS TABLE
-- =====================================================
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  about TEXT, -- detailed about section
  cover_image TEXT,
  icon_emoji TEXT DEFAULT '🚀',
  color TEXT DEFAULT '#1877f2',
  privacy group_privacy DEFAULT 'public',
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  course_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  required_tier subscription_tier DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- =====================================================
-- GROUP MEMBERS TABLE
-- =====================================================
CREATE TABLE group_members (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role group_member_role DEFAULT 'member',
  points_in_group INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- =====================================================
-- ADD group_id TO EXISTING TABLES
-- =====================================================
ALTER TABLE posts ADD COLUMN group_id UUID REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE courses ADD COLUMN group_id UUID REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE events ADD COLUMN group_id UUID REFERENCES groups(id) ON DELETE CASCADE;

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_groups_slug ON groups(slug);
CREATE INDEX idx_groups_owner ON groups(owner_id);
CREATE INDEX idx_groups_featured ON groups(is_featured) WHERE is_featured = true;
CREATE INDEX idx_groups_privacy ON groups(privacy);
CREATE INDEX idx_groups_created ON groups(created_at DESC);

CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_role ON group_members(group_id, role);
CREATE INDEX idx_group_members_points ON group_members(group_id, points_in_group DESC);

CREATE INDEX idx_posts_group ON posts(group_id);
CREATE INDEX idx_courses_group ON courses(group_id);
CREATE INDEX idx_events_group ON events(group_id);

-- =====================================================
-- TRIGGERS: Auto-update member_count
-- =====================================================
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_group_member_change
  AFTER INSERT OR DELETE ON group_members
  FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- =====================================================
-- TRIGGERS: Auto-update post_count
-- =====================================================
CREATE OR REPLACE FUNCTION update_group_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.group_id IS NOT NULL THEN
    UPDATE groups SET post_count = post_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' AND OLD.group_id IS NOT NULL THEN
    UPDATE groups SET post_count = post_count - 1 WHERE id = OLD.group_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_group_change
  AFTER INSERT OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_group_post_count();

-- =====================================================
-- TRIGGERS: Auto-update course_count
-- =====================================================
CREATE OR REPLACE FUNCTION update_group_course_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.group_id IS NOT NULL THEN
    UPDATE groups SET course_count = course_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' AND OLD.group_id IS NOT NULL THEN
    UPDATE groups SET course_count = course_count - 1 WHERE id = OLD.group_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_course_group_change
  AFTER INSERT OR DELETE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_group_course_count();

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Groups: public groups visible to everyone
CREATE POLICY "Public groups are viewable by everyone" ON groups
  FOR SELECT USING (privacy = 'public');

-- Groups: members can see private groups they belong to
CREATE POLICY "Members can view their private groups" ON groups
  FOR SELECT USING (
    privacy = 'private' AND EXISTS (
      SELECT 1 FROM group_members WHERE group_id = id AND user_id = auth.uid()
    )
  );

-- Groups: admins can manage all groups
CREATE POLICY "Admins can manage groups" ON groups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Group members: viewable by everyone (for public groups)
CREATE POLICY "Group members are viewable" ON group_members
  FOR SELECT USING (true);

-- Group members: users can join/leave
CREATE POLICY "Users can join groups" ON group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" ON group_members
  FOR DELETE USING (auth.uid() = user_id);

-- Group members: group admins can manage members
CREATE POLICY "Group admins can manage members" ON group_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM group_members gm 
      WHERE gm.group_id = group_id 
      AND gm.user_id = auth.uid() 
      AND gm.role IN ('owner', 'admin')
    )
  );

-- =====================================================
-- SEED: Default group (migrate existing content)
-- =====================================================
-- NOTE: Run this after migration. Replace 'ADMIN_USER_ID' with actual admin user ID.
-- This will be handled by the application when first admin creates a group.

-- Insert a default group
INSERT INTO groups (name, slug, description, about, icon_emoji, color, privacy, owner_id, is_featured)
SELECT 
  'Alex Le AI',
  'alex-le-ai',
  'Cộng đồng học AI cho người đi làm',
  'Cộng đồng học AI cho người đi làm. Chia sẻ case study thực tế về ChatGPT, Claude, Midjourney, Make và các AI tools khác. Từ người mới đến chuyên gia, tất cả đều được chào đón!',
  '🚀',
  '#1877f2',
  'public',
  id,
  true
FROM profiles WHERE role = 'admin' LIMIT 1;

-- Migrate existing posts to default group
UPDATE posts SET group_id = (SELECT id FROM groups WHERE slug = 'alex-le-ai' LIMIT 1)
WHERE group_id IS NULL;

-- Migrate existing courses to default group
UPDATE courses SET group_id = (SELECT id FROM groups WHERE slug = 'alex-le-ai' LIMIT 1)
WHERE group_id IS NULL;

-- Migrate existing events to default group
UPDATE events SET group_id = (SELECT id FROM groups WHERE slug = 'alex-le-ai' LIMIT 1)
WHERE group_id IS NULL;

-- Add all existing members to default group
INSERT INTO group_members (group_id, user_id, role, points_in_group)
SELECT 
  (SELECT id FROM groups WHERE slug = 'alex-le-ai' LIMIT 1),
  p.id,
  CASE WHEN p.role = 'admin' THEN 'owner'::group_member_role ELSE 'member'::group_member_role END,
  p.points
FROM profiles p
ON CONFLICT DO NOTHING;
