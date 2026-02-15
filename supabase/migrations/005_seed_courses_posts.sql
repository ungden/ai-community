-- Seed Courses and Posts for Alex Le AI Community
-- NOTE: Replace 'ADMIN_USER_ID' with actual admin user UUID before running

-- =====================================================
-- COURSES - Organized by Category & Level
-- =====================================================

-- You need to replace this with your actual admin user ID
-- Get it from: SELECT id FROM profiles WHERE role = 'admin' LIMIT 1;
-- Or use the first user: SELECT id FROM profiles LIMIT 1;

DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Get admin user (or first user as fallback)
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
  IF admin_id IS NULL THEN
    SELECT id INTO admin_id FROM profiles LIMIT 1;
  END IF;
  
  -- Skip if no users exist
  IF admin_id IS NULL THEN
    RAISE NOTICE 'No users found. Please create a user first.';
    RETURN;
  END IF;

  -- =====================================================
  -- COURSES
  -- =====================================================

  -- ChatGPT Courses
  INSERT INTO courses (title, slug, description, category_id, instructor_id, required_tier, required_level, duration_minutes, lessons_count, status) VALUES
  
  -- FREE Courses (Level 1)
  ('ChatGPT cho người mới bắt đầu', 'chatgpt-co-ban',
   'Học cách sử dụng ChatGPT từ A-Z. Từ tạo tài khoản, viết prompt cơ bản đến các tính năng nâng cao.',
   '11111111-1111-1111-1111-111111111101', admin_id, 'free', 1, 120, 10, 'published'),
  
  ('10 Cách dùng ChatGPT hàng ngày', 'chatgpt-hang-ngay',
   'Các use case thực tế: viết email, tóm tắt văn bản, dịch thuật, brainstorm ý tưởng.',
   '11111111-1111-1111-1111-111111111101', admin_id, 'free', 1, 60, 5, 'published'),

  -- BASIC Courses (Level 2-3)
  ('Prompt Engineering 101', 'prompt-engineering-101',
   'Kỹ thuật viết prompt hiệu quả: Chain of Thought, Few-shot, Role-playing và các framework phổ biến.',
   '11111111-1111-1111-1111-111111111107', admin_id, 'basic', 2, 180, 12, 'published'),
  
  ('ChatGPT cho Content Creator', 'chatgpt-content-creator',
   'Viết blog, script YouTube, caption social media với ChatGPT. Bao gồm templates và workflows.',
   '11111111-1111-1111-1111-111111111101', admin_id, 'basic', 2, 150, 8, 'published'),

  ('Claude AI Masterclass', 'claude-masterclass',
   'Sử dụng Claude AI hiệu quả: xử lý documents dài, code projects, và so sánh với ChatGPT.',
   '11111111-1111-1111-1111-111111111102', admin_id, 'basic', 3, 120, 8, 'published'),

  -- PREMIUM Courses (Level 4+)
  ('AI Automation với Make', 'ai-automation-make',
   'Xây dựng workflows tự động với Make.com và AI. Từ cơ bản đến advanced scenarios.',
   '11111111-1111-1111-1111-111111111104', admin_id, 'premium', 4, 240, 15, 'published'),

  ('Midjourney Pro Guide', 'midjourney-pro',
   'Tạo hình ảnh chuyên nghiệp với Midjourney. Parameters, styles, workflows cho marketing.',
   '11111111-1111-1111-1111-111111111103', admin_id, 'premium', 4, 180, 12, 'published'),

  ('AI cho Marketing Team', 'ai-marketing-team',
   'Chiến lược AI cho team marketing: content, SEO, ads, social media, analytics.',
   '11111111-1111-1111-1111-111111111105', admin_id, 'premium', 5, 300, 20, 'published'),

  ('Advanced Prompt Engineering', 'advanced-prompt-engineering',
   'Kỹ thuật nâng cao: System prompts, Multi-turn conversations, RAG basics, Jailbreaking.',
   '11111111-1111-1111-1111-111111111107', admin_id, 'premium', 5, 240, 15, 'published'),

  ('Build AI Apps với Cursor', 'build-ai-apps-cursor',
   'Xây dựng ứng dụng với Cursor IDE và Claude. Từ idea đến deploy.',
   '11111111-1111-1111-1111-111111111106', admin_id, 'premium', 6, 360, 20, 'published');

  -- =====================================================
  -- SAMPLE POSTS
  -- =====================================================

  INSERT INTO posts (title, slug, content, excerpt, category_id, author_id, required_tier, status, is_pinned, published_at, likes, views) VALUES
  
  -- Pinned Welcome Post
  ('Chào mừng đến với Alex Le AI Community!', 'chao-mung-alex-le-ai',
   E'# Chào mừng các bạn mới! 👋\n\nĐây là cộng đồng học AI cho người đi làm. Mục tiêu của chúng ta:\n\n✅ **Tiết kiệm thời gian** - Học cách dùng AI để làm việc hiệu quả hơn\n✅ **Chia sẻ thực tế** - Case study từ các thành viên, không lý thuyết suông\n✅ **Hỗ trợ lẫn nhau** - Hỏi đáp, networking với những người cùng chí hướng\n\n## Quy tắc cộng đồng\n\n1. **Tôn trọng** - Mọi câu hỏi đều được welcome\n2. **Chia sẻ có giá trị** - Đừng spam, quảng cáo\n3. **Thực hành** - Học xong thì làm, chia sẻ kết quả\n\n## Bắt đầu từ đâu?\n\n1. Giới thiệu bản thân ở comment\n2. Xem khóa học "ChatGPT cho người mới"\n3. Tham gia thảo luận hàng ngày\n\nChúc các bạn học tốt! 🚀',
   'Giới thiệu về cộng đồng Alex Le AI và hướng dẫn cho thành viên mới.',
   '11111111-1111-1111-1111-111111111101', admin_id, 'free', 'published', true, NOW() - INTERVAL '30 days', 156, 2340),

  -- ChatGPT Posts
  ('5 Sai lầm phổ biến khi dùng ChatGPT', '5-sai-lam-chatgpt',
   E'Sau khi hướng dẫn hơn 500 người dùng ChatGPT, đây là 5 sai lầm tôi thấy nhiều nhất:\n\n## 1. Prompt quá ngắn\n\n❌ "Viết email"\n✅ "Viết email follow-up cho khách hàng đã demo sản phẩm cách đây 3 ngày. Tone chuyên nghiệp nhưng thân thiện. Mục tiêu: book meeting tiếp theo."\n\n## 2. Không cho context\n\nChatGPT không biết bạn là ai, làm gì. Hãy cho nó context!\n\n## 3. Không iterate\n\nĐừng expect perfect output lần đầu. Hãy refine dần.\n\n## 4. Copy paste không edit\n\nAI output là draft, không phải final. Luôn review và edit.\n\n## 5. Không dùng System Prompt\n\nCustom Instructions giúp ChatGPT hiểu bạn hơn.\n\n---\n\nBạn từng mắc sai lầm nào? Share ở comment nhé!',
   'Những lỗi thường gặp khi sử dụng ChatGPT và cách khắc phục.',
   '11111111-1111-1111-1111-111111111101', admin_id, 'free', 'published', false, NOW() - INTERVAL '5 days', 89, 1245),

  ('So sánh ChatGPT vs Claude vs Gemini 2024', 'so-sanh-chatgpt-claude-gemini',
   E'Update tháng 1/2024: So sánh 3 AI chatbot phổ biến nhất.\n\n## Tổng quan\n\n| Feature | ChatGPT | Claude | Gemini |\n|---------|---------|--------|--------|\n| Code | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |\n| Writing | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |\n| Context | 128K | 200K | 1M |\n| Price | $20 | $20 | $20 |\n\n## Khi nào dùng gì?\n\n**ChatGPT** - Đa năng, plugins, DALL-E\n**Claude** - Code dài, documents, writing\n**Gemini** - Google integration, multimodal\n\n## Kết luận\n\nKhông có AI nào tốt nhất cho mọi việc. Tôi dùng cả 3 tùy task.\n\nBạn đang dùng AI nào nhiều nhất?',
   'So sánh chi tiết ChatGPT, Claude và Gemini - ưu nhược điểm của từng tool.',
   '11111111-1111-1111-1111-111111111108', admin_id, 'free', 'published', false, NOW() - INTERVAL '3 days', 67, 890),

  -- Automation Posts
  ('Case Study: Tiết kiệm 10 tiếng/tuần với Make', 'case-study-make-automation',
   E'# Vấn đề\n\nTôi là Marketing Manager, mỗi tuần phải:\n- Tổng hợp leads từ 5 nguồn\n- Nhập vào CRM\n- Gửi email welcome\n- Báo cáo cho sales\n\n**Thời gian: ~10 tiếng/tuần**\n\n# Giải pháp với Make\n\n## Workflow 1: Lead Aggregation\n- Webhook từ Facebook Ads\n- Google Sheets từ website form\n- Telegram bot từ events\n→ Tất cả vào Airtable\n\n## Workflow 2: Auto Nurture\n- New lead trigger\n- AI classify (ChatGPT)\n- Auto assign to sales\n- Send personalized email\n\n# Kết quả\n\n✅ **10 tiếng → 30 phút** (review & exceptions)\n✅ Response time: 24h → 5 phút\n✅ ROI: $50/tháng Make → tiết kiệm $500 nhân công\n\n---\n\nAi muốn tôi share chi tiết workflow?',
   'Chia sẻ cách tôi tự động hóa quy trình marketing và tiết kiệm 10 tiếng mỗi tuần.',
   '11111111-1111-1111-1111-111111111104', admin_id, 'free', 'published', false, NOW() - INTERVAL '2 days', 124, 1567),

  -- Premium Post
  ('Advanced Prompting: Chain of Thought Techniques', 'advanced-chain-of-thought',
   E'# Chain of Thought Prompting\n\nKỹ thuật khiến AI "suy nghĩ từng bước" trước khi trả lời.\n\n## Basic CoT\n\n```\nLet''s think step by step:\n1. First, ...\n2. Then, ...\n3. Finally, ...\n```\n\n## Zero-shot CoT\n\nChỉ cần thêm "Let''s think step by step" vào cuối prompt.\n\n## Few-shot CoT\n\nCho ví dụ về cách reasoning:\n\n```\nQ: [question 1]\nA: Let''s break this down:\n- Step 1: ...\n- Step 2: ...\n- Therefore: [answer]\n\nQ: [your question]\nA:\n```\n\n## Tree of Thought\n\nExplore multiple reasoning paths...\n\n[Nội dung premium - xem đầy đủ khi nâng cấp]',
   'Kỹ thuật Chain of Thought giúp AI reasoning tốt hơn.',
   '11111111-1111-1111-1111-111111111107', admin_id, 'premium', 'published', false, NOW() - INTERVAL '1 day', 45, 234),

  -- Q&A Post
  ('Hỏi đáp: Làm sao để ChatGPT viết code tốt hơn?', 'hoi-dap-chatgpt-code',
   E'**Câu hỏi từ @member:**\n\n> Tôi dùng ChatGPT để code nhưng output hay bị lỗi, phải sửa nhiều. Có tips gì không?\n\n---\n\n**Trả lời:**\n\nCó vài tips giúp ChatGPT code tốt hơn:\n\n## 1. Specify tech stack rõ ràng\n\n"Dùng Python 3.11, FastAPI, SQLAlchemy 2.0"\n\n## 2. Provide context\n\n- File structure hiện tại\n- Dependencies đang dùng\n- Error message nếu có\n\n## 3. Ask for explanations\n\n"Explain each function and add comments"\n\n## 4. Request tests\n\n"Include unit tests with pytest"\n\n## 5. Iterate\n\nReview code → Provide feedback → Refine\n\n---\n\nBạn có thêm tips nào không? Share ở comment!',
   'Tips để ChatGPT viết code chính xác và ít lỗi hơn.',
   '11111111-1111-1111-1111-111111111110', admin_id, 'free', 'published', false, NOW() - INTERVAL '12 hours', 34, 456);

  -- =====================================================
  -- EVENTS
  -- =====================================================

  INSERT INTO events (title, description, event_type, start_time, duration_minutes, meeting_url, host_id, max_attendees, status) VALUES
  
  ('Weekly Q&A: Hỏi đáp về AI', 
   'Buổi livestream hàng tuần để trả lời mọi câu hỏi về AI, ChatGPT, Claude, và các tools khác.',
   'livestream',
   NOW() + INTERVAL '3 days' + TIME '19:00:00',
   60,
   'https://meet.google.com/abc-defg-hij',
   admin_id, 100, 'published'),

  ('Workshop: Automation với Make.com',
   'Hands-on workshop xây dựng automation workflow từ đầu. Mang theo laptop!',
   'workshop',
   NOW() + INTERVAL '7 days' + TIME '14:00:00',
   120,
   'https://zoom.us/j/123456789',
   admin_id, 50, 'published'),

  ('Webinar: AI Trends 2024',
   'Tổng hợp xu hướng AI quan trọng trong 2024 và predictions cho năm tới.',
   'webinar',
   NOW() + INTERVAL '14 days' + TIME '20:00:00',
   90,
   'https://meet.google.com/xyz-uvwx-rst',
   admin_id, 200, 'published');

  RAISE NOTICE 'Seed data created successfully with admin_id: %', admin_id;

END $$;
