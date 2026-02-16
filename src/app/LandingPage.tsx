'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Users,
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

const AI_TOOLS = [
  { name: 'ChatGPT', emoji: '🤖' },
  { name: 'Claude', emoji: '🧠' },
  { name: 'Midjourney', emoji: '🎨' },
  { name: 'Make', emoji: '⚡' },
  { name: 'Cursor', emoji: '💻' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function LandingPage({ memberCount, postCount, courseCount, onlineCount }: LandingPageProps) {
  const members = memberCount || 1247
  const totalPosts = postCount || 892
  const courses = courseCount || 15
  const online = onlineCount || Math.max(1, Math.floor(members * 0.03))

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1877f2] text-xl text-white shadow-md shadow-blue-200">
              🚀
            </div>
            <span className="text-xl font-bold">Alex Le AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">
              Đăng nhập
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl bg-[#1877f2] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1664d9] hover:shadow-lg hover:shadow-blue-200"
            >
              Tham gia miễn phí
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pb-16 pt-32 md:pb-20 md:pt-40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1877f2]/8 via-white to-sky-50" />
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#1877f2]/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-200/25 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#1877f2]/10 px-4 py-2 text-sm font-medium text-[#1877f2]">
                  <Sparkles className="h-4 w-4" />
                  Cộng đồng AI thực chiến cho người đi làm
                </span>
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="mb-5 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl"
              >
                Học AI đơn giản,
                <span className="block bg-gradient-to-r from-[#1877f2] to-[#0ea5e9] bg-clip-text text-transparent">
                  làm việc hiệu quả hơn
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl"
              >
                Case study thực tế, cộng đồng chất lượng, và lộ trình học rõ ràng để bạn ứng dụng AI ngay trong công việc mỗi ngày.
              </motion.p>

              <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-8">
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-[#1877f2] px-8 py-4 text-lg font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1664d9] hover:shadow-xl hover:shadow-blue-200"
                >
                  Tham gia miễn phí
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="mx-auto grid max-w-3xl grid-cols-2 gap-3 text-left sm:grid-cols-4"
              >
                <div className="rounded-xl border border-white bg-white/90 p-4 shadow-sm">
                  <p className="text-2xl font-extrabold text-[#1877f2]">{members.toLocaleString()}+</p>
                  <p className="text-sm text-gray-600">Thành viên</p>
                </div>
                <div className="rounded-xl border border-white bg-white/90 p-4 shadow-sm">
                  <p className="text-2xl font-extrabold text-[#1877f2]">{totalPosts.toLocaleString()}+</p>
                  <p className="text-sm text-gray-600">Bài viết</p>
                </div>
                <div className="rounded-xl border border-white bg-white/90 p-4 shadow-sm">
                  <p className="text-2xl font-extrabold text-[#1877f2]">{courses.toLocaleString()}+</p>
                  <p className="text-sm text-gray-600">Khóa học</p>
                </div>
                <div className="rounded-xl border border-white bg-white/90 p-4 shadow-sm">
                  <p className="text-2xl font-extrabold text-[#1877f2]">{online.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Đang online</p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="mt-6 flex flex-wrap items-center justify-center gap-2"
              >
                {AI_TOOLS.map((tool) => (
                  <span key={tool.name} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm">
                    <span className="mr-1.5">{tool.emoji}</span>
                    {tool.name}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeInUp} className="mb-10 text-center">
              <h2 className="mb-3 text-3xl font-extrabold md:text-4xl">Đủ gọn để dễ bắt đầu, đủ chất để đi xa</h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Tập trung vào 3 thứ quan trọng nhất để bạn học nhanh và áp dụng AI hiệu quả.
              </p>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-3">
              <motion.article initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Target className="h-6 w-6 text-[#1877f2]" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Học AI thực chiến</h3>
                <p className="text-gray-600">Case study ngắn gọn, đi thẳng vào cách làm và kết quả thực tế.</p>
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#1877f2]">
                  <TrendingUp className="h-4 w-4" /> {totalPosts}+ chia sẻ thực tế
                </p>
              </motion.article>

              <motion.article initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Cộng đồng chất lượng</h3>
                <p className="text-gray-600">Hỏi đáp nhanh, trao đổi thực tế, và networking cùng người cùng mục tiêu.</p>
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                  <MessageSquare className="h-4 w-4" /> {members.toLocaleString()}+ thành viên
                </p>
              </motion.article>

              <motion.article initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50">
                  <BookOpen className="h-6 w-6 text-cyan-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Khóa học có lộ trình</h3>
                <p className="text-gray-600">Nội dung từ cơ bản đến nâng cao, học xong áp dụng được ngay.</p>
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan-700">
                  <BookOpen className="h-4 w-4" /> {courses}+ khóa học
                </p>
              </motion.article>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInUp}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1877f2] to-[#0ea5e9] p-10 text-center text-white md:p-14"
            >
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/15" />
              <div className="absolute -bottom-20 -left-14 h-44 w-44 rounded-full bg-white/10" />
              <div className="relative">
                <h2 className="mb-3 text-3xl font-extrabold md:text-4xl">Bắt đầu miễn phí ngay hôm nay</h2>
                <p className="mx-auto mb-8 max-w-xl text-blue-100">
                  Vào cộng đồng, học nhanh từ ví dụ thực tế, và áp dụng AI ngay trong tuần này.
                </p>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-lg font-bold text-[#1877f2] transition-all hover:bg-blue-50"
                >
                  Đăng ký miễn phí
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1877f2] text-lg text-white">🚀</div>
            <span className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Alex Le AI. Cộng đồng học AI cho người đi làm.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/terms" className="transition-colors hover:text-gray-900">Điều khoản</Link>
            <Link href="/privacy" className="transition-colors hover:text-gray-900">Bảo mật</Link>
            <Link href="/pricing" className="transition-colors hover:text-gray-900">Nâng cấp</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
