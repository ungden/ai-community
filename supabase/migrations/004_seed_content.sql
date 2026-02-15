-- Seed Content for Alex Le AI Community Platform
-- Run this after the main schema is created

-- =====================================================
-- 1. UPDATE CATEGORIES (More specific AI topics)
-- =====================================================

-- Clear existing categories first (if re-running)
DELETE FROM categories;

INSERT INTO categories (id, name, slug, description, icon, color, order_index) VALUES
  -- Main AI Tools
  ('11111111-1111-1111-1111-111111111101', 'ChatGPT', 'chatgpt', 'Hướng dẫn sử dụng ChatGPT từ cơ bản đến nâng cao', '🤖', '#10a37f', 1),
  ('11111111-1111-1111-1111-111111111102', 'Claude AI', 'claude-ai', 'Anthropic Claude - AI assistant mạnh mẽ cho coding và writing', '🧠', '#7c3aed', 2),
  ('11111111-1111-1111-1111-111111111103', 'Midjourney & AI Art', 'ai-art', 'Tạo hình ảnh với Midjourney, DALL-E, Stable Diffusion', '🎨', '#ec4899', 3),
  ('11111111-1111-1111-1111-111111111104', 'Automation', 'automation', 'Tự động hóa với Make, Zapier, n8n và AI', '⚡', '#f59e0b', 4),
  ('11111111-1111-1111-1111-111111111105', 'AI cho Marketing', 'ai-marketing', 'Content marketing, SEO, Ads với AI', '📣', '#ef4444', 5),
  ('11111111-1111-1111-1111-111111111106', 'AI cho Developer', 'ai-dev', 'GitHub Copilot, Cursor, AI coding assistants', '💻', '#3b82f6', 6),
  ('11111111-1111-1111-1111-111111111107', 'Prompt Engineering', 'prompt-engineering', 'Kỹ thuật viết prompt hiệu quả', '✨', '#8b5cf6', 7),
  ('11111111-1111-1111-1111-111111111108', 'AI News & Trends', 'ai-news', 'Tin tức và xu hướng AI mới nhất', '📰', '#6366f1', 8),
  ('11111111-1111-1111-1111-111111111109', 'Case Study', 'case-study', 'Case study thực tế từ các thành viên', '📊', '#14b8a6', 9),
  ('11111111-1111-1111-1111-111111111110', 'Hỏi đáp', 'hoi-dap', 'Đặt câu hỏi và nhận hỗ trợ từ cộng đồng', '❓', '#f97316', 10);

-- =====================================================
-- 2. CREATE AI TOOLS TABLE
-- =====================================================

-- Create tools table if not exists
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  category TEXT, -- 'llm', 'image', 'audio', 'video', 'automation', 'coding', 'writing'
  pricing TEXT, -- 'free', 'freemium', 'paid'
  pricing_detail TEXT,
  features TEXT[], -- Array of key features
  use_cases TEXT[], -- Array of use cases
  pros TEXT[],
  cons TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Everyone can view tools (drop first to avoid duplicate)
DROP POLICY IF EXISTS "Tools are viewable by everyone" ON tools;
CREATE POLICY "Tools are viewable by everyone" ON tools
  FOR SELECT USING (true);

-- Only admins can manage tools (drop first to avoid duplicate)
DROP POLICY IF EXISTS "Admins can manage tools" ON tools;
CREATE POLICY "Admins can manage tools" ON tools
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- 3. SEED AI TOOLS DATA
-- =====================================================

INSERT INTO tools (name, slug, description, logo_url, website_url, category, pricing, pricing_detail, features, use_cases, pros, cons, rating, is_featured, order_index) VALUES

-- LLM Tools
('ChatGPT', 'chatgpt', 
 'AI chatbot phổ biến nhất thế giới từ OpenAI. Có thể trò chuyện, viết content, code, phân tích dữ liệu và nhiều hơn nữa.',
 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
 'https://chat.openai.com',
 'llm', 'freemium', 'Free: GPT-3.5 | Plus: $20/tháng (GPT-4)',
 ARRAY['Trò chuyện tự nhiên', 'Viết content', 'Code assistance', 'Phân tích file', 'Tạo hình ảnh DALL-E', 'Browse internet'],
 ARRAY['Viết email, blog, báo cáo', 'Học ngôn ngữ mới', 'Brainstorm ý tưởng', 'Debug code', 'Phân tích dữ liệu'],
 ARRAY['Dễ sử dụng', 'Đa năng', 'Cộng đồng lớn', 'Plugins phong phú'],
 ARRAY['GPT-4 cần trả phí', 'Giới hạn tin nhắn', 'Có thể hallucinate'],
 4.8, true, 1),

