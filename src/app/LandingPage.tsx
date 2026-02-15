'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  Trophy,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe,
  Lock,
  Sparkles,
  Clock,
  Zap,
  Star,
  ArrowRight,
  Search,
  ChevronRight
} from 'lucide-react'

interface PostAuthor {
  id: string
  full_name: string | null
  username: string | null
  role: string
  points: number
}

interface PreviewPost {
  id: string
  title: string | null
  content: string
  excerpt: string | null
  likes: number
  views: number
  is_pinned: boolean
  published_at: string
  author: PostAuthor | null
}

interface TopMember {
  id: string
  full_name: string | null
  username: string | null
  points: number
  role: string
  subscription_tier: string
}

interface GroupPreview {
  id: string
  name: string
  slug: string
  description: string | null
  icon_emoji: string
  color: string
  member_count: number
  post_count: number
  course_count: number
  privacy: string
  required_tier: string
  is_featured: boolean
}

interface LandingPageProps {
  user: null
  memberCount: number
  postCount: number
  courseCount: number
  posts: PreviewPost[]
  topMembers: TopMember[]
  onlineCount: number
  groups?: GroupPreview[]
}

type TabId = 'community' | 'groups' | 'classroom' | 'tools' | 'calendar' | 'leaderboards'

const tabs: { id: TabId; label: string; icon: typeof MessageSquare }[] = [
  { id: 'community', label: 'Cộng đồng', icon: MessageSquare },
  { id: 'groups', label: 'Nhóm', icon: Users },
  { id: 'classroom', label: 'Khóa học', icon: BookOpen },
  { id: 'tools', label: 'AI Tools', icon: Sparkles },
  { id: 'calendar', label: 'Lịch', icon: Calendar },
  { id: 'leaderboards', label: 'Xếp hạng', icon: Trophy },
]

// Avatar emojis based on index for consistent display
const AVATAR_EMOJIS = ['🧑‍💻', '👨‍💼', '👩‍🎨', '👨‍🔬', '👩‍💻', '👨‍🎓', '👩‍🔧', '🧑‍🏫', '👨‍⚕️', '👩‍🚀']

// Helper to get level from points
const getLevelFromPoints = (points: number): number => {
  if (points >= 10000) return 9
  if (points >= 5000) return 8
  if (points >= 2500) return 7
  if (points >= 1200) return 6
  if (points >= 600) return 5
  if (points >= 300) return 4
  if (points >= 100) return 3
  if (points >= 30) return 2
  return 1
}

const getLevelName = (level: number) => {
  const names = ['', 'Người mới', 'Học viên', 'Thành viên', 'Tích cực', 'Contributor', 'Expert', 'Master', 'Legend', 'Admin']
  return names[level] || ''
}

