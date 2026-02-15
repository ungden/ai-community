-- Comments table for posts
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, comment_id)
);

-- Events table for calendar
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL DEFAULT 'livestream', -- livestream, workshop, meetup, webinar
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 60,
  location VARCHAR(255),
  meeting_url VARCHAR(500),
  cover_image VARCHAR(500),
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  max_attendees INTEGER,
  required_tier VARCHAR(20) DEFAULT 'free',
  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, live, ended, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'registered', -- registered, attended, cancelled
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- Add level column to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Add required_level to courses for level-locked courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS required_level INTEGER DEFAULT 1;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_host_id ON events(host_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);

-- Function to update user level based on points
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := CASE
    WHEN NEW.points >= 33015 THEN 9
    WHEN NEW.points >= 8015 THEN 8
    WHEN NEW.points >= 2015 THEN 7
    WHEN NEW.points >= 515 THEN 6
    WHEN NEW.points >= 155 THEN 5
    WHEN NEW.points >= 65 THEN 4
    WHEN NEW.points >= 20 THEN 3
    WHEN NEW.points >= 5 THEN 2
    ELSE 1
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update level when points change
DROP TRIGGER IF EXISTS trigger_update_user_level ON profiles;
CREATE TRIGGER trigger_update_user_level
  BEFORE INSERT OR UPDATE OF points ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- Function to add points when post/comment is liked
CREATE OR REPLACE FUNCTION add_points_on_like()
RETURNS TRIGGER AS $$
BEGIN
  -- Add 1 point to the author
  IF TG_TABLE_NAME = 'post_likes' THEN
    UPDATE profiles 
    SET points = points + 1 
    WHERE id = (SELECT author_id FROM posts WHERE id = NEW.post_id);
  ELSIF TG_TABLE_NAME = 'comment_likes' THEN
    UPDATE profiles 
    SET points = points + 1 
    WHERE id = (SELECT user_id FROM comments WHERE id = NEW.comment_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to remove points when like is removed
CREATE OR REPLACE FUNCTION remove_points_on_unlike()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'post_likes' THEN
    UPDATE profiles 
    SET points = GREATEST(0, points - 1) 
    WHERE id = (SELECT author_id FROM posts WHERE id = OLD.post_id);
  ELSIF TG_TABLE_NAME = 'comment_likes' THEN
    UPDATE profiles 
    SET points = GREATEST(0, points - 1) 
    WHERE id = (SELECT user_id FROM comments WHERE id = OLD.comment_id);
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers for post likes
DROP TRIGGER IF EXISTS trigger_add_points_post_like ON post_likes;
CREATE TRIGGER trigger_add_points_post_like
  AFTER INSERT ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION add_points_on_like();

DROP TRIGGER IF EXISTS trigger_remove_points_post_unlike ON post_likes;
CREATE TRIGGER trigger_remove_points_post_unlike
  AFTER DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION remove_points_on_unlike();

-- Triggers for comment likes
DROP TRIGGER IF EXISTS trigger_add_points_comment_like ON comment_likes;
CREATE TRIGGER trigger_add_points_comment_like
  AFTER INSERT ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION add_points_on_like();

DROP TRIGGER IF EXISTS trigger_remove_points_comment_unlike ON comment_likes;
CREATE TRIGGER trigger_remove_points_comment_unlike
  AFTER DELETE ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION remove_points_on_unlike();

-- Update likes count on posts when post_likes changes
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes = likes + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes = GREATEST(0, likes - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON post_likes;
CREATE TRIGGER trigger_update_post_likes_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

-- Update likes count on comments
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET likes = likes + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET likes = GREATEST(0, likes - 1) WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_comment_likes_count ON comment_likes;
CREATE TRIGGER trigger_update_comment_likes_count
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_likes_count();

-- RLS Policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Comment likes policies
CREATE POLICY "Comment likes are viewable by everyone" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like comments" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike comments" ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can insert events" ON events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update events" ON events FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete events" ON events FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Event attendees policies
CREATE POLICY "Event attendees are viewable by everyone" ON event_attendees FOR SELECT USING (true);
CREATE POLICY "Users can register for events" ON event_attendees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel their registration" ON event_attendees FOR DELETE USING (auth.uid() = user_id);
