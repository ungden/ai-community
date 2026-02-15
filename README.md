# Alex Le AI - Community Platform

Nền tảng cộng đồng học AI từ thực chiến - Skool.com clone với Next.js 15 + Supabase.

**Live Demo:** https://ai-community-platform-two.vercel.app  
**GitHub:** https://github.com/ungden/ai-community-platform

## Tính Năng Chính

### 🎯 Core Features
- **Community Feed** - Đăng bài, bình luận, like (giống Facebook)
- **Courses** - Khóa học AI với tiến độ tracking
- **AI Tools Catalogue** - Danh sách công cụ AI (ChatGPT, Claude, Midjourney...)
- **Events Calendar** - Lịch sự kiện với đăng ký tham gia
- **Leaderboards** - Bảng xếp hạng theo điểm
- **9-Level Gamification** - Người mới → Siêu sao

### 🔐 Authentication & Security
- Supabase Auth (Email, Google, Facebook)
- Row Level Security (RLS)
- Role-based access (Admin/Member)
- Protected routes middleware

### 💳 Payment
- Sepay webhook integration
- Subscription tiers: Free, Basic, Premium
- VN bank transfer support

### 🎨 UI/UX
- Facebook-style design (#1877f2 blue theme)
- Dark mode support
- Responsive (mobile-first)
- Framer Motion animations
- Toast notifications

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS 4
- **UI:** Lucide React icons
- **Animations:** Framer Motion
- **State:** React 19 hooks
- **Auth:** Supabase Auth
- **Payment:** Sepay

## Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/ungden/ai-community-platform.git
cd ai-community-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Tạo project mới tại [supabase.com](https://supabase.com)
2. Copy URL và Anon Key từ Settings → API
3. Tạo file `.env.local`:

```bash
cp .env.example .env.local
```

4. Điền thông tin vào `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Database Migrations

Vào Supabase Dashboard → SQL Editor, chạy lần lượt các file:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_comments_events.sql
supabase/migrations/003_user_posts_policy.sql
supabase/migrations/004_seed_content.sql
supabase/migrations/005_seed_courses_posts.sql
supabase/migrations/006_performance_indexes.sql
```

### 5. Configure Authentication (Optional)

**Google OAuth:**
1. Vào [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Tạo OAuth 2.0 Client ID
3. Thêm vào Supabase Dashboard → Authentication → Providers → Google

**Facebook OAuth:**
1. Vào [Facebook Developers](https://developers.facebook.com/apps)
2. Tạo App mới
3. Thêm vào Supabase Dashboard → Authentication → Providers → Facebook

### 6. Run Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## Build & Deploy

### Build Locally

```bash
npm run build
npm start
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ungden/ai-community-platform)

1. Push code lên GitHub
2. Connect repository với Vercel
3. Thêm Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy!

## Cấu Trúc Project

```
src/
├── app/                    # Next.js App Router
│   ├── community/          # Community feed (MAIN HOME)
│   ├── courses/            # Courses listing
│   ├── calendar/           # Events calendar
│   ├── leaderboards/       # Points ranking
│   ├── tools/              # AI tools catalogue
│   ├── profile/            # User profile
│   ├── admin/              # Admin panel (6 modules)
│   └── api/                # API routes
├── components/             # Reusable components
│   ├── MainLayout.tsx      # Main layout (Facebook-style)
│   ├── Toast.tsx           # Toast notifications
│   └── ...
├── lib/                    # Utilities
│   ├── supabase/           # Supabase clients
│   ├── translations/       # Vietnamese i18n
│   ├── database.types.ts   # TypeScript types
│   └── fallback-data.ts    # Fallback data
└── middleware.ts           # Auth middleware

supabase/
└── migrations/             # Database migrations (6 files)
```

## Database Schema

### Core Tables
- `profiles` - User profiles (extends auth.users)
- `posts` - Community posts
- `comments` - Nested comments
- `post_likes` - Post likes
- `categories` - Content categories
- `courses` - Course content
- `events` - Calendar events
- `event_attendees` - Event registrations
- `tools` - AI tools catalogue
- `subscriptions` - User subscriptions
- `payments` - Payment records

### Performance
- 18 indexes cho common queries
- RLS policies trên tất cả tables
- Optimized queries với proper joins

## API Routes

- `POST /api/posts` - Create post
- `GET /api/posts` - Get posts (paginated)
- `POST /api/comments` - Create comment
- `POST /api/likes` - Toggle like
- `POST /api/events` - Create event (admin only)
- `POST /api/events/register` - Register for event
- `POST /api/webhooks/sepay` - Payment webhook

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Features Roadmap

- [ ] Real-time notifications (Supabase Realtime)
- [ ] Direct messaging
- [ ] Course video player
- [ ] Quiz system
- [ ] Certificates
- [ ] Mobile app (React Native)

## Contributing

Pull requests are welcome! Đối với các thay đổi lớn, vui lòng mở issue trước.

## License

MIT

## Support

- Email: contact@alexle.ai
- Discord: [Join Community](https://discord.gg/alexle-ai)

---

Made with ❤️ by [Alex Le](https://github.com/ungden)