// Helper to format time ago
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`
  return date.toLocaleDateString('vi-VN')
}

// Sample data for tabs that don't have real data yet
const SAMPLE_COURSES = [
  { id: '1', title: 'ChatGPT từ Zero đến Hero', emoji: '🤖', lessons: 24, duration: '6 giờ', level: 'Cơ bản', tier: 'free' },
  { id: '2', title: 'Prompt Engineering Masterclass', emoji: '✍️', lessons: 18, duration: '4.5 giờ', level: 'Trung bình', tier: 'free' },
  { id: '3', title: 'Automation với Make.com', emoji: '⚡', lessons: 32, duration: '8 giờ', level: 'Trung bình', tier: 'basic' },
  { id: '4', title: 'AI cho Marketing & Sales', emoji: '📈', lessons: 20, duration: '5 giờ', level: 'Cơ bản', tier: 'free' },
  { id: '5', title: 'Claude AI Advanced Techniques', emoji: '🧠', lessons: 15, duration: '4 giờ', level: 'Nâng cao', tier: 'premium' },
  { id: '6', title: 'Midjourney & AI Art', emoji: '🎨', lessons: 28, duration: '7 giờ', level: 'Cơ bản', tier: 'basic' },
]

const SAMPLE_TOOLS = [
  { id: '1', name: 'ChatGPT', emoji: '🤖', category: 'Chatbot', pricing: 'Freemium', desc: 'AI chatbot đa năng từ OpenAI' },
  { id: '2', name: 'Claude', emoji: '🧠', category: 'Chatbot', pricing: 'Freemium', desc: 'AI assistant từ Anthropic, mạnh về phân tích' },
  { id: '3', name: 'Midjourney', emoji: '🎨', category: 'Image', pricing: 'Paid', desc: 'Tạo ảnh chất lượng cao từ text prompt' },
  { id: '4', name: 'Make.com', emoji: '⚡', category: 'Automation', pricing: 'Freemium', desc: 'Nền tảng automation no-code mạnh mẽ' },
  { id: '5', name: 'Cursor', emoji: '💻', category: 'Coding', pricing: 'Freemium', desc: 'AI code editor tăng tốc coding 10x' },
  { id: '6', name: 'Perplexity', emoji: '🔍', category: 'Search', pricing: 'Freemium', desc: 'AI search engine thông minh' },
]

const SAMPLE_EVENTS = [
  { id: '1', title: 'Live Q&A: ChatGPT Tips & Tricks', date: 'Thứ 7, 15:00', emoji: '🎙️', type: 'Livestream', attendees: 45 },
  { id: '2', title: 'Workshop: Build AI Automation', date: 'Chủ nhật, 10:00', emoji: '🛠️', type: 'Workshop', attendees: 28 },
  { id: '3', title: 'Office Hours với Alex Le', date: 'Thứ 4, 20:00', emoji: '💬', type: 'Q&A', attendees: 15 },
]

const DEFAULT_GROUPS: GroupPreview[] = [
  { id: '1', name: 'Alex Le AI', slug: 'alex-le-ai', description: 'Cộng đồng học AI cho người đi làm', icon_emoji: '🚀', color: '#1877f2', member_count: 1247, post_count: 892, course_count: 15, privacy: 'public', required_tier: 'free', is_featured: true },
  { id: '2', name: 'ChatGPT Mastery', slug: 'chatgpt-mastery', description: 'Nhóm chuyên sâu về ChatGPT và OpenAI APIs', icon_emoji: '🤖', color: '#10a37f', member_count: 856, post_count: 432, course_count: 8, privacy: 'public', required_tier: 'free', is_featured: true },
  { id: '3', name: 'AI Automation Pro', slug: 'ai-automation-pro', description: 'Tự động hóa mọi thứ với Make, Zapier, n8n kết hợp AI', icon_emoji: '⚡', color: '#f59e0b', member_count: 534, post_count: 267, course_count: 5, privacy: 'public', required_tier: 'free', is_featured: true },
  { id: '4', name: 'AI Art & Design', slug: 'ai-art-design', description: 'Midjourney, DALL-E, Stable Diffusion, Runway', icon_emoji: '🎨', color: '#ec4899', member_count: 423, post_count: 198, course_count: 4, privacy: 'public', required_tier: 'free', is_featured: false },
  { id: '5', name: 'AI Coding Club', slug: 'ai-coding-club', description: 'GitHub Copilot, Cursor, Claude Code. Tăng tốc coding 10x', icon_emoji: '💻', color: '#3b82f6', member_count: 312, post_count: 145, course_count: 3, privacy: 'public', required_tier: 'basic', is_featured: false },
  { id: '6', name: 'Premium AI Masterclass', slug: 'premium-ai-masterclass', description: 'Nhóm VIP với nội dung chuyên sâu và mentoring 1-1', icon_emoji: '👑', color: '#8b5cf6', member_count: 89, post_count: 67, course_count: 6, privacy: 'private', required_tier: 'premium', is_featured: true },
]

export default function LandingPage({ 
  memberCount, 
  postCount, 
  courseCount, 
  posts: previewPosts,
  topMembers: topMembersList,
  onlineCount,
  groups
}: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('community')
  const members = memberCount || 1247
  const totalPosts = postCount || 892
  const courses = courseCount || 15
  const online = onlineCount || Math.floor(members * 0.02)
  const groupsList = groups && groups.length > 0 ? groups : DEFAULT_GROUPS

  // ==================== TAB CONTENT RENDERERS ====================

  const renderCommunityTab = () => (
    <div className="space-y-4">
      {/* Create Post Box */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">👤</div>
          <Link href="/auth/register" className="flex-1 bg-[#f0f2f5] hover:bg-[#e4e6e9] rounded-full px-4 py-2.5 text-gray-500 text-[15px] text-left transition-colors">
            Viết bài chia sẻ...
          </Link>
        </div>
      </div>

      {/* Posts */}
      {previewPosts.map((post, index) => {
        const authorName = post.author?.full_name || post.author?.username || 'Thành viên'
        const authorPoints = post.author?.points || 0
        const authorLevel = getLevelFromPoints(authorPoints)
        const isAdmin = post.author?.role === 'admin'
        const avatar = AVATAR_EMOJIS[index % AVATAR_EMOJIS.length]
        const timeAgo = formatTimeAgo(post.published_at)
        const estimatedComments = Math.max(1, Math.floor(post.likes * (0.1 + Math.random() * 0.2)))
        
        return (
          <article key={post.id} className="bg-white rounded-lg shadow-sm">
            {post.is_pinned && (
              <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                <span className="text-[#1877f2]">📌</span> Bài viết đã ghim
              </div>
            )}
            <div className="p-4 pb-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl">{avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[15px] text-gray-900">{authorName}</span>
                    {isAdmin && <span className="px-1.5 py-0.5 bg-[#1877f2] text-white text-[10px] font-bold rounded">ADMIN</span>}
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">Lv.{authorLevel} {getLevelName(authorLevel)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{timeAgo}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MoreHorizontal className="w-5 h-5 text-gray-500" /></button>
              </div>
            </div>
            <div className="px-4 py-3">
              {post.title && <h3 className="font-semibold text-[15px] text-gray-900 mb-2">{post.title}</h3>}
              <p className="text-[15px] text-gray-900 whitespace-pre-line leading-relaxed">
                {post.content.length > 500 ? post.content.slice(0, 500) + '...' : post.content}
              </p>
            </div>
            <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1"><span className="text-sm">👍</span><span className="ml-1">{post.likes}</span></div>
              <span>{estimatedComments} bình luận</span>
            </div>
            <div className="px-4 py-1 border-t border-gray-100 flex">
              <Link href="/auth/register" className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"><Heart className="w-5 h-5" /><span className="text-sm font-medium">Thích</span></Link>
              <Link href="/auth/register" className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"><MessageCircle className="w-5 h-5" /><span className="text-sm font-medium">Bình luận</span></Link>
              <Link href="/auth/register" className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"><Share2 className="w-5 h-5" /><span className="text-sm font-medium">Chia sẻ</span></Link>
            </div>
          </article>
        )
      })}

      {/* Load More */}
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Lock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Còn {Math.max(0, totalPosts - previewPosts.length)}+ bài viết khác</h3>
        <p className="text-gray-500 text-sm mb-4">Tham gia miễn phí để xem tất cả nội dung</p>
        <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1877f2] hover:bg-[#1664d9] text-white font-semibold rounded-lg transition-colors">
          Tham gia ngay — Miễn phí
        </Link>
      </div>
    </div>
  )

  const renderGroupsTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Khám phá Nhóm</h2>
          <span className="text-sm text-gray-500">{groupsList.length} nhóm</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {groupsList.map((group) => (
            <Link key={group.id} href="/auth/register" className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-16 relative" style={{ background: `linear-gradient(135deg, ${group.color}, ${group.color}88)` }}>
                <div className="absolute -bottom-4 left-4 w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center text-xl">
                  {group.icon_emoji}
                </div>
                {group.privacy === 'private' && (
                  <div className="absolute top-2 right-2 bg-black/30 rounded-full px-2 py-0.5 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-white" /><span className="text-[10px] text-white font-medium">Riêng tư</span>
                  </div>
                )}
              </div>
              <div className="p-4 pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm text-gray-900">{group.name}</h3>
                  {group.required_tier !== 'free' && (
                    <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">{group.required_tier.toUpperCase()}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-1 mb-3">{group.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{group.member_count}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{group.post_count}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{group.course_count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-900 mb-1">Tham gia để khám phá thêm</h3>
        <p className="text-sm text-gray-500 mb-4">Tạo nhóm riêng, tham gia thảo luận trong các nhóm</p>
        <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1877f2] hover:bg-[#1664d9] text-white font-semibold rounded-lg transition-colors">
          Tham gia ngay <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )

  const renderClassroomTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Khóa học AI</h2>
        <div className="grid grid-cols-1 gap-3">
          {SAMPLE_COURSES.map((course) => (
            <Link key={course.id} href="/auth/register" className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-[#1877f2]/30 hover:bg-blue-50/30 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-2xl flex-shrink-0">
                {course.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{course.title}</h3>
                  {course.tier !== 'free' && (
                    <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded flex-shrink-0">{course.tier.toUpperCase()}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons} bài</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">{course.level}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-900 mb-1">Còn {courses - SAMPLE_COURSES.length}+ khóa học khác</h3>
        <p className="text-sm text-gray-500 mb-4">Đăng ký để truy cập tất cả khóa học miễn phí và premium</p>
        <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1877f2] hover:bg-[#1664d9] text-white font-semibold rounded-lg transition-colors">
          Học ngay — Miễn phí <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )

  const renderToolsTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">AI Tools phổ biến</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SAMPLE_TOOLS.map((tool) => (
            <Link key={tool.id} href="/auth/register" className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#1877f2]/30 hover:bg-blue-50/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-2xl flex-shrink-0">
                {tool.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm text-gray-900">{tool.name}</h3>
                  <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                    tool.pricing === 'Free' ? 'bg-green-50 text-green-700' :
                    tool.pricing === 'Freemium' ? 'bg-blue-50 text-blue-700' :
                    'bg-orange-50 text-orange-700'
                  }`}>{tool.pricing}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{tool.desc}</p>
                <span className="text-[10px] text-gray-400 mt-1 inline-block">{tool.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-900 mb-1">50+ AI tools được review</h3>
        <p className="text-sm text-gray-500 mb-4">Reviews chi tiết, so sánh, hướng dẫn sử dụng từ cộng đồng</p>
        <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1877f2] hover:bg-[#1664d9] text-white font-semibold rounded-lg transition-colors">
          Xem tất cả tools <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )

  const renderCalendarTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Sự kiện sắp tới</h2>
        <div className="space-y-3">
          {SAMPLE_EVENTS.map((event) => (
            <Link key={event.id} href="/auth/register" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#1877f2]/30 hover:bg-blue-50/30 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-2xl flex-shrink-0">
                {event.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{event.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">{event.type}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.attendees} tham gia</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-900 mb-1">Live Q&A hàng tuần</h3>
        <p className="text-sm text-gray-500 mb-4">Tham gia để nhận thông báo sự kiện và đặt câu hỏi trực tiếp</p>
        <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1877f2] hover:bg-[#1664d9] text-white font-semibold rounded-lg transition-colors">
          Đăng ký tham gia <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )

  const renderLeaderboardsTab = () => (
    <div className="space-y-4">
      {/* Top 3 Podium */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Bảng xếp hạng</h2>
        <div className="flex items-end justify-center gap-4 mb-6 pt-4">
          {[1, 0, 2].map((idx) => {
            const member = topMembersList[idx]
            if (!member) return null
            const isCenter = idx === 0
            const medals = ['🥇', '🥈', '🥉']
            return (
              <div key={member.id} className={`text-center ${isCenter ? 'order-2' : idx === 1 ? 'order-1' : 'order-3'}`}>
                <div className="text-2xl mb-1">{medals[idx]}</div>
                <div className={`${isCenter ? 'w-16 h-16' : 'w-14 h-14'} rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto text-2xl`}>
                  {AVATAR_EMOJIS[idx]}
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-2 truncate max-w-[100px]">{member.full_name || 'Thành viên'}</p>
                <p className="text-xs text-gray-500">{member.points.toLocaleString()} pts</p>
              </div>
            )
          })}
        </div>

        {/* Rest of leaderboard */}
        <div className="space-y-2">
          {topMembersList.slice(3).map((member, i) => {
            const level = getLevelFromPoints(member.points)
            return (
              <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <span className="w-6 text-center text-sm font-bold text-gray-400">#{i + 4}</span>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg">
                  {AVATAR_EMOJIS[(i + 3) % AVATAR_EMOJIS.length]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{member.full_name || 'Thành viên'}</p>
                  <p className="text-xs text-gray-500">Lv.{level} {getLevelName(level)}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{member.points.toLocaleString()} pts</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-900 mb-1">Tham gia để lên bảng xếp hạng</h3>
        <p className="text-sm text-gray-500 mb-4">Tích điểm bằng cách đăng bài, bình luận, và hoàn thành khóa học</p>
        <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1877f2] hover:bg-[#1664d9] text-white font-semibold rounded-lg transition-colors">
          Bắt đầu ngay <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'community': return renderCommunityTab()
      case 'groups': return renderGroupsTab()
      case 'classroom': return renderClassroomTab()
      case 'tools': return renderToolsTab()
      case 'calendar': return renderCalendarTab()
      case 'leaderboards': return renderLeaderboardsTab()
      default: return renderCommunityTab()
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1877f2] flex items-center justify-center text-xl">🚀</div>
              <span className="font-bold text-lg text-gray-900">Alex Le AI</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Đăng nhập</Link>
              <Link href="/auth/register" className="px-4 py-2 text-sm font-medium text-white bg-[#1877f2] hover:bg-[#1664d9] rounded-lg transition-colors">Tham gia miễn phí</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-14">
        {/* Cover Banner */}
        <div className="bg-gradient-to-r from-[#1877f2] via-[#1890ff] to-[#36cfc9] h-48 md:h-56 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-[10%] text-6xl">🤖</div>
            <div className="absolute top-12 left-[30%] text-5xl">💡</div>
            <div className="absolute top-6 left-[50%] text-6xl">⚡</div>
            <div className="absolute top-16 left-[70%] text-5xl">🎯</div>
            <div className="absolute top-8 left-[85%] text-6xl">🚀</div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">Học AI từ thực chiến</h2>
              <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto drop-shadow">ChatGPT &bull; Claude &bull; Midjourney &bull; Make &bull; Automation</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Community Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1100px] mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16 pb-4 relative z-10">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-5xl md:text-6xl">🚀</div>
              <div className="flex-1 pb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Alex Le AI</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Globe className="w-4 h-4" />Cộng đồng công khai</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{members.toLocaleString()} thành viên</span>
                </div>
              </div>
              <div className="md:pb-2">
                <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1877f2] hover:bg-[#1664d9] text-white font-semibold rounded-lg transition-colors">Tham gia nhóm</Link>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 border-t border-gray-200 -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-[3px] transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-[#1877f2] border-[#1877f2]'
                      : 'text-gray-600 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1100px] mx-auto px-4 py-4">
          <div className="flex gap-4">
            {/* Main */}
            <div className="flex-1 min-w-0">
              {renderTabContent()}
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block w-[340px] space-y-4">
              {/* About */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-bold text-gray-900 mb-3">Giới thiệu</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Cộng đồng học AI cho người đi làm. Chia sẻ case study thực tế về ChatGPT, Claude, Midjourney, Make và các AI tools khác.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600"><Users className="w-5 h-5 text-gray-400" /><span><strong>{members.toLocaleString()}</strong> thành viên</span></div>
                  <div className="flex items-center gap-3 text-gray-600"><MessageSquare className="w-5 h-5 text-gray-400" /><span><strong>{totalPosts}</strong> bài viết</span></div>
                  <div className="flex items-center gap-3 text-gray-600"><BookOpen className="w-5 h-5 text-gray-400" /><span><strong>{courses}</strong> khóa học</span></div>
                </div>
              </div>

              {/* Members */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">Thành viên nổi bật</h3>
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {online} online
                  </span>
                </div>
                <div className="space-y-3">
                  {topMembersList.map((member: TopMember, i: number) => {
                    const memberLevel = getLevelFromPoints(member.points)
                    const memberAvatar = AVATAR_EMOJIS[i % AVATAR_EMOJIS.length]
                    return (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg">{memberAvatar}</div>
                          {i < 3 && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{member.full_name || member.username || 'Thành viên'}</p>
                          <p className="text-xs text-gray-500">Lv.{memberLevel} &bull; {member.points.toLocaleString()} pts</p>
                        </div>
                        {i < 3 && <span className="text-lg">{['🥇', '🥈', '🥉'][i]}</span>}
                      </div>
                    )
                  })}
                </div>
                <Link href="/auth/register" className="block mt-4 text-center text-sm text-[#1877f2] font-medium hover:underline">Xem tất cả thành viên</Link>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-[#1877f2] to-[#1664d9] rounded-lg shadow-sm p-5 text-white">
                <h3 className="font-bold text-lg mb-2">Tham gia cộng đồng</h3>
                <ul className="text-sm space-y-2 mb-4 text-blue-100">
                  <li className="flex items-center gap-2"><span>✓</span> Truy cập tất cả bài viết</li>
                  <li className="flex items-center gap-2"><span>✓</span> Tham gia thảo luận</li>
                  <li className="flex items-center gap-2"><span>✓</span> Khóa học miễn phí</li>
                  <li className="flex items-center gap-2"><span>✓</span> Live Q&A hàng tuần</li>
                </ul>
                <Link href="/auth/register" className="block w-full py-2.5 bg-white text-[#1877f2] font-semibold rounded-lg text-center hover:bg-blue-50 transition-colors">Đăng ký miễn phí</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-4">
        <div className="max-w-[1100px] mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <span>&copy; {new Date().getFullYear()} Alex Le AI. Cộng đồng học AI cho người đi làm.</span>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-gray-900">Điều khoản</Link>
              <Link href="/privacy" className="hover:text-gray-900">Bảo mật</Link>
              <Link href="/pricing" className="hover:text-gray-900">Nâng cấp</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
