'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { getUserLevel as getLevelFromPoints, getLevelName, EMOJI_AVATARS as AVATAR_EMOJIS } from '@/lib/gamification'
import {
  Users,
  MessageSquare,
  BookOpen,
  Trophy,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Zap,
  Target,
  Star,
  CheckCircle2,
  Clock,
  GraduationCap,
  Brain,
  Rocket,
  Shield,
} from 'lucide-react'

// ==================== TYPES ====================

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

interface LandingPageProps {
  user: null
  memberCount: number
  postCount: number
  courseCount: number
  posts: PreviewPost[]
  topMembers: TopMember[]
  onlineCount: number
  groups?: unknown[]
}

// ==================== SAMPLE DATA ====================

const FEATURED_COURSES = [
  { id: '1', title: 'ChatGPT từ Zero đến Hero', emoji: '🤖', lessons: 24, duration: '6 giờ', level: 'Cơ bản' },
  { id: '2', title: 'Prompt Engineering Masterclass', emoji: '✍️', lessons: 18, duration: '4.5 giờ', level: 'Trung bình' },
  { id: '3', title: 'Automation với Make.com', emoji: '⚡', lessons: 32, duration: '8 giờ', level: 'Trung bình' },
  { id: '4', title: 'AI cho Marketing & Sales', emoji: '📈', lessons: 20, duration: '5 giờ', level: 'Cơ bản' },
]

const AI_TOOLS = [
  { name: 'ChatGPT', emoji: '🤖' },
  { name: 'Claude', emoji: '🧠' },
  { name: 'Midjourney', emoji: '🎨' },
  { name: 'Make.com', emoji: '⚡' },
  { name: 'Cursor', emoji: '💻' },
  { name: 'Perplexity', emoji: '🔍' },
  { name: 'Gemini', emoji: '✨' },
  { name: 'Runway', emoji: '🎬' },
]

const BENEFITS = [
  'Truy cập tất cả bài viết và khóa học miễn phí',
  'Tham gia thảo luận với cộng đồng',
  'Live Q&A hàng tuần với chuyên gia',
  'Cập nhật AI tools mới nhất',
  'Networking với những người cùng chí hướng',
]

// ==================== ANIMATED COUNTER ====================

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, target, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ==================== ANIMATION VARIANTS ====================

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ==================== MAIN COMPONENT ====================