('Claude', 'claude',
 'AI assistant từ Anthropic. Nổi bật với khả năng xử lý context dài, code chính xác và an toàn hơn.',
 'https://www.anthropic.com/images/icons/apple-touch-icon.png',
 'https://claude.ai',
 'llm', 'freemium', 'Free: Claude 3 Haiku | Pro: $20/tháng (Sonnet, Opus)',
 ARRAY['Context window 200K tokens', 'Code chính xác', 'An toàn, không harmful', 'Phân tích documents', 'Artifacts (preview code)'],
 ARRAY['Viết code dài', 'Phân tích tài liệu PDF', 'Research paper', 'Copywriting chuyên nghiệp'],
 ARRAY['Context dài nhất', 'Code quality cao', 'Ít hallucinate', 'Artifacts hữu ích'],
 ARRAY['Ít plugins hơn ChatGPT', 'Không tạo hình ảnh', 'Chưa có voice'],
 4.7, true, 2),

('Gemini', 'gemini',
 'AI từ Google với khả năng multimodal - hiểu text, hình ảnh, video và audio.',
 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
 'https://gemini.google.com',
 'llm', 'freemium', 'Free: Gemini | Advanced: $20/tháng',
 ARRAY['Multimodal (text, image, video)', 'Tích hợp Google services', 'Real-time info', 'Code execution'],
 ARRAY['Research với Google', 'Phân tích hình ảnh', 'Tích hợp Gmail, Docs', 'Dịch thuật'],
 ARRAY['Free mạnh', 'Tích hợp Google ecosystem', 'Multimodal tốt'],
 ARRAY['Đôi khi chậm', 'Output ngắn hơn', 'Ít popular hơn ChatGPT'],
 4.3, true, 3),

('Perplexity', 'perplexity',
 'AI search engine - trả lời câu hỏi với nguồn trích dẫn rõ ràng từ internet.',
 'https://www.perplexity.ai/favicon.ico',
 'https://perplexity.ai',
 'llm', 'freemium', 'Free: 5 Pro searches/ngày | Pro: $20/tháng',
 ARRAY['Search với citations', 'Real-time data', 'Academic mode', 'File upload', 'Focus modes'],
 ARRAY['Research nhanh', 'Fact-checking', 'Tin tức mới nhất', 'Academic research'],
 ARRAY['Có nguồn trích dẫn', 'Thông tin real-time', 'Giao diện đẹp'],
 ARRAY['Giới hạn Pro searches', 'Không chat dài', 'Không tạo content dài'],
 4.5, true, 4),

-- Image Generation
('Midjourney', 'midjourney',
 'AI tạo hình ảnh chất lượng cao nhất hiện tại. Chạy qua Discord.',
 'https://www.midjourney.com/favicon.ico',
 'https://midjourney.com',
 'image', 'paid', 'Basic: $10/tháng | Standard: $30/tháng | Pro: $60/tháng',
 ARRAY['Hình ảnh siêu đẹp', 'Nhiều style', 'Vary/Upscale', 'Pan/Zoom', 'Style reference'],
 ARRAY['Marketing visuals', 'Product mockup', 'Art concept', 'Social media content'],
 ARRAY['Chất lượng tốt nhất', 'Style độc đáo', 'Cộng đồng active'],
 ARRAY['Phải dùng Discord', 'Không edit được', 'Khó control chính xác'],
 4.9, true, 5),

('DALL-E 3', 'dalle-3',
 'AI tạo hình ảnh từ OpenAI, tích hợp trong ChatGPT Plus. Follow prompt chính xác.',
 'https://openai.com/favicon.ico',
 'https://openai.com/dall-e-3',
 'image', 'paid', 'Qua ChatGPT Plus: $20/tháng',
 ARRAY['Follow prompt chính xác', 'Tạo text trong ảnh', 'Tích hợp ChatGPT', 'Edit với prompt'],
 ARRAY['Marketing banners', 'Blog thumbnails', 'Social posts', 'Presentations'],
 ARRAY['Follow prompt tốt', 'Tạo text được', 'Dễ sử dụng'],
 ARRAY['Cần ChatGPT Plus', 'Ít style hơn MJ', 'Giới hạn số ảnh'],
 4.4, false, 6),

