-- Performance indexes for common query patterns
-- Run this in Supabase SQL Editor

-- Post likes lookup (for checking if user liked a post)
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_post ON post_likes(user_id, post_id);

-- Comments lookup by post
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- Events lookup by start time (upcoming events)
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- Event attendees lookup
CREATE INDEX IF NOT EXISTS idx_event_attendees_event ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_event ON event_attendees(user_id, event_id);

-- Subscriptions lookup
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_payment_ref ON subscriptions(payment_ref);

-- Posts listing (published, by date)
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Profiles leaderboard
CREATE INDEX IF NOT EXISTS idx_profiles_points ON profiles(points DESC);

-- Tools catalogue
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(is_featured DESC, order_index ASC);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);

-- Course progress
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user ON user_course_progress(user_id);