export default function LandingPage({
  memberCount,
  postCount,
  courseCount,
  posts: previewPosts,
  topMembers: topMembersList,
  onlineCount,
}: LandingPageProps) {
  const members = memberCount || 1247
  const totalPosts = postCount || 892
  const courses = courseCount || 15
  const online = onlineCount || Math.max(1, Math.floor(members * 0.02))

  return (
    <div className="min-h-screen bg-white">
      {/* ==================== HEADER ==================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1877f2] flex items-center justify-center text-xl shadow-md shadow-blue-200">
                🚀
              </div>
              <span className="font-bold text-xl text-gray-900">Alex Le AI</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1877f2] hover:bg-[#1664d9] rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200"
              >
                Tham gia miễn phí
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1877f2]/5 via-white to-purple-50" />
          {/* Decorative circles */}
          <div className="absolute top-20 -left-32 w-96 h-96 bg-[#1877f2]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877f2]/10 text-[#1877f2] rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  Cộng đồng học AI #1 cho người đi làm tại Việt Nam
                </span>
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
              >
                Học AI thực chiến,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1877f2] to-[#6366f1]">
                  ứng dụng ngay
                </span>{' '}
                vào công việc
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.1, duration: 0.6 } } }}
                className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
              >
                Từ ChatGPT, Claude đến Midjourney, Make.com — học cách sử dụng AI để tiết kiệm hàng giờ làm việc mỗi ngày, cùng cộng đồng {members.toLocaleString()}+ thành viên.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.2, duration: 0.6 } } }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              >
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white bg-[#1877f2] hover:bg-[#1664d9] rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5"
                >
                  Tham gia miễn phí
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
                >
                  <BookOpen className="w-5 h-5" />
                  Xem khóa học
                </Link>
              </motion.div>

              {/* AI Tool badges */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="flex flex-wrap justify-center gap-3"
              >
                {AI_TOOLS.map((tool) => (
                  <motion.div
                    key={tool.name}
                    variants={scaleIn}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm text-gray-700 hover:shadow-md hover:border-gray-200 transition-all"
                  >
                    <span className="text-lg">{tool.emoji}</span>
                    {tool.name}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================== STATS BAR ==================== */}
        <section className="py-8 bg-[#1877f2]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
              <div>
                <div className="text-3xl md:text-4xl font-extrabold">
                  <AnimatedCounter target={members} suffix="+" />
                </div>
                <div className="text-blue-100 text-sm mt-1">Thành viên</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold">
                  <AnimatedCounter target={totalPosts} suffix="+" />
                </div>
                <div className="text-blue-100 text-sm mt-1">Bài viết</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold">
                  <AnimatedCounter target={courses} suffix="+" />
                </div>
                <div className="text-blue-100 text-sm mt-1">Khóa học</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <AnimatedCounter target={online} />
                </div>
                <div className="text-blue-100 text-sm mt-1">Đang online</div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== VALUE PROPOSITIONS ==================== */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Tại sao chọn Alex Le AI?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Không chỉ là lý thuyết — đây là nơi bạn học AI từ những case study thực tế và áp dụng ngay lập tức.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {/* Value Prop 1 */}
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-[#1877f2]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Học AI thực chiến</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Case study thực tế từ các thành viên. Tiết kiệm 2-3 giờ/ngày nhờ tự động hóa bằng AI. Không lý thuyết suông — chỉ kết quả thực.
                </p>
                <div className="flex items-center gap-2 text-sm text-[#1877f2] font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {totalPosts}+ case study được chia sẻ
                </div>
              </motion.div>

              {/* Value Prop 2 */}
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Cộng đồng chất lượng</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Kết nối với {members.toLocaleString()}+ thành viên — từ marketer, developer, đến founder. Hỏi đáp, chia sẻ, và networking có giá trị.
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                  <MessageSquare className="w-4 h-4" />
                  Thảo luận sôi nổi mỗi ngày
                </div>
              </motion.div>

              {/* Value Prop 3 */}
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                  <GraduationCap className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Khóa học & nội dung</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {courses}+ khóa học có cấu trúc từ cơ bản đến nâng cao. Learning paths rõ ràng, cập nhật công cụ AI mới nhất mỗi tuần.
                </p>
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <BookOpen className="w-4 h-4" />
                  {courses}+ khóa học sẵn sàng
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ==================== COURSE PREVIEW ==================== */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Khóa học nổi bật
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Từ zero đến pro — khóa học được thiết kế để bạn áp dụng ngay sau khi học.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {FEATURED_COURSES.map((course) => (
                <motion.div key={course.id} variants={fadeInUp}>
                  <Link
                    href="/auth/register"
                    className="block bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#1877f2]/30 hover:shadow-lg transition-all group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                      {course.emoji}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 leading-snug">{course.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.lessons} bài
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.duration}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                        {course.level}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mt-10"
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 text-[#1877f2] font-semibold hover:underline"
              >
                Xem tất cả {courses}+ khóa học
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ==================== COMMUNITY PREVIEW ==================== */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Thảo luận sôi nổi mỗi ngày
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những bài viết được chia sẻ gần đây trong cộng đồng.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {previewPosts.slice(0, 3).map((post, index) => {
                const authorName = post.author?.full_name || post.author?.username || 'Thành viên'
                const authorPoints = post.author?.points || 0
                const authorLevel = getLevelFromPoints(authorPoints)
                const avatar = AVATAR_EMOJIS[index % AVATAR_EMOJIS.length]

                return (
                  <motion.article
                    key={post.id}
                    variants={fadeInUp}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl">
                        {avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{authorName}</p>
                        <p className="text-xs text-gray-500">
                          Lv.{authorLevel} {getLevelName(authorLevel)}
                        </p>
                      </div>
                    </div>
                    {post.title && (
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                      {post.content.slice(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" />
                        {post.likes} lượt thích
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {Math.max(0, Math.floor(post.likes * 0.15))} bình luận
                      </span>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>

            {/* Blurred overlay CTA */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-10 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Còn {Math.max(0, totalPosts - 3)}+ bài viết khác
                </h3>
                <p className="text-gray-500 mb-6">
                  Tham gia để đọc tất cả bài viết, bình luận, và chia sẻ case study của bạn.
                </p>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1877f2] hover:bg-[#1664d9] text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200"
                >
                  Tham gia cộng đồng
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== TOP MEMBERS ==================== */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Thành viên nổi bật
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những người dẫn đầu cộng đồng — tích cực chia sẻ và hỗ trợ lẫn nhau.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6"
            >
              {topMembersList.slice(0, 5).map((member, i) => {
                const level = getLevelFromPoints(member.points)
                const avatar = AVATAR_EMOJIS[i % AVATAR_EMOJIS.length]
                const medals = ['🥇', '🥈', '🥉']

                return (
                  <motion.div
                    key={member.id}
                    variants={scaleIn}
                    className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-lg transition-all"
                  >
                    {i < 3 && <div className="text-2xl mb-2">{medals[i]}</div>}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-3xl mx-auto mb-3">
                      {avatar}
                    </div>
                    <p className="font-bold text-gray-900 truncate">
                      {member.full_name || member.username || 'Thành viên'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Lv.{level} {getLevelName(level)}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        {member.points.toLocaleString()} pts
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Bắt đầu trong 3 bước
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  step: '01',
                  icon: Rocket,
                  title: 'Đăng ký miễn phí',
                  desc: 'Tạo tài khoản trong 30 giây. Không cần thẻ tín dụng.',
                },
                {
                  step: '02',
                  icon: Brain,
                  title: 'Học và thực hành',
                  desc: 'Truy cập khóa học, đọc case study, và hỏi đáp với cộng đồng.',
                },
                {
                  step: '03',
                  icon: Zap,
                  title: 'Áp dụng vào công việc',
                  desc: 'Tiết kiệm hàng giờ mỗi ngày nhờ sử dụng AI hiệu quả.',
                },
              ].map((item) => (
                <motion.div key={item.step} variants={fadeInUp} className="text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-[#1877f2]" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-[#1877f2] text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#1877f2] to-[#4f46e5] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden"
            >
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <Shield className="w-12 h-12 text-white/80 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                  Sẵn sàng học AI thực chiến?
                </h2>
                <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
                  Tham gia cộng đồng {members.toLocaleString()}+ thành viên đang học và ứng dụng AI mỗi ngày.
                </p>

                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10 text-sm text-blue-100">
                  {BENEFITS.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/register"
                  className="group inline-flex items-center gap-2 px-10 py-4 text-lg font-bold text-[#1877f2] bg-white hover:bg-blue-50 rounded-2xl transition-all hover:shadow-xl"
                >
                  Đăng ký miễn phí ngay
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-xs text-blue-200 mt-4">
                  Miễn phí vĩnh viễn. Không cần thẻ tín dụng.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1877f2] flex items-center justify-center text-lg">
                🚀
              </div>
              <span className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Alex Le AI. Cộng đồng học AI cho người đi làm.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/terms" className="hover:text-gray-900 transition-colors">
                Điều khoản
              </Link>
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                Bảo mật
              </Link>
              <Link href="/pricing" className="hover:text-gray-900 transition-colors">
                Nâng cấp
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