('Stable Diffusion', 'stable-diffusion',
 'Open-source AI image generation. Có thể chạy local, customize model.',
 'https://stability.ai/favicon.ico',
 'https://stability.ai',
 'image', 'freemium', 'Free (local) | DreamStudio credits',
 ARRAY['Open source', 'Chạy local', 'Custom models', 'ControlNet', 'Inpainting'],
 ARRAY['Batch generation', 'Custom style', 'Product photos', 'Game assets'],
 ARRAY['Free local', 'Highly customizable', 'No censorship'],
 ARRAY['Cần GPU mạnh', 'Setup phức tạp', 'Quality không bằng MJ'],
 4.2, false, 7),

-- Automation
('Make (Integromat)', 'make',
 'Nền tảng automation no-code mạnh mẽ. Kết nối hàng ngàn apps với nhau.',
 'https://www.make.com/favicon.ico',
 'https://make.com',
 'automation', 'freemium', 'Free: 1000 ops/tháng | Core: $9/tháng | Pro: $16/tháng',
 ARRAY['Visual workflow builder', '1000+ apps', 'Webhooks', 'HTTP requests', 'Data manipulation'],
 ARRAY['Lead automation', 'Social media posting', 'Data sync', 'Email workflows'],
 ARRAY['Giao diện trực quan', 'Giá hợp lý', 'Nhiều apps', 'Flexible'],
 ARRAY['Learning curve', 'Debugging khó', 'Giới hạn free'],
 4.6, true, 8),

('Zapier', 'zapier',
 'Automation tool phổ biến nhất. Dễ dùng, tích hợp với gần như mọi app.',
 'https://zapier.com/favicon.ico',
 'https://zapier.com',
 'automation', 'freemium', 'Free: 100 tasks/tháng | Starter: $19.99/tháng',
 ARRAY['5000+ apps', 'Multi-step Zaps', 'Filters & Paths', 'AI actions', 'Tables'],
 ARRAY['CRM automation', 'Email marketing', 'Notifications', 'Data entry'],
 ARRAY['Dễ sử dụng nhất', 'Nhiều apps nhất', 'Reliable'],
 ARRAY['Đắt hơn Make', 'Less flexible', 'Giới hạn steps'],
 4.5, true, 9),

('n8n', 'n8n',
 'Open-source automation platform. Self-host được, không giới hạn workflows.',
 'https://n8n.io/favicon.ico',
 'https://n8n.io',
 'automation', 'freemium', 'Self-host: Free | Cloud: từ €20/tháng',
 ARRAY['Open source', 'Self-hostable', 'Code nodes', 'Unlimited workflows', 'AI nodes'],
 ARRAY['Complex workflows', 'Data processing', 'AI pipelines', 'DevOps automation'],
 ARRAY['Free self-host', 'Unlimited workflows', 'Code flexibility'],
 ARRAY['Setup phức tạp', 'Ít apps hơn', 'Community nhỏ hơn'],
 4.3, false, 10),

-- Coding
('GitHub Copilot', 'github-copilot',
 'AI pair programmer từ GitHub/Microsoft. Autocomplete code trong IDE.',
 'https://github.com/favicon.ico',
 'https://github.com/features/copilot',
 'coding', 'paid', 'Individual: $10/tháng | Business: $19/user/tháng',
 ARRAY['Code autocomplete', 'Chat in IDE', 'Multi-language', 'Test generation', 'Docs generation'],
 ARRAY['Viết code nhanh hơn', 'Learn new languages', 'Generate tests', 'Refactoring'],
 ARRAY['Tích hợp IDE tốt', 'Nhanh', 'Multi-language'],
 ARRAY['Subscription bắt buộc', 'Đôi khi sai', 'Privacy concerns'],
 4.6, true, 11),

('Cursor', 'cursor',
 'AI-first code editor. Fork từ VS Code với AI tích hợp sâu.',
 'https://cursor.sh/favicon.ico',
 'https://cursor.sh',
 'coding', 'freemium', 'Free: 2000 completions | Pro: $20/tháng',
 ARRAY['AI chat trong editor', 'Codebase understanding', 'Multi-file edits', 'Terminal AI', '@mentions'],
 ARRAY['Refactor lớn', 'Debug với AI', 'Code review', 'New projects'],
 ARRAY['AI tích hợp sâu', 'Hiểu cả codebase', 'UI đẹp'],
 ARRAY['Mới, còn bugs', 'Resource heavy', 'Subscription'],
 4.7, true, 12),

('Replit', 'replit',
 'Online IDE với AI Ghostwriter. Code, deploy và collaborate trên browser.',
 'https://replit.com/favicon.ico',
 'https://replit.com',
 'coding', 'freemium', 'Free tier | Hacker: $7/tháng | Pro: $20/tháng',
 ARRAY['Browser IDE', 'AI Ghostwriter', 'Instant deploy', 'Multiplayer coding', 'Mobile app'],
 ARRAY['Học code', 'Quick prototypes', 'Collaborative coding', 'Hackathons'],
 ARRAY['Không cần setup', 'Deploy dễ', 'Học tốt'],
 ARRAY['Performance', 'Limited resources', 'Not for large projects'],
 4.2, false, 13),

-- Writing
('Jasper', 'jasper',
 'AI writing assistant cho marketing. Templates cho mọi loại content.',
 'https://www.jasper.ai/favicon.ico',
 'https://jasper.ai',
 'writing', 'paid', 'Creator: $39/tháng | Pro: $59/tháng',
 ARRAY['Marketing templates', 'Brand voice', 'SEO mode', 'Art generation', 'Browser extension'],
 ARRAY['Blog posts', 'Ad copy', 'Social media', 'Email campaigns'],
 ARRAY['Marketing-focused', 'Nhiều templates', 'Brand consistency'],
 ARRAY['Đắt', 'Overkill cho cá nhân', 'Learning curve'],
 4.3, false, 14),

('Copy.ai', 'copyai',
 'AI copywriting tool. Tạo content marketing nhanh chóng.',
 'https://www.copy.ai/favicon.ico',
 'https://copy.ai',
 'writing', 'freemium', 'Free: 2000 words/tháng | Pro: $36/tháng',
 ARRAY['90+ templates', 'Multiple languages', 'Brand voice', 'Workflows', 'Chat'],
 ARRAY['Social posts', 'Product descriptions', 'Email subject lines', 'Ad copy'],
 ARRAY['Dễ sử dụng', 'Free tier tốt', 'Nhiều templates'],
 ARRAY['Output cần edit', 'Giới hạn free', 'Ít SEO features'],
 4.1, false, 15),

-- Audio/Video
('ElevenLabs', 'elevenlabs',
 'AI voice generation chất lượng cao. Clone voice, text-to-speech.',
 'https://elevenlabs.io/favicon.ico',
 'https://elevenlabs.io',
 'audio', 'freemium', 'Free: 10K chars/tháng | Starter: $5/tháng | Creator: $22/tháng',
 ARRAY['Realistic voices', 'Voice cloning', 'Multiple languages', 'API access', 'Projects'],
 ARRAY['Voiceover', 'Audiobooks', 'Video narration', 'Podcasts'],
 ARRAY['Chất lượng tốt nhất', 'Voice clone tốt', 'Nhiều ngôn ngữ'],
 ARRAY['Đắt cho volume lớn', 'Clone cần samples', 'Rate limits'],
 4.7, true, 16),

('HeyGen', 'heygen',
 'AI video generation với avatars. Tạo video từ text với người thật.',
 'https://www.heygen.com/favicon.ico',
 'https://heygen.com',
 'video', 'paid', 'Creator: $24/tháng | Business: $72/tháng',
 ARRAY['AI avatars', 'Text to video', 'Multiple languages', 'Custom avatars', 'Templates'],
 ARRAY['Training videos', 'Marketing videos', 'Personalized videos', 'Presentations'],
 ARRAY['Realistic avatars', 'Easy to use', 'Multi-language'],
 ARRAY['Đắt', 'Limited customization', 'Uncanny valley'],
 4.4, false, 17),

('Runway', 'runway',
 'AI video editing và generation. Gen-2 text-to-video, video-to-video.',
 'https://runwayml.com/favicon.ico',
 'https://runwayml.com',
 'video', 'freemium', 'Free trial | Standard: $12/tháng | Pro: $28/tháng',
 ARRAY['Gen-2 text-to-video', 'Video-to-video', 'Image-to-video', 'Motion brush', 'Green screen'],
 ARRAY['Film production', 'Music videos', 'Social content', 'VFX'],
 ARRAY['Cutting-edge tech', 'Creative freedom', 'Growing features'],
 ARRAY['Credit system', 'Quality varies', 'Slow generation'],
 4.5, false, 18);

-- =====================================================
-- 4. ADD COURSES TABLE EXTENSION (required_level column)
-- =====================================================

-- Add required_level column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'required_level') THEN
    ALTER TABLE courses ADD COLUMN required_level INTEGER DEFAULT 1;
  END IF;
END $$;

-- Add is_pinned to posts if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'is_pinned') THEN
    ALTER TABLE posts ADD COLUMN is_pinned BOOLEAN DEFAULT false;
  END IF;
END $$;

-- =====================================================
-- 5. CREATE TOOLS INDEX
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(is_featured);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);

-- =====================================================
-- Done! Run this in Supabase SQL Editor
-- =====================================================
